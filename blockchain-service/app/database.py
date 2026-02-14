import os
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timedelta

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
        lender_id = get_user_id_by_wallet(lender_wallet)

        data = {
            "chain_offer_id": offer_id,
            "lender_wallet": lender_wallet,
            "lender_id": lender_id,
            "amount_available": amount_eth,
            "min_amount": amount_eth,
            "duration_days": duration_days,
            "min_score": min_credit_score,
            "active": True
        }

        response = supabase.table("lender_loan_options").insert(data).execute()
        print(f"✅ Proposal saved to Supabase: {response.data}")
        return response.data

    except Exception as e:
        print(f"❌ Failed to save proposal: {e}")

def get_active_offers():
    """
    Fetches offers from Supabase for the Marketplace.
    """
    try:
        response = supabase.table("lender_loan_options")\
            .select("*")\
            .eq("active", True)\
            .execute()
        return response.data
    except Exception as e:
        print(f"❌ DB Error: {e}")
        return []

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
        # 1. Fetch the Offer details
        offer_res = supabase.table("lender_loan_options").select("*").eq("chain_offer_id", chain_offer_id).single().execute()
        if not offer_res.data:
            print(f"❌ Offer {chain_offer_id} not found in DB")
            return False
        
        offer = offer_res.data
        principal = offer['amount_available']
        duration = offer['duration_days']
        lender_wallet = offer['lender_wallet']
        lender_id = offer['lender_id']
        option_id = offer['id']

        # 2. Get Borrower ID
        borrower_id = get_user_id_by_wallet(borrower_wallet)

        # 3. Update Borrower Profile (Stats) safely using Python logic
        prof_res = supabase.table("profiles").select("*").eq("wallet", borrower_wallet).execute()
        
        if prof_res.data:
            current_stats = prof_res.data[0]
            # Calculate new stats
            new_tx_count = (current_stats.get('total_transactions') or 0) + 1
            new_loan_count = (current_stats.get('num_previous_loans') or 0) + 1
            new_total_eth = (current_stats.get('total_previous_loans_eth') or 0.0) + principal

            supabase.table("profiles").update({
                "total_transactions": new_tx_count,
                "num_previous_loans": new_loan_count,
                "total_previous_loans_eth": new_total_eth,
                "updated_at": datetime.now().isoformat()
            }).eq("wallet", borrower_wallet).execute()
        else:
            print(f"⚠️ Borrower profile not found for {borrower_wallet}, skipping stats update.")

        # 4. Create the Loan Record
        start_date = datetime.now()
        due_date = start_date + timedelta(days=duration)
        
        loan_data = {
            "loan_id": blockchain_loan_id,
            "borrower_wallet": borrower_wallet,
            "lender_wallet": lender_wallet,
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
        
        if is_insured:
            loan_data["insurer_wallet"] = insurer_wallet

        supabase.table("loans").insert(loan_data).execute()

        # 5. Mark Offer as Inactive
        supabase.table("lender_loan_options").update({"active": False}).eq("chain_offer_id", chain_offer_id).execute()
        
        print(f"✅ Loan {blockchain_loan_id} successfully finalized in DB")
        return True

    except Exception as e:
        print(f"❌ DB Finalization Error: {e}")
        return False