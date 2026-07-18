import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, analyse

load_dotenv()

GSE_INTERNAL_SECRET = os.getenv("GSE_INTERNAL_SECRET", "change_this_secret")

app = FastAPI(
    title="SAT-MSS Geospatial Engine (GSE)",
    description="Geospatial analysis, change detection, and satellite ingestion engine",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication Dependency for GSE Internal API
async def verify_gse_secret(x_gse_secret: str = Header(...)):
    if x_gse_secret != GSE_INTERNAL_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid GSE Internal Secret credentials",
        )

# Register Routers
app.include_router(health.router)
app.include_router(
    analyse.router,
    prefix="/internal",
    dependencies=[Depends(verify_gse_secret)],
    tags=["internal"],
)
