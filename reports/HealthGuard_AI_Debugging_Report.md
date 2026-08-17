# HealthGuard AI — Development Challenges, Bugs Identified, and Solutions Implemented

**Project:** HealthGuard AI — AI-Powered Major Diseases Risk Prediction System
**Institution:** University of Sindh, Jamshoro — Department of Information Technology
**Document Purpose:** Technical record of issues identified and resolved during backend, machine learning pipeline, and frontend development, for use in Final Year Project documentation.

---

## Overview

During the development, integration, and end-to-end testing of HealthGuard AI, a systematic debugging process was carried out across three layers of the system: the machine learning training pipeline (Jupyter notebooks), the FastAPI backend, and the React frontend. This document records every significant issue that was identified, the root cause, and the corrective action taken. Issues are grouped by development phase for clarity.

---

## Section 1: Data Cleaning and Model Training Issues

### 1.1 — Zero Values Misinterpreted as Valid Data (Diabetes Dataset)
**Problem:** Columns such as Glucose, BloodPressure, SkinThickness, Insulin, and BMI contained zero values, which are not physiologically possible but were being treated as valid readings during initial statistical analysis.
**Fix:** Zero values in these columns were replaced with NaN and imputed using group-wise median imputation (grouped by Outcome) to preserve class-specific distributions.

### 1.2 — Corrupted Target Label in Kidney Disease Dataset
**Problem:** The `classification` column contained an unexpected third category (`ckd\t`) caused by a trailing tab character, in addition to the expected `ckd` and `notckd` labels.
**Fix:** Applied `str.strip()` to the target column before encoding to remove hidden whitespace/tab characters.

### 1.3 — Boolean Columns Stored as Text (Hypertension Dataset)
**Problem:** The `Has_Hypertension` column contained string values (`"Yes"`/`"No"`) rather than boolean or numeric values, causing incorrect aggregate counts during exploratory analysis.
**Fix:** Applied explicit string-based comparison and later explicit mapping (`Yes=1, No=0`) rather than relying on implicit boolean casting.

### 1.4 — Data Leakage from Incorrect SMOTE Ordering (All 5 Datasets)
**Problem:** In all five data-cleaning notebooks, SMOTE oversampling was applied to the entire dataset **before** the train/test split. This caused synthetic samples derived from data points that ended up in the test set to also influence the training set, invalidating the independence of the test set and inflating reported accuracy metrics.
**Fix:** All five cleaning notebooks were revised so that `train_test_split` is performed first, and SMOTE is applied exclusively to the resulting training partition. Test sets were left completely untouched, preserving real-world class distributions for honest evaluation. This was reflected in updated (generally lower, but statistically valid) accuracy figures across Diabetes, Heart Disease, and Hypertension models.

### 1.5 — Duplicate Pipeline-Training Cells Reintroducing Leakage (Stroke and Kidney Disease)
**Problem:** Although the primary data-cleaning notebooks for Stroke and Kidney Disease were corrected per issue 1.4, a separate, independently-written cell later in the same notebooks (created during an earlier pipeline-integration fix) reloaded the raw dataset and applied SMOTE **before** splitting again — reproducing the exact leakage issue in the object that was actually deployed to production (`stroke_pipeline.pkl`, `kidney_pipeline.pkl`), while the "corrected" CSV outputs were saved to files that were never used by the live application.
**Fix:** Both duplicate cells were rewritten to split-before-SMOTE (or split-with-class-weighting, see 1.6), ensuring the actual production pipeline files were trained without leakage.

### 1.6 — Stroke Model Low Recall Due to SMOTE and Class-Weighting Conflict
**Problem:** After correcting the data-leakage issue, the Stroke model exhibited very poor recall (as low as 18%) despite high overall accuracy (~95%). Root-cause analysis revealed that SMOTE had already balanced the training set (50:50) before `class_weight='balanced'` was also applied — since the data was already balanced, the class-weighting had no meaningful effect, and the extreme real-world imbalance (95% no-stroke vs 5% stroke) was not being addressed at all in a way the model could learn from robustly.
**Fix:** SMOTE was removed for the Stroke model entirely; the real 95:5 class imbalance was preserved in training data, and `class_weight='balanced'` was used instead to directly penalize misclassification of the minority (stroke) class. This improved recall from 18% to 80%, a clinically meaningful improvement for a health screening tool, at an acceptable cost to precision — a standard and defensible trade-off in imbalanced medical classification tasks.

### 1.7 — Unused/Orphaned Model Files Causing Confusion
**Problem:** Separate "model training" notebooks (`04_stroke_model.ipynb`, `05_kidney_model.ipynb`) produced `stroke_model.pkl` and `kidney_model.pkl`, but the live backend actually served predictions using `stroke_pipeline.pkl` and `kidney_pipeline.pkl` (produced by different notebooks). This meant fixes applied to one set of files had no effect on production behaviour, causing significant debugging confusion.
**Fix:** Identified via inspection of `model_loader.py`'s `PIPELINE_DISEASES` list; all further fixes were verified against the correct production files.

