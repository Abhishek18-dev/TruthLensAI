from fastapi import APIRouter, HTTPException
from app.schemas.request import BatchPredictRequest
from app.schemas.response import BatchPredictResponse
from app.services.prediction_service import predict_production, predict_research

router = APIRouter()

@router.post("/batchPredict", response_model=BatchPredictResponse)
async def batch_predict_news(request: BatchPredictRequest):
    if not request.texts:
        raise HTTPException(status_code=400, detail="Text list cannot be empty.")

    predictions = []
    try:
        for text in request.texts:
            if not text or not text.strip():
                continue
            if request.mode == "research":
                predictions.append(predict_research(text))
            else:
                predictions.append(predict_production(text))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    if not predictions:
        raise HTTPException(status_code=400, detail="No valid text rows were provided.")

    return BatchPredictResponse(predictions=predictions)
