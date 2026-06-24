# ml/train_model.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
from sklearn.impute import SimpleImputer
import pickle
import os

# ─── 1. Load Dataset ───────────────────────────────────────────────────────────
def load_data(path="recruiter_dataset.csv"):
    if os.path.exists(path):
        df = pd.read_csv(path)
    else:
        # Generate synthetic dataset for testing
        print("Dataset not found. Generating synthetic dataset...")
        np.random.seed(42)
        n = 1000
        df = pd.DataFrame({
            "recruiter_id": range(1, n + 1),
            "number_of_jobs_posted": np.random.randint(1, 200, n),
            "avg_job_description_length": np.random.randint(100, 2000, n),
            "company_logo_present": np.random.choice([0, 1], n),
            "response_time_hours": np.random.uniform(0.5, 72, n),
            "job_posting_frequency": np.random.uniform(0.1, 10, n),
            "complaints_count": np.random.randint(0, 20, n),
            "approval_rate": np.random.uniform(0.3, 1.0, n),
        })
        # Derive trust_label from features
        score = (
            (df["approval_rate"] * 40) +
            (df["company_logo_present"] * 10) +
            ((200 - df["response_time_hours"]) / 200 * 20) +
            ((20 - df["complaints_count"]) / 20 * 20) +
            (np.clip(df["number_of_jobs_posted"] / 200, 0, 1) * 10)
        )
        df["trust_label"] = pd.cut(score, bins=3, labels=["Low Trust", "Medium Trust", "High Trust"])
        df.to_csv("recruiter_dataset.csv", index=False)
        print("Saved recruiter_dataset.csv")
    return df

# ─── 2. Preprocess ─────────────────────────────────────────────────────────────
def preprocess(df):
    feature_cols = [
        "number_of_jobs_posted", "avg_job_description_length",
        "company_logo_present", "response_time_hours",
        "job_posting_frequency", "complaints_count", "approval_rate"
    ]
    X = df[feature_cols].copy()
    y = df["trust_label"].copy()

    # Handle missing values
    imputer = SimpleImputer(strategy="median")
    X = pd.DataFrame(imputer.fit_transform(X), columns=feature_cols)

    # Encode target
    le = LabelEncoder()
    y_encoded = le.fit_transform(y.astype(str))

    return X, y_encoded, le, imputer

# ─── 3. Train ──────────────────────────────────────────────────────────────────
def train(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    clf = RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        min_samples_split=5,
        random_state=42,
        class_weight="balanced"
    )
    clf.fit(X_train, y_train)
    return clf, X_test, y_test

# ─── 4. Evaluate ───────────────────────────────────────────────────────────────
def evaluate(clf, X_test, y_test, le):
    y_pred = clf.predict(X_test)
    print("\n========== MODEL EVALUATION ==========")
    print(f"Accuracy  : {accuracy_score(y_test, y_pred):.4f}")
    print(f"Precision : {precision_score(y_test, y_pred, average='weighted'):.4f}")
    print(f"Recall    : {recall_score(y_test, y_pred, average='weighted'):.4f}")
    print(f"F1 Score  : {f1_score(y_test, y_pred, average='weighted'):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=le.classes_))

# ─── 5. Save ───────────────────────────────────────────────────────────────────
def save_artifacts(clf, le, imputer):
    bundle = {"model": clf, "label_encoder": le, "imputer": imputer}
    with open("recruiter_trust_model.pkl", "wb") as f:
        pickle.dump(bundle, f)
    print("\nModel saved → recruiter_trust_model.pkl")

# ─── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    df = load_data()
    X, y, le, imputer = preprocess(df)
    clf, X_test, y_test = train(X, y)
    evaluate(clf, X_test, y_test, le)
    save_artifacts(clf, le, imputer)