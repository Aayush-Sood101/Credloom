from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.blockchain.adapter import (
    accept_offer,
    trigger_default,
    is_borrower_flagged,
    get_offer_amount,
    create_offer_custodial
)
from app.database import create_loan_proposal, get_active_offers, finalize_loan_acceptance

router = APIRouter()

class CreateOfferRequest(BaseModel):
    lenderAddress: str
    amountEth: float
    durationDays: int
    minCreditScore: int

@router.post("/lender/create-offer")
def create_offer_endpoint(payload: CreateOfferRequest):
    try:
        duration_seconds = payload.durationDays * 86400
        result = create_offer_custodial(
            lender_address=payload.lenderAddress, 
            duration=duration_seconds,
            min_credit_score=payload.minCreditScore,
            amount_eth=payload.amountEth
        )
        # Supabase update
        create_loan_proposal(
            offer_id=result["offerId"],
            lender_wallet=payload.lenderAddress,
            amount_eth=payload.amountEth,
            duration_days=payload.durationDays,
            min_credit_score=payload.minCreditScore
        )
        return {"success": True, "txHash": result["txHash"], "offerId": result["offerId"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/market/offers")
def get_open_offers_api():
    try:
        offers = get_active_offers()
        formatted_offers = []
        for o in offers:
            formatted_offers.append({
                "offerId": o["chain_offer_id"],
                "lender": o["lender_wallet"],
                "amountEth": o["amount_available"],
                "durationDays": o["duration_days"],
                "minCreditScore": o["min_score"]
            })
        return {"offers": formatted_offers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/loan/accept")
def accept_offer_api(payload: dict):
    required = ["offerId", "borrower", "interestRate", "isInsured", "insurer"]
    for field in required:
        if field not in payload:
            raise HTTPException(status_code=400, detail=f"Missing {field}")

    offer_id = payload["offerId"]
    interest_rate = payload["interestRate"]
    
    try:
        # 1. Fetch Principal from Chain
        principal_wei = get_offer_amount(offer_id)
        interest_wei = int(principal_wei * interest_rate / 100)
        
        # 2. Blockchain Execution (Fixed keyword argument from 'interest_wei' to 'interest')
        blockchain_result = accept_offer(
            offer_id=offer_id,
            borrower=payload["borrower"],
            interest=interest_wei, # Matches adapter.py definition
            is_insured=payload["isInsured"],
            insurer=payload["insurer"]
        )
        
        # 3. Database Finalization (Sync to loans table)
        db_success = finalize_loan_acceptance(
            chain_offer_id=offer_id,
            blockchain_loan_id=blockchain_result["blockchainLoanId"],
            borrower_wallet=payload["borrower"],
            interest_rate=interest_rate,
            tx_hash=blockchain_result["txHash"],
            is_insured=payload["isInsured"],
            insurer_wallet=payload["insurer"]
        )

        return {
            "success": True, 
            "txHash": blockchain_result["txHash"],
            "loanId": blockchain_result["blockchainLoanId"],
            "db_updated": db_success
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/loan/default/{loan_id}")
def default_loan(loan_id: int):
    try:
        return {"txHash": trigger_default(loan_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/borrower/{address}/flagged")
def borrower_flagged(address: str):
    return {"flagged": is_borrower_flagged(address)}