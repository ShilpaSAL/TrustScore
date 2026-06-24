# ml/app.py  –  Flask prediction microservice
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# ─── Load model bundle ────────────────────────────────────────────────────────
MODEL_PATH = "recruiter_trust_model.pkl"

def load_bundle():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"{MODEL_PATH} not found. Run train_model.py first.")
    with open(MODEL_PATH, "rb") as f:
        return pickle.load(f)

bundle = load_bundle()
model   = bundle["model"]
le      = bundle["label_encoder"]
imputer = bundle["imputer"]

FEATURES = [
    "number_of_jobs_posted", "avg_job_description_length",
    "company_logo_present",  "response_time_hours",
    "job_posting_frequency", "complaints_count", "approval_rate"
]

# ─── Health check ─────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": MODEL_PATH})

# ─── Predict ──────────────────────────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)
        row = [[data.get(f, 0) for f in FEATURES]]
        row_imputed = imputer.transform(row)

        pred_idx   = model.predict(row_imputed)[0]
        proba      = model.predict_proba(row_imputed)[0]
        confidence = round(float(np.max(proba)) * 100, 2)
        trust_label = le.inverse_transform([pred_idx])[0]

        # Build per-class probabilities
        class_probs = {
            cls: round(float(p) * 100, 2)
            for cls, p in zip(le.classes_, proba)
        }

        return jsonify({
            "trust_label"    : trust_label,
            "confidence_score": confidence,
            "class_probabilities": class_probs,
            "status"         : "success"
        })

    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

# ─── Batch predict ────────────────────────────────────────────────────────────
@app.route("/predict/batch", methods=["POST"])
def batch_predict():
    try:
        records = request.get_json(force=True)  # list of dicts
        rows = [[r.get(f, 0) for f in FEATURES] for r in records]
        rows_imputed = imputer.transform(rows)

        preds  = model.predict(rows_imputed)
        probas = model.predict_proba(rows_imputed)

        results = []
        for idx, (p, prob) in enumerate(zip(preds, probas)):
            results.append({
                "index"          : idx,
                "trust_label"    : le.inverse_transform([p])[0],
                "confidence_score": round(float(np.max(prob)) * 100, 2)
            })
        return jsonify({"results": results, "status": "success"})

    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)