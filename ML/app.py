# ml/app.py
# Flask microservice for recruiter credibility prediction

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os


# ─────────────────────────────────────────────────────────────────────────────
# 1. Flask Application
# ─────────────────────────────────────────────────────────────────────────────

app = Flask(__name__)
CORS(app)


# ─────────────────────────────────────────────────────────────────────────────
# 2. Model Configuration
# ─────────────────────────────────────────────────────────────────────────────

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "recruiter_trust_model.pkl"
)


# ─────────────────────────────────────────────────────────────────────────────
# 3. Load Trained Model Bundle
# ─────────────────────────────────────────────────────────────────────────────

def load_model_bundle():

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            "recruiter_trust_model.pkl not found. "
            "Run train_model.py first."
        )

    with open(MODEL_PATH, "rb") as file:
        return pickle.load(file)


bundle = load_model_bundle()

model = bundle["model"]
label_encoder = bundle["label_encoder"]
imputer = bundle["imputer"]

# Use the exact feature order saved during model training
FEATURES = bundle.get(
    "feature_columns",
    [
        "number_of_jobs_posted",
        "avg_job_description_length",
        "company_logo_present",
        "response_time_hours",
        "job_posting_frequency",
        "complaints_count",
        "approval_rate"
    ]
)


# ─────────────────────────────────────────────────────────────────────────────
# 4. Prepare Input Data
# ─────────────────────────────────────────────────────────────────────────────

def prepare_input(data):

    if not isinstance(data, dict):
        raise ValueError(
            "Input must be a valid JSON object."
        )

    missing_features = [
        feature
        for feature in FEATURES
        if feature not in data
    ]

    if missing_features:
        raise ValueError(
            f"Missing required features: {missing_features}"
        )

    # Preserve exact training feature order
    input_data = pd.DataFrame(
        [[data[feature] for feature in FEATURES]],
        columns=FEATURES
    )

    # Convert input values to numeric
    for feature in FEATURES:
        input_data[feature] = pd.to_numeric(
            input_data[feature],
            errors="coerce"
        )

    # Handle missing or invalid numerical values
    input_imputed = imputer.transform(input_data)

    return input_imputed


# ─────────────────────────────────────────────────────────────────────────────
# 5. Health Check
# ─────────────────────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():

    return jsonify({
        "status": "success",
        "message": "Recruiter credibility prediction service is running.",
        "model_loaded": True,
        "features": FEATURES
    }), 200


# ─────────────────────────────────────────────────────────────────────────────
# 6. Single Recruiter Prediction
# ─────────────────────────────────────────────────────────────────────────────

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json(silent=True)

        if data is None:
            return jsonify({
                "status": "error",
                "error": "A valid JSON request body is required."
            }), 400

        # Prepare recruiter behavioural features
        input_data = prepare_input(data)

        # Predict encoded trust class
        predicted_index = model.predict(input_data)[0]

        # Obtain class probabilities
        probabilities = model.predict_proba(input_data)[0]

        # Convert encoded prediction back to trust label
        trust_label = label_encoder.inverse_transform(
            [predicted_index]
        )[0]

        # Prediction confidence
        confidence_score = round(
            float(np.max(probabilities)) * 100,
            2
        )

        # Probability for each trust category
        class_probabilities = {
            class_name: round(
                float(probability) * 100,
                2
            )
            for class_name, probability
            in zip(
                label_encoder.classes_,
                probabilities
            )
        }

        return jsonify({
            "status": "success",
            "trust_label": trust_label,
            "confidence_score": confidence_score,
            "class_probabilities": class_probabilities
        }), 200

    except ValueError as error:

        return jsonify({
            "status": "error",
            "error": str(error)
        }), 400

    except Exception as error:

        print(f"Prediction error: {error}")

        return jsonify({
            "status": "error",
            "error": "Unable to generate recruiter credibility prediction."
        }), 500


# ─────────────────────────────────────────────────────────────────────────────
# 7. Batch Recruiter Prediction
# ─────────────────────────────────────────────────────────────────────────────

@app.route("/predict/batch", methods=["POST"])
def batch_predict():

    try:

        records = request.get_json(silent=True)

        if not isinstance(records, list) or len(records) == 0:
            return jsonify({
                "status": "error",
                "error": "Request body must contain a non-empty list of records."
            }), 400

        results = []

        for index, record in enumerate(records):

            try:

                input_data = prepare_input(record)

                predicted_index = model.predict(
                    input_data
                )[0]

                probabilities = model.predict_proba(
                    input_data
                )[0]

                trust_label = label_encoder.inverse_transform(
                    [predicted_index]
                )[0]

                confidence_score = round(
                    float(np.max(probabilities)) * 100,
                    2
                )

                class_probabilities = {
                    class_name: round(
                        float(probability) * 100,
                        2
                    )
                    for class_name, probability
                    in zip(
                        label_encoder.classes_,
                        probabilities
                    )
                }

                results.append({
                    "index": index,
                    "trust_label": trust_label,
                    "confidence_score": confidence_score,
                    "class_probabilities": class_probabilities
                })

            except Exception as record_error:

                results.append({
                    "index": index,
                    "status": "error",
                    "error": str(record_error)
                })

        return jsonify({
            "status": "success",
            "results": results
        }), 200

    except Exception as error:

        print(f"Batch prediction error: {error}")

        return jsonify({
            "status": "error",
            "error": "Unable to process batch prediction."
        }), 500


# ─────────────────────────────────────────────────────────────────────────────
# 8. Run Flask Server
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":

    print("\nRecruiter Credibility Prediction API")
    print("Model loaded successfully.")
    print(f"Model path: {MODEL_PATH}")
    print(f"Features: {FEATURES}")
    print("Server running at: http://127.0.0.1:5001\n")

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )