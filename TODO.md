# TruthLensAI Verification / Integration TODO

- [x] 1) Fix Docker build context / requirements.txt path so docker-compose builds and backend starts.
- [ ] 2) Start Docker (or run locally if Docker unnecessary) and confirm the actual website loads.
- [ ] 3) Submit text from the website and capture frontend → backend → inference logs.
- [ ] 4) Ensure backend logs include: request received, raw input, cleaned text, tokenization, BERT/DistilBERT/RoBERTa inference, ensemble, confidence, response.
- [ ] 5) Verify ML integration: confirm Logistic Regression / Linear SVM / XGBoost are loaded and used during prediction.
- [ ] 6) If not integrated, integrate saved ML models (no retraining, no dummy models) into the same inference pipeline used by website.
- [ ] 7) Confirm prior UI error “API Prediction failed…” is fully fixed. Capture network payload + status + backend logs.
- [ ] 8) Prove no dummy data / mock predictions / cached hardcoded outputs are used; ensure every displayed result originates from backend pipeline.
- [ ] 9) Test through the website with real/fake Reuters/AP/BBC + 4 fake sources + 3 random + 2 edge cases; record outputs.
- [ ] 10) Create final accuracy table comparing expected vs production vs research vs ML vs DL vs ensemble vs confidence.
- [ ] 11) Provide final evidence: screenshots/logs for UI, browser network+console, backend terminal, request/response, preprocessing logs, model execution logs.

