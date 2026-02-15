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
    GENERATES and SAVES all the missing loan fields.
    Calculates interest amounts, premiums, and timestamps before saving.
    """
    try:
        # 1. Fetch the Offer details (Source of Truth for Principal & Duration)
        offer_res = supabase.table("lender_loan_options").select("*").eq("chain_offer_id", chain_offer_id).single().execute()
        if not offer_res.data:
            print(f"❌ Offer {chain_offer_id} not found in DB")
            return False
        
        offer = offer_res.data
        principal = float(offer['amount_available'])
        duration = int(offer['duration_days'])
        lender_wallet = offer['lender_wallet']
        lender_id = offer['lender_id']
        option_id = offer['id']

        # 2. Update Borrower Stats
        borrower_id = get_user_id_by_wallet(borrower_wallet)
        prof_res = supabase.table("profiles").select("*").eq("wallet", borrower_wallet).execute()
        
        if prof_res.data:
            current = prof_res.data[0]
            supabase.table("profiles").update({
                "total_transactions": (current.get('total_transactions') or 0) + 1,
                "num_previous_loans": (current.get('num_previous_loans') or 0) + 1,
                "total_previous_loans_eth": (current.get('total_previous_loans_eth') or 0.0) + principal,
                "updated_at": datetime.now().isoformat()
            }).eq("wallet", borrower_wallet).execute()

        # ---------------------------------------------------------
        # 3. CALCULATE THE MISSING FIELDS
        # ---------------------------------------------------------
        
        # TIME
        start_date = datetime.now()
        due_date = start_date + timedelta(days=duration)
        
        # MATH
        interest_amount = (principal * interest_rate) / 100.0
        apr_bps = int(interest_rate * 100) # 10.5% -> 1050 bps
        
        # INSURANCE (Default 1% / 100bps if insured)
        premium_bps = 100 if is_insured else 0 
        insurance_amount = (principal * premium_bps) / 10000.0 if is_insured else 0

        loan_data = {
            "loan_id": str(blockchain_loan_id),   # From Blockchain
            "borrower_wallet": borrower_wallet,   # From API
            "lender_wallet": lender_wallet,       # From DB Lookup
            "borrower_id": borrower_id,
            "lender_id": lender_id,
            "selected_option_id": option_id,
            
            # Financials
            "principal": principal,
            "interest_amount": interest_amount,           # <--- Calculated Here
            "insurance_premium_amount": insurance_amount, # <--- Calculated Here
            "apr_bps": apr_bps,
            "premium_bps": premium_bps,
            
            # Status & Time
            "status": "active",
            "start_ts": start_date.isoformat(),   # <--- Generated Here
            "due_ts": due_date.isoformat(),       # <--- Calculated Here
            
            # Blockchain Proof
            "tx_create_hash": tx_hash,            # <--- Passed from Adapter
        }
        
        if is_insured:
            loan_data["insurer_wallet"] = insurer_wallet

        # 4. Insert into Loans Table
        supabase.table("loans").insert(loan_data).execute()

        # 5. Close the Offer
        supabase.table("lender_loan_options").update({"active": False}).eq("chain_offer_id", chain_offer_id).execute()
        
        print(f"✅ Loan {blockchain_loan_id} finalized with full details in DB")
        return True

    except Exception as e:
        print(f"❌ DB Finalization Error: {e}")
        return False