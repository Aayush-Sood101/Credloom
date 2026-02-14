from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="CredLoom Blockchain Service")

app.include_router(router)
