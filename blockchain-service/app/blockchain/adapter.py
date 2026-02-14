from dotenv import load_dotenv
load_dotenv()

import os
from app.blockchain.provider import w3
from app.blockchain.contracts import (
    loan_escrow,
    reputation_registry,
    liquidity_pool
)

PRIVATE_KEY = os.getenv("BACKEND_PRIVATE_KEY")
if not PRIVATE_KEY:
    raise RuntimeError("BACKEND_PRIVATE_KEY not found")

account = w3.eth.account.from_key(PRIVATE_KEY)

print("✅ Backend blockchain signer loaded:", account.address)


# -------------------------------
# WRITE OPERATIONS
# -------------------------------

def accept_offer(
    offer_id: int,
    borrower: str,
    interest: int,
    is_insured: bool,
    insurer: str
) -> str:
    """
    Accept lender offer and create loan.
    Principal & duration come from on-chain offer.
    """

    tx = liquidity_pool.functions.acceptOffer(
        offer_id,
        borrower,
        interest,
        is_insured,
        insurer
    ).build_transaction({
        "from": account.address,
        "nonce": w3.eth.get_transaction_count(account.address),
        "gas": 600_000,
        "gasPrice": w3.eth.gas_price,
    })

    signed = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)

    return tx_hash.hex()


def trigger_default(loan_id: int) -> str:
    tx = loan_escrow.functions.markDefault(loan_id).build_transaction({
        "from": account.address,
        "nonce": w3.eth.get_transaction_count(account.address),
        "gas": 200_000,
        "gasPrice": w3.eth.gas_price,
    })

    signed = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    return w3.eth.send_raw_transaction(signed.raw_transaction).hex()


# -------------------------------
# READ OPERATIONS
# -------------------------------

def is_borrower_flagged(address: str) -> bool:
    return reputation_registry.functions.isBorrowerFlagged(address).call()
