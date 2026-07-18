from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()

class AnalyseRequest(BaseModel):
    aoiId: str
    runId: str
    baselineSceneId: str
    targetSceneId: str
    sensitivityLevel: str

@router.post("/analyse")
async def trigger_analysis(request: AnalyseRequest, background_tasks: BackgroundTasks):
    # Stub for analysis execution trigger
    return {
        "jobId": "gse_job_stub_" + request.runId,
        "status": "QUEUED"
    }