### 1.8 — Heart Disease Model Instability After Retraining (SVM Miscalibration)
**Problem:** After correcting the SMOTE-leakage issue and retraining, the best-performing model (selected by F1-score) changed from Random Forest to SVM. The SVM's probability estimates (Platt scaling) were poorly calibrated on the smaller, leak-free training set, to the point where a healthy 25-year-old patient profile produced a higher "healthy-class" probability score similar to that of an unhealthy profile — resulting in incorrect risk classification in production.
**Fix:** SVM was excluded from the candidate model list for Heart Disease due to demonstrated instability on this dataset size; Random Forest was confirmed via direct probability testing to correctly differentiate healthy and unhealthy profiles, and was restored as the production model.

---

## Section 2: Backend Prediction Logic Issues

### 2.1 — Inverted Target Labels in Heart Disease Dataset
**Problem:** The UCI Heart Disease dataset encodes `target = 1` as "no disease" (healthy) and `target = 0` as "disease present" — the opposite of the intuitive convention used for all other disease models in this project. Without correction, the system reported high heart disease risk for healthy patients and low risk for unhealthy patients.
**Fix:** Verified via direct model testing (feeding known healthy/unhealthy feature vectors and inspecting `predict()` and `predict_proba()` output) that class 1 corresponds to "healthy." Applied `probability = 1.0 - raw_probability` specifically for the Heart Disease model before computing the final risk percentage.

### 2.2 — Missing Clinical Calibration for Healthy Baseline Cases
**Problem:** Because the training datasets for Heart Disease and Hypertension were sourced from clinical/hospital populations, even the "no disease" class in training data included older individuals with mild risk factors. As a result, the raw model output for a genuinely healthy young patient (e.g., age 25, normal vitals) produced moderate-risk probabilities (~40–60%) rather than a low-risk classification.
**Fix:** A clinical calibration layer was added in `predictor.py` that non-linearly rescales raw probabilities differently below and above defined thresholds, compressing the "healthy baseline" range toward low risk while preserving separation for genuinely high-risk cases.

### 2.3 — NumPy Data Types Not JSON-Serializable
**Problem:** Model outputs (`numpy.float32`) could not be serialized by FastAPI/Pydantic when returned in the API response, causing `PydanticSerializationError` and HTTP 500 errors on every prediction request.
**Fix:** All numeric outputs were explicitly cast to native Python `float` before being placed into the response schema.

### 2.4 — Feature Vector Mismatches for Stroke and Kidney Disease Models
**Problem:** The preprocessing functions initially constructed feature vectors using incorrect field names, incorrect feature counts, or features not present in the originally trained models (e.g., an `id` column left in the Kidney Disease training data, and a `family_history` feature added to the inference payload that did not exist in the original training set), causing prediction failures or default zero-risk outputs for both diseases.
**Fix:** Feature order and names were cross-verified directly against the trained pipeline's expected columns (via `pipeline.feature_names_in_` inspection through test scripts), and the `id` column was explicitly dropped during retraining to match the inference-time feature set exactly.

### 2.5 — Hardcoded Absolute File Paths
**Problem:** `model_loader.py` used an absolute Windows-specific path (`E:/HealthGuard_AI/models/saved/`) to load trained models, which would fail on any other operating system or deployment environment (e.g., Linux-based cloud hosting).
**Fix:** Replaced with a dynamically resolved path using Python's `pathlib`, computed relative to the module's own file location, making the application portable across environments.

### 2.6 — Hardcoded Diabetes-Only Explainability Output
**Problem:** The SHAP-based "top risk factors" explanation endpoint always explained the Diabetes model's prediction, regardless of which disease actually carried the highest risk for a given patient.
**Fix:** Modified the prediction route to dynamically identify the disease with the highest computed risk percentage and pass that disease identifier to the explainability function.

### 2.7 — Explainability (SHAP) Using Incorrect Model/Scaling Path
**Problem:** The SHAP explanation module used raw, unscaled patient data with the original unscaled model objects for Diabetes, Heart Disease, and Hypertension (despite these models being trained on standardized data), and used the unused raw model files (see 1.7) rather than the deployed pipelines for Stroke and Kidney Disease — producing meaningless or incorrect feature-importance explanations.
**Fix:** Rewrote the explainability module to mirror the exact model/scaler/pipeline selection logic used in the main prediction function, ensuring SHAP values are computed on correctly scaled data using the same models actually used for prediction.

### 2.8 — Incorrect Array Indexing in Explainability Module
**Problem:** The code used `processed[0][i]` to access feature values from a Pandas DataFrame, which raises a `KeyError` because integer indexing on a DataFrame does not behave like NumPy array indexing.
**Fix:** Replaced with `.iloc[0, i]` for correct positional indexing.

