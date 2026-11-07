import os
import sys
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from training.preprocess import load_and_preprocess_dataset

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    phishing_path = os.path.join(base_dir, 'dataset', 'phishing.csv')
    legit_path = os.path.join(base_dir, 'dataset', 'legitimate.csv')
    model_output_dir = os.path.join(base_dir, 'models')
    os.makedirs(model_output_dir, exist_ok=True)

    print("[*] Loading datasets and extracting features...")
    X, y = load_and_preprocess_dataset(phishing_path, legit_path)
    print(f"[*] Total dataset size: {len(X)} samples with {X.shape[1]} features.")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print("[*] Training Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train_scaled, y_train)

    preds = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, preds)
    print(f"[+] Model Accuracy on Test Set: {acc * 100:.2f}%")
    print("\nClassification Report:\n", classification_report(y_test, preds))

    # Save artifacts
    model_path = os.path.join(model_output_dir, 'phishing_model.pkl')
    scaler_path = os.path.join(model_output_dir, 'scaler.pkl')
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"[+] Model successfully saved to {model_path}")
    print(f"[+] Scaler successfully saved to {scaler_path}")

if __name__ == '__main__':
    main()

