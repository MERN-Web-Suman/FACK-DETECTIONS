import os
import sys
import joblib
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from training.preprocess import load_and_preprocess_dataset

def evaluate():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, 'models', 'phishing_model.pkl')
    scaler_path = os.path.join(base_dir, 'models', 'scaler.pkl')

    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        print("[-] Model files not found. Run train_model.py first.")
        return

    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)

    phishing_path = os.path.join(base_dir, 'dataset', 'phishing.csv')
    legit_path = os.path.join(base_dir, 'dataset', 'legitimate.csv')
    X, y = load_and_preprocess_dataset(phishing_path, legit_path)

    X_scaled = scaler.transform(X)
    preds = model.predict(X_scaled)
    probs = model.predict_proba(X_scaled)[:, 1]

    print("=== MODEL EVALUATION REPORT ===")
    print(classification_report(y, preds))
    print("Confusion Matrix:")
    print(confusion_matrix(y, preds))
    print(f"ROC-AUC Score: {roc_auc_score(y, probs):.4f}")

if __name__ == '__main__':
    evaluate()

