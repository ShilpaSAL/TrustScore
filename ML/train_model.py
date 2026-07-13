# ml/train_model.py

import os
import pickle
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)


# ─────────────────────────────────────────────────────────────────────────────
# 1. Configuration
# ─────────────────────────────────────────────────────────────────────────────

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(BASE_DIR, "recruiter_dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "recruiter_trust_model.pkl")

FEATURE_COLUMNS = [
    "number_of_jobs_posted",
    "avg_job_description_length",
    "company_logo_present",
    "response_time_hours",
    "job_posting_frequency",
    "complaints_count",
    "approval_rate"
]

TARGET_COLUMN = "trust_label"


# ─────────────────────────────────────────────────────────────────────────────
# 2. Load Dataset
# ─────────────────────────────────────────────────────────────────────────────

def load_data():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(
            f"Dataset not found at: {DATASET_PATH}\n"
            "Please place recruiter_dataset.csv inside the ml folder."
        )

    df = pd.read_csv(DATASET_PATH)

    print("\n========== DATASET INFORMATION ==========")
    print(f"Total records before cleaning: {len(df)}")
    print(f"Total columns: {len(df.columns)}")

    required_columns = FEATURE_COLUMNS + [TARGET_COLUMN]

    missing_columns = [
        column for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Required columns missing from dataset: {missing_columns}"
        )

    return df


# ─────────────────────────────────────────────────────────────────────────────
# 3. Data Preprocessing
# ─────────────────────────────────────────────────────────────────────────────

def preprocess_data(df):

    # Remove duplicate records
    df = df.drop_duplicates().copy()

    print(f"Total records after duplicate removal: {len(df)}")

    # Select input features
    X = df[FEATURE_COLUMNS].copy()

    # Select target variable
    y = df[TARGET_COLUMN].copy()

    # Handle missing numerical values using median
    imputer = SimpleImputer(strategy="median")

    X_imputed = imputer.fit_transform(X)

    X_processed = pd.DataFrame(
        X_imputed,
        columns=FEATURE_COLUMNS
    )

    # Encode target labels
    label_encoder = LabelEncoder()

    y_encoded = label_encoder.fit_transform(
        y.astype(str).str.strip()
    )

    print("\nTrust Classes:")
    for index, class_name in enumerate(label_encoder.classes_):
        print(f"{index} → {class_name}")

    return X_processed, y_encoded, label_encoder, imputer


# ─────────────────────────────────────────────────────────────────────────────
# 4. Train-Test Split
# ─────────────────────────────────────────────────────────────────────────────

def split_dataset(X, y):

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )

    print("\n========== DATASET SPLIT ==========")
    print(f"Training records: {len(X_train)}")
    print(f"Testing records : {len(X_test)}")

    return X_train, X_test, y_train, y_test


# ─────────────────────────────────────────────────────────────────────────────
# 5. Train Naïve Bayes
# ─────────────────────────────────────────────────────────────────────────────

def train_naive_bayes(X_train, y_train):

    model = Pipeline([
        ("scaler", StandardScaler()),
        ("classifier", GaussianNB())
    ])

    model.fit(X_train, y_train)

    return model


# ─────────────────────────────────────────────────────────────────────────────
# 6. Train Support Vector Machine
# ─────────────────────────────────────────────────────────────────────────────

def train_svm(X_train, y_train):

    model = Pipeline([
        ("scaler", StandardScaler()),
        (
            "classifier",
            SVC(
                kernel="rbf",
                probability=True,
                random_state=42,
                class_weight="balanced"
            )
        )
    ])

    model.fit(X_train, y_train)

    return model


# ─────────────────────────────────────────────────────────────────────────────
# 7. Random Forest Hyperparameter Tuning
# ─────────────────────────────────────────────────────────────────────────────

