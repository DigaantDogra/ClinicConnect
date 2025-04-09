from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from model_loader import load_model, generate_plan
from fastapi.middleware.cors import CORSMiddleware
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, tokenizer
    try:
        model, tokenizer = load_model(os.getenv("MODEL_PATH"))
    except Exception as e:
        raise RuntimeError(f"Model loading failed: {str(e)}")
    yield  # App runs here

app = FastAPI(lifespan=lifespan)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model, tokenizer = None, None

class CarePlanRequest(BaseModel):
    patient_profile: str
    condition: str
    subtype: str
    comorbidities: list[str]
    max_length: int = 512
    temperature: float = 0.7

@app.post("/generate-careplan")
async def generate_careplan(request: CarePlanRequest):
    try:
        if not model or not tokenizer:
            raise HTTPException(status_code=503, detail="Model not loaded")
        generated = generate_plan(
            patient_profile=request.patient_profile,
            condition=request.condition,
            subtype=request.subtype,
            comorbidities=request.comorbidities,
            tokenizer=tokenizer,
            model=model,
            max_length=request.max_length,
            temperature=request.temperature
        )
        return {
            "care_plan": generated,
            "status": "success",
            "model": "mistral-7b-clinical-v1"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))