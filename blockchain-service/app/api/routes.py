from fastapi import APIRouter, HTTPException
from app.blockchain.adapter import (
    accept_offer,
    trigger_default,
    is_borrower_flagged
)

router = APIRouter()


@router.post("/loan/accept")
def accept_offer_api(payload: dict):
    required = ["offerId", "borrower", "creditScore", "isInsured", "insurer"]
    for field in required:
        if field not in payload:
            raise HTTPException(status_code=400, detail=f"Missing {field}")

    # 🔥 Interest calculated from credit score (example)
    credit_score = payload["creditScore"]

    if credit_score >= 750:
        interest = 5 * 10**16      # 5%
    elif credit_score >= 650:
        interest = 10 * 10**16     # 10%
    else:
        interest = 20 * 10**16     # 20%

    tx_hash = accept_offer(
        offer_id=payload["offerId"],
        borrower=payload["borrower"],
        interest=interest,
        is_insured=payload["isInsured"],
        insurer=payload["insurer"]
    )

    return {"txHash": tx_hash}


@router.post("/loan/default/{loan_id}")
def default_loan(loan_id: int):
    return {"txHash": trigger_default(loan_id)}


@router.get("/borrower/{address}/flagged")
def borrower_flagged(address: str):
    return {"flagged": is_borrower_flagged(address)}
