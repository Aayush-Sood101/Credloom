from fastapi import APIRouter, HTTPException
from app.blockchain.adapter import (
    accept_offer,
    trigger_default,
    is_borrower_flagged,
    get_offer_amount
)

router = APIRouter()


@router.post("/loan/accept")
def accept_offer_api(payload: dict):
    required = ["offerId", "borrower", "creditScore", "isInsured", "insurer"]
    for field in required:
        if field not in payload:
            raise HTTPException(status_code=400, detail=f"Missing {field}")

    offer_id = payload["offerId"]
    credit_score = payload["creditScore"]
    
    # 1. Fetch principal from chain to calculate correct interest
    try:
        principal = get_offer_amount(offer_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Offer not found or chain error: {str(e)}")

    # 2. Determine Interest Rate (Basis Points)
    # 750+ -> 5% (500 bps), 650+ -> 10% (1000 bps), else 20% (2000 bps)
    if credit_score >= 750:
        rate_bps = 500 
    elif credit_score >= 650:
        rate_bps = 1000
    else:
        rate_bps = 2000

    # 3. Calculate Interest Amount
    # Interest = Principal * Rate / 10000
    interest = (principal * rate_bps) // 10000

    # 4. Execute Transaction
    try:
        tx_hash = accept_offer(
            offer_id=offer_id,
            borrower=payload["borrower"],
            interest=interest,
            is_insured=payload["isInsured"],
            insurer=payload["insurer"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain error: {str(e)}")

    return {"txHash": tx_hash, "calculatedInterest": interest}


@router.post("/loan/default/{loan_id}")
def default_loan(loan_id: int):
    return {"txHash": trigger_default(loan_id)}


@router.get("/borrower/{address}/flagged")
def borrower_flagged(address: str):
    return {"flagged": is_borrower_flagged(address)}