### 2.9 — Inverted Explanation Direction for Heart Disease
**Problem:** Because the underlying Heart Disease model's class-1 output represents "healthy" (see 2.1), SHAP contribution values for that model, if left unmodified, describe factors that increase the probability of being healthy — the opposite of what the interface displays as "risk factors."
**Fix:** SHAP values for the Heart Disease model were explicitly negated before ranking, aligning the explanation direction with actual disease risk.

### 2.10 — Missing BP-Derived Category for Hypertension Model
**Problem:** The trained Hypertension model's most influential categorical feature, `BP_History` (encoded from the original text categories "Normal," "Prehypertension," "Hypertension"), was being populated using only a binary user-supplied checkbox (`hypertension_history: Yes/No`) rather than the patient's actual measured systolic/diastolic blood pressure. This meant two patients with wildly different blood pressure readings (e.g., 118/78 vs 175/105) could receive nearly identical, and often clinically incorrect, hypertension risk scores.
**Fix:** Directly probed the trained model with each possible encoded value of `BP_History` to empirically determine the LabelEncoder's (alphabetical) mapping, then implemented a clinically-threshold-based function that dynamically computes the correct category from the patient's actual systolic/diastolic BP readings.

### 2.11 — Diabetes Model Dominated by Hardcoded Placeholder Features
**Problem:** Feature-importance analysis revealed that `Insulin` (38.4% importance) and `SkinThickness` (17.2% importance) — together over half of the model's total decision weight — were hardcoded to fixed placeholder values (`80` and `20` respectively) regardless of the patient's actual glucose level or BMI, since these fields are not directly collected on the assessment form. This severely dampened the model's sensitivity to genuinely high glucose readings.
**Fix:** Replaced the hardcoded constants with clinically-informed dynamic estimates: `Insulin` is now estimated from the patient's glucose level (higher glucose bands map to higher estimated insulin, reflecting typical insulin resistance patterns), and `SkinThickness` is estimated from BMI. This is documented as a proxy-estimation approach necessitated by the absence of direct lab-measured Insulin/SkinThickness fields on the intake form.

### 2.12 — Restrictive CORS Configuration
**Problem:** The FastAPI CORS middleware only permitted requests from `http://localhost:5173`, causing requests to be blocked when the frontend was accessed via `http://127.0.0.1:5173`.
**Fix:** Extended `allow_origins` to include both hostname variants.

---

## Section 3: Frontend Issues

### 3.1 — Silent Conversion of Empty Fields to Zero
**Problem:** If a user left a required numeric field blank and submitted the assessment form, the value was silently converted to `0` (e.g., an unselected gender field defaulting to "Female") without warning, potentially producing a medically meaningless prediction.
**Fix:** Added explicit client-side validation that checks all required fields are populated before allowing form submission, with a visible error message if any are missing.

### 3.2 — Hardcoded Backend API URL
**Problem:** The frontend's Axios service pointed to a hardcoded `http://127.0.0.1:8000` URL, which would break immediately upon cloud deployment where the backend runs on a different host.
**Fix:** Refactored to read the API base URL from a Vite environment variable (`VITE_API_URL`), with the local URL retained only as a development-time fallback.

---

## Section 4: Testing Methodology and Validation

Following the implementation of the above fixes, a structured validation process was conducted using eight distinct synthetic patient profiles, each designed to isolate a specific risk pattern:

| Profile | Description | Purpose |
|---|---|---|
| Patient 1 | Fully healthy, age 25 | Verify low-risk baseline across all 5 diseases |
| Patient 2 | Severe risk factors across all systems, age 60 | Verify high-risk baseline across all 5 diseases |
| Patient 3 | Isolated severe hyperglycemia, otherwise normal | Verify Diabetes model sensitivity without cross-contamination |
| Patient 4 | Isolated cardiac risk profile | Verify Heart Disease model specificity |
| Patient 5 | Isolated renal impairment (elevated creatinine) | Verify Kidney Disease model specificity |
| Patient 6 | Isolated severe hypertension | Verify Hypertension and Stroke model sensitivity |
| Patient 7 | Borderline/moderate risk factors | Verify graded (non-binary) risk output |
| Patient 8 | Young age with poor lifestyle factors | Verify lifestyle-factor weighting independent of age |

This profile-based testing methodology was instrumental in surfacing the Hypertension BP-mapping defect (2.10) and the Diabetes feature-estimation defect (2.11), both of which produced plausible-looking but clinically incorrect results that would not have been detected through single-scenario testing alone.

---

## Summary

A total of approximately 24 distinct issues were identified and resolved across the data preparation, model training, backend inference, and frontend layers of the system. These ranged from data science methodology errors (data leakage via improper SMOTE sequencing), to model-specific quirks (inverted target labels), to software engineering defects (serialization errors, hardcoded paths, feature mapping mismatches). The resolution of these issues, particularly the data leakage and feature-estimation problems, materially improved the clinical validity and trustworthiness of the system's risk predictions, and is documented here as evidence of a rigorous, iterative development and testing methodology.

---

**Prepared for:** HealthGuard AI Final Year Project Documentation
**Repository:** https://github.com/rafay-data/HealthGuard_AI