def train_random_forest(X_train, y_train):

    print("\n========== RANDOM FOREST GRID SEARCH ==========")

    random_forest = RandomForestClassifier(
        random_state=42,
        class_weight="balanced",
        n_jobs=-1
    )

    parameter_grid = {
        "n_estimators": [200, 300, 400],
        "max_depth": [10, 15, 20, None],
        "max_features": ["sqrt"],
        "min_samples_split": [2, 5],
        "min_samples_leaf": [1, 2]
    }

    grid_search = GridSearchCV(
        estimator=random_forest,
        param_grid=parameter_grid,
        cv=5,
        scoring="accuracy",
        n_jobs=-1,
        verbose=1
    )

    grid_search.fit(X_train, y_train)

    print("\nBest Random Forest Parameters:")
    print(grid_search.best_params_)

    print(
        f"Best Cross-Validation Accuracy: "
        f"{grid_search.best_score_ * 100:.2f}%"
    )

    return grid_search.best_estimator_


# ─────────────────────────────────────────────────────────────────────────────
# 8. Model Evaluation
# ─────────────────────────────────────────────────────────────────────────────

def evaluate_model(
    model_name,
    model,
    X_test,
    y_test,
    label_encoder
):

    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)

    precision = precision_score(
        y_test,
        y_pred,
        average="weighted",
        zero_division=0
    )

    recall = recall_score(
        y_test,
        y_pred,
        average="weighted",
        zero_division=0
    )

    f1 = f1_score(
        y_test,
        y_pred,
        average="weighted",
        zero_division=0
    )

    print(f"\n========== {model_name.upper()} ==========")

    print(f"Accuracy  : {accuracy * 100:.2f}%")
    print(f"Precision : {precision:.4f}")
    print(f"Recall    : {recall:.4f}")
    print(f"F1-Score  : {f1:.4f}")

    print("\nClassification Report:")

    print(
        classification_report(
            y_test,
            y_pred,
            target_names=label_encoder.classes_,
            zero_division=0
        )
    )

    print("Confusion Matrix:")

    print(
        confusion_matrix(
            y_test,
            y_pred
        )
    )

    return {
        "Algorithm": model_name,
        "Accuracy": accuracy,
        "Precision": precision,
        "Recall": recall,
        "F1-Score": f1
    }


# ─────────────────────────────────────────────────────────────────────────────
# 9. Save Final Random Forest Model
# ─────────────────────────────────────────────────────────────────────────────

def save_model(
    model,
    label_encoder,
    imputer
):

    model_bundle = {
        "model": model,
        "label_encoder": label_encoder,
        "imputer": imputer,
        "feature_columns": FEATURE_COLUMNS
    }

    with open(MODEL_PATH, "wb") as file:
        pickle.dump(model_bundle, file)

    print("\n========== MODEL SAVED ==========")
    print(f"Model saved successfully at:\n{MODEL_PATH}")


# ─────────────────────────────────────────────────────────────────────────────
# 10. Main Execution
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":

    # Load dataset
    dataframe = load_data()

    # Preprocess dataset
    X, y, label_encoder, imputer = preprocess_data(dataframe)

    # 80:20 train-test split
    X_train, X_test, y_train, y_test = split_dataset(X, y)

    # Train models
    naive_bayes_model = train_naive_bayes(
        X_train,
        y_train
    )

    svm_model = train_svm(
        X_train,
        y_train
    )

    random_forest_model = train_random_forest(
        X_train,
        y_train
    )

    # Evaluate models
    results = []

    results.append(
        evaluate_model(
            "Naive Bayes",
            naive_bayes_model,
            X_test,
            y_test,
            label_encoder
        )
    )

    results.append(
        evaluate_model(
            "Support Vector Machine",
            svm_model,
            X_test,
            y_test,
            label_encoder
        )
    )

    results.append(
        evaluate_model(
            "Random Forest",
            random_forest_model,
            X_test,
            y_test,
            label_encoder
        )
    )

    # Display model comparison
    results_df = pd.DataFrame(results)

    print("\n========== MODEL PERFORMANCE COMPARISON ==========")

    display_results = results_df.copy()

    display_results["Accuracy"] *= 100
    display_results["Precision"] *= 100
    display_results["Recall"] *= 100
    display_results["F1-Score"] *= 100

    print(display_results.round(2).to_string(index=False))

    # Save Random Forest as final prediction model
    save_model(
        random_forest_model,
        label_encoder,
        imputer
    )

    print("\nTraining and evaluation completed successfully.")