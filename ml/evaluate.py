"""
Evaluation metrics for MonsoonGuard ML Pipeline.
"""
from sklearn.metrics import precision_score, recall_score, f1_score, brier_score_loss, roc_auc_score
import pandas as pd
import warnings

def evaluate_model(y_true, y_probs, y_pred, event_name, model_name):
    # Handle edge case where there's only one class in y_true
    if len(set(y_true)) < 2:
        warnings.warn(f"Only one class present in y_true for {event_name}. ROC AUC is undefined.")
        roc_auc = float('nan')
    else:
        roc_auc = roc_auc_score(y_true, y_probs)
        
    precision = precision_score(y_true, y_pred, zero_division=0)
    recall = recall_score(y_true, y_pred, zero_division=0)
    f1 = f1_score(y_true, y_pred, zero_division=0)
    brier = brier_score_loss(y_true, y_probs)
    
    return {
        "Model": model_name,
        "Event": event_name,
        "Precision": precision,
        "Recall": recall,
        "F1": f1,
        "Brier Score": brier,
        "ROC-AUC": roc_auc
    }

def print_evaluation_report(results):
    df = pd.DataFrame(results)
    print("\n" + "="*50)
    print("EVALUATION REPORT")
    print("="*50)
    for event in df['Event'].unique():
        print(f"\nEVENT: {event}")
        event_df = df[df['Event'] == event]
        for _, row in event_df.iterrows():
            print(f"\nMODEL: {row['Model']}")
            print(f"Precision:   {row['Precision']:.4f}")
            print(f"Recall:      {row['Recall']:.4f}")
            print(f"F1:          {row['F1']:.4f}")
            print(f"Brier Score: {row['Brier Score']:.4f}")
            print(f"ROC-AUC:     {row['ROC-AUC']:.4f}")
    print("\n" + "="*50)
