from fastapi import APIRouter, HTTPException
from pydantic import BaseModel  # <--- ADDED THIS
from app.blockchain.adapter import (
    accept_offer,
    trigger_default,
    is_borrower_flagged,
    get_offer_amount,
    create_offer_custodial      # <--- ADDED THIS
)

router = APIRouter()

# ---------------------------------------------------------
# 1. NEW ENDPOINT: Create Offer (Custodial)
# ---------------------------------------------------------

class CreateOfferRequest(BaseModel):
    lenderAddress: str
    amountEth: float
    durationDays: int
    minCreditScore: int

# In app/api/routes.py

@router.post("/lender/create-offer")
def create_offer_endpoint(payload: CreateOfferRequest):
    try:
        duration_seconds = payload.durationDays * 86400
        
        # Now returns a dict with 'offerId'
        result = create_offer_custodial(
            lender_address=payload.lenderAddress, 
            duration=duration_seconds,
            min_credit_score=payload.minCreditScore,
            amount_eth=payload.amountEth
        )
        
        return {
            "success": True,
            "txHash": result["txHash"],
            "offerId": result["offerId"]  # <--- This is what you need for your DB!
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# ---------------------------------------------------------
# 2. EXISTING ENDPOINTS
# ---------------------------------------------------------

# In app/api/routes.py

@router.post("/loan/accept")
def accept_offer_api(payload: dict):
    # 1. Validate Inputs
    required = ["offerId", "borrower", "interestRate", "isInsured", "insurer"]
    for field in required:
        if field not in payload:
            raise HTTPException(status_code=400, detail=f"Missing {field}")

    offer_id = payload["offerId"]
    interest_rate_percent = payload["interestRate"] # e.g., 8 or 10.5
    
    # 2. Fetch Principal Amount from Blockchain
    # We need this to calculate the exact interest amount in Wei
    try:
        principal_wei = get_offer_amount(offer_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Offer not found or chain error: {str(e)}")

    if principal_wei <= 0:
        raise HTTPException(status_code=400, detail="Offer is not active or has 0 balance")

    # 3. Calculate Interest Amount (in Wei)
    # Formula: Principal * Rate / 100
    # We use integer math for precision (Basis points approach is safer, but this is simple)
    interest_wei = int(principal_wei * interest_rate_percent / 100)

    # 4. Execute Blockchain Transaction
    try:
        tx_hash = accept_offer(
            offer_id=offer_id,
            borrower=payload["borrower"],
            interest=interest_wei,
            is_insured=payload["isInsured"],
            insurer=payload["insurer"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain error: {str(e)}")

    return {
        "success": True,
        "txHash": tx_hash,
        "loanDetails": {
            "principalWei": principal_wei,
            "interestWei": interest_wei,
            "rate": interest_rate_percent
        }
    }

@router.post("/loan/default/{loan_id}")
def default_loan(loan_id: int):
    try:
        return {"txHash": trigger_default(loan_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/borrower/{address}/flagged")
def borrower_flagged(address: str):
    return {"flagged": is_borrower_flagged(address)}