import pandas as pd
import numpy as np
import os
import sys

# Ensure parent directory is in path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from feature_extraction import extract_all_features

def load_and_preprocess_dataset(phishing_csv: str, legitimate_csv: str):
    """Load both CSV datasets, extract features, and return tabular X, y."""
    df_phish = pd.read_csv(phishing_csv)
    df_legit = pd.read_csv(legitimate_csv)

    combined_df = pd.concat([df_phish, df_legit], ignore_index=True).dropna(subset=['url'])
    
    rows = []
    labels = []

    for _, row in combined_df.iterrows():
        url = str(row['url'])
        label = int(row['label'])
        feats = extract_all_features(url)
        rows.append(feats)
        labels.append(label)

    X = pd.DataFrame(rows)
    y = np.array(labels)

    return X, y

