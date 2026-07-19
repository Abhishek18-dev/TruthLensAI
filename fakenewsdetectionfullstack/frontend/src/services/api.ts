import axios from "axios";

export interface ModelPrediction {
  prediction: "Fake" | "Real";
  confidence: number;
}

export interface ProductionResponse {
  mode: "production";
  model: string;
  prediction: "Fake" | "Real";
  confidence: number;
  inference_time: string;
  keywords: string[];
  reason: string;
  status: string;
}

export interface ResearchResponse {
  mode: "research";
  bert: ModelPrediction;
  distilbert: ModelPrediction;
  roberta: ModelPrediction;
  xgboost?: ModelPrediction;
  majority_voting: "Fake" | "Real";
  final_prediction: "Fake" | "Real";
  comparison: {
    bert_prediction: "Fake" | "Real";
    distilbert_prediction: "Fake" | "Real";
    roberta_prediction: "Fake" | "Real";
    xgboost_prediction: "Fake" | "Real";
    bert_confidence: number;
    distilbert_confidence: number;
    roberta_confidence: number;
    xgboost_confidence: number;
    majority_confidence: number;
    inference_time_ms: number;
  };
  status: string;
}

export type PredictResponse = ProductionResponse | ResearchResponse;

export interface HistoryItem {
  id: string;
  date: string;
  time: string;
  input_text: string;
  text_snippet: string;
  prediction: "Fake" | "Real";
  confidence: number;
  mode: "production" | "research";
  model_used: string;
  inference_time: number;
}

export interface AnalyticsResponse {
  total_predictions: number;
  fake_percentage: number;
  real_percentage: number;
  average_confidence: number;
  average_inference_time: number;
  distribution_pie: { [key: string]: number };
  model_performance_bar: { [key: string]: number };
  timeline_line: {
    date: string;
    total: number;
    fake: number;
    real: number;
    avgConfidence: number;
  }[];
  current_mode: "production" | "research";
}

// The FastAPI backend base URL. VITE_API_URL supports deployed and Docker environments.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  predict: async (text: string, mode: "production" | "research" = "production"): Promise<PredictResponse> => {
    const response = await client.post<PredictResponse>("/predict", { text, mode });
    return response.data;
  },

  getAnalytics: async (): Promise<AnalyticsResponse> => {
    const response = await client.get<AnalyticsResponse>("/analytics");
    return response.data;
  },

  getHistory: async (): Promise<HistoryItem[]> => {
    const response = await client.get<HistoryItem[]>("/history");
    return response.data;
  },

  batchPredict: async (texts: string[], mode: "production" | "research" = "production"): Promise<PredictResponse[]> => {
    const response = await client.post<{ predictions: PredictResponse[] }>("/batchPredict", {
      texts,
      mode,
    });
    return response.data.predictions;
  },
};

export const truthLensApi = {
  predict: async (text: string, mode: "production" | "research"): Promise<PredictResponse> => {
    return await api.predict(text, mode);
  },

  getAnalytics: async (): Promise<AnalyticsResponse> => {
    return await api.getAnalytics();
  },

  getHistory: async (): Promise<HistoryItem[]> => {
    return await api.getHistory();
  },

  batchPredict: async (texts: string[], mode: "production" | "research"): Promise<PredictResponse[]> => {
    return await api.batchPredict(texts, mode);
  },
};
