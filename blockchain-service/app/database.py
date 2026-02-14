import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("❌ Supabase credentials missing in .env")

# Initialize Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_user_id_by_wallet(wallet_address: str):
    """
    Helper: Looks up the 'users' table to find the ID associated with a wallet.
    Returns None if user not found.
    """
    try:
        # Check 'wallets' table first, or 'users' primary_wallet
        # Assuming 'users' table has 'primary_wallet' as unique
        response = supabase.table("users").select("id").eq("primary_wallet", wallet_address).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]['id']
        return None
    except Exception as e:
        print(f"⚠️ Error fetching user ID: {e}")
        return None

def create_loan_proposal(
    offer_id: int,
    lender_wallet: str,
    amount_eth: float,
    duration_days: int,
    min_credit_score: int
):
    """
    Saves a new Lender Offer into 'lender_loan_options'.
    """
    try:
        # 1. Try to link to a registered user (optional but good for data integrity)
        lender_id = get_user_id_by_wallet(lender_wallet)

        # 2. Prepare Data
        data = {
            "chain_offer_id": offer_id,          # The ID from Blockchain
            "lender_wallet": lender_wallet,
            "lender_id": lender_id,              # Can be None if user not registered in Web2 DB
            "amount_available": amount_eth,      # The ETH amount
            "min_amount": amount_eth,            # For this specific offer, min = max
            "duration_days": duration_days,
            "min_score": min_credit_score,
            "active": True
        }

        # 3. Insert into Supabase
        response = supabase.table("lender_loan_options").insert(data).execute()
        
        print(f"✅ Proposal saved to Supabase: {response.data}")
        return response.data

    except Exception as e:
        print(f"❌ Failed to save proposal: {e}")
        # We don't raise error here to prevent blocking the API response 
        # (The blockchain tx was successful, so we return success to user)

def get_active_offers():
    """
    Fetches offers from Supabase for the Marketplace.
    """
    try:
        # Fetch active offers that haven't been taken (implied by existence in this table + active=true)
        response = supabase.table("lender_loan_options")\
            .select("*")\
            .eq("active", True)\
            .execute()
            
        return response.data
    except Exception as e:
        print(f"❌ DB Error: {e}")
        return []
    

# Add these functions to app/database.py
from datetime import datetime, timedelta

def finalize_loan_acceptance(
    chain_offer_id: int,
    blockchain_loan_id: str,
    borrower_wallet: str,
    interest_rate: float,
    tx_hash: str,
    is_insured: bool,
    insurer_wallet: str
):
    """
    Handles all DB updates once a loan is accepted on the blockchain.
    """
    try:
        # 1. Fetch the Offer details from Supabase
        offer_res = supabase.table("lender_loan_options").select("*").eq("chain_offer_id", chain_offer_id).single().execute()
        if not offer_res.data:
            raise ValueError(f"Offer {chain_offer_id} not found in DB")
        
        offer = offer_res.data
        principal = offer['amount_available']
        duration = offer['duration_days']
        lender_wallet = offer['lender_wallet']
        lender_id = offer['lender_id']
        option_id = offer['id']

        # 2. Update Borrower Profile (Stats)
        # Increment total_transactions and previous loan count
        borrower_id = get_user_id_by_wallet(borrower_wallet)
        
        # We use a RPC or separate updates if needed, but here's a direct update
        prof_res = supabase.table("profiles").select("total_transactions", "num_previous_loans", "total_previous_loans_eth").eq("wallet", borrower_wallet).execute()
        
        if prof_res.data:
            current_stats = prof_res.data[0]
            supabase.table("profiles").update({
                "total_transactions": (current_stats.get('total_transactions') or 0) + 1,
                "num_previous_loans": (current_stats.get('num_previous_loans') or 0) + 1,
                "total_previous_loans_eth": (current_stats.get('total_previous_loans_eth') or 0.0) + principal,
                "updated_at": datetime.now().isoformat()
            }).eq("wallet", borrower_wallet).execute()

        # 3. Create the Loan Record
        start_date = datetime.now()
        due_date = start_date + timedelta(days=duration)
        
        loan_data = {
            "loan_id": blockchain_loan_id,
            "borrower_wallet": borrower_wallet,
            "lender_wallet": lender_wallet,
            "insurer_wallet": insurer_wallet if is_insured else None,
            "principal": principal,
            "interest_amount": (principal * interest_rate / 100),
            "duration_days": duration,
            "status": "active",
            "apr_bps": int(interest_rate * 100),
            "start_ts": start_date.isoformat(),
            "due_ts": due_date.isoformat(),
            "tx_create_hash": tx_hash,
            "borrower_id": borrower_id,
            "lender_id": lender_id,
            "selected_option_id": option_id
        }
        supabase.table("loans").insert(loan_data).execute()

        # 4. Mark Offer as Inactive (Remove from marketplace)
        supabase.table("lender_loan_options").update({"active": False}).eq("chain_offer_id", chain_offer_id).execute()
        
        print(f"✅ Loan {blockchain_loan_id} successfully finalized in DB")
        return True

    except Exception as e:
        print(f"❌ DB Finalization Error: {e}")
        return False
    

from datetime import datetime, timedelta

def finalize_loan_acceptance(
    chain_offer_id: int,
    blockchain_loan_id: str,
    borrower_wallet: str,
    interest_rate: float,
    tx_hash: str,
    is_insured: bool,
    insurer_wallet: str
):
    try:
        # 1. Fetch Offer Details
        offer = supabase.table("lender_loan_options").select("*").eq("chain_offer_id", chain_offer_id).single().execute().data
        principal = offer['amount_available']
        
        # 2. Update Borrower Profile (Transaction Stats)
        # We increment total_transactions and previous loan count
        supabase.rpc('increment_borrower_stats', {'w': borrower_wallet, 'p': principal}).execute()

        # 3. Create Active Loan Record
        start_date = datetime.now()
        due_date = start_date + timedelta(days=offer['duration_days'])
        
        loan_data = {
            "loan_id": blockchain_loan_id,
            "borrower_wallet": borrower_wallet,
            "lender_wallet": offer['lender_wallet'],
            "principal": principal,
            "interest_amount": (principal * interest_rate / 100),
            "status": "active",
            "apr_bps": int(interest_rate * 100),
            "start_ts": start_date.isoformat(),
            "due_ts": due_date.isoformat(),
            "tx_create_hash": tx_hash,
            "selected_option_id": offer['id']
        }
        
        if is_insured:
            loan_data["insurer_wallet"] = insurer_wallet
            # You can fetch insurer_bps from insurer_profiles here if needed

        supabase.table("loans").insert(loan_data).execute()

        # 4. Remove Offer from Marketplace
        supabase.table("lender_loan_options").update({"active": False}).eq("chain_offer_id", chain_offer_id).execute()
        
        return True
    except Exception as e:
        print(f"❌ DB Error: {e}")
        return False