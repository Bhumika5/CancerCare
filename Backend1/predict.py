import json
import os
import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import base64
import io
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier


def load_csv(project_root: str) -> pd.DataFrame:
    candidates = [
        os.path.join(project_root, "patients_v2.csv"),
        os.path.join(project_root, "Backend", "patients_v2.csv"),
    ]
    for p in candidates:
        if os.path.exists(p):
            return pd.read_csv(p)
    raise FileNotFoundError("patients_v2.csv not found in project root or Backend/")


def train_models(df: pd.DataFrame):
    df = df.copy()
    df['age'] = df['age'].fillna(df['age'].median())
    df['gender'] = df['gender'].fillna(df['gender'].mode()[0])
    df['cancer_type'] = df['cancer_type'].fillna(df['cancer_type'].mode()[0])
    df['death_date'] = df['death_date'].fillna('')

    le_gender = LabelEncoder()
    df['gender_enc'] = le_gender.fit_transform(df['gender'])
    le_cancer = LabelEncoder()
    df['cancer_enc'] = le_cancer.fit_transform(df['cancer_type'])

    df['death_occurred'] = df['death_date'].apply(lambda x: 0 if x == '' else 1)

    X = df[['age', 'gender_enc']]
    y_cancer = df['cancer_enc']
    y_death = df['death_occurred']

    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X, y_cancer, test_size=0.2, random_state=42)
    X_train_d, X_test_d, y_train_d, y_test_d = train_test_split(X, y_death, test_size=0.2, random_state=42)

    model_cancer = RandomForestClassifier(n_estimators=100, random_state=42).fit(X_train_c, y_train_c)
    model_death = RandomForestClassifier(n_estimators=100, random_state=42).fit(X_train_d, y_train_d)

    return model_cancer, model_death, le_gender, le_cancer


def fig_to_base64(fig):
    """Convert matplotlib figure to base64 string"""
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    plt.close(fig)
    return img_str


def generate_visualizations(future_df, df):
    """Generate visualizations for the prediction results"""
    sns.set(style="whitegrid")
    visualizations = {}
    
    # BAR – Cancer Types
    plt.figure(figsize=(7, 4))
    sns.barplot(x=future_df['predicted_cancer'].value_counts().index, 
                y=future_df['predicted_cancer'].value_counts().values, 
                palette="Set2")
    plt.title("Future Cancer Type Frequency")
    plt.xlabel("Cancer")
    plt.ylabel("Count")
    visualizations['barChart'] = fig_to_base64(plt.gcf())
    
    # PIE – Cancer Proportion
    plt.figure(figsize=(5, 5))
    plt.pie(future_df['predicted_cancer'].value_counts().values, 
            labels=future_df['predicted_cancer'].value_counts().index, 
            autopct='%1.1f%%', 
            colors=sns.color_palette("Set3"))
    plt.title("Predicted Cancer Type Proportion")
    visualizations['pieChart'] = fig_to_base64(plt.gcf())
    
    # Create age groups for heatmap
    bins = [0, 20, 40, 60, 80, 100]
    labels = ['0-20', '21-40', '41-60', '61-80', '81-100']
    future_df['age_group'] = pd.cut(future_df['age'], bins=bins, labels=labels)
    
    # HEATMAP – Gender vs Age Group
    heat_data = future_df.pivot_table(index='age_group', 
                                    columns='gender', 
                                    values='predicted_cancer', 
                                    aggfunc='count').fillna(0)
    plt.figure(figsize=(6, 5))
    sns.heatmap(heat_data, annot=True, cmap="YlOrRd")
    plt.title("Heatmap : Age Group vs Gender (Count)")
    plt.xlabel("Gender (0=Male,1=Female)")
    plt.ylabel("Age Group")
    visualizations['heatmapChart'] = fig_to_base64(plt.gcf())
    
    # LINE – Trend using dataset (diagnosis_date)
    if 'diagnosis_date' in df.columns:
        df['diagnosis_date'] = pd.to_datetime(df['diagnosis_date'])
        trend = df.groupby(df['diagnosis_date'].dt.year)['cancer_type'].count()
        plt.figure(figsize=(7, 4))
        sns.lineplot(x=trend.index, y=trend.values, marker='o')
        plt.title("Diagnosis Trend Over Years")
        plt.xlabel("Year")
        plt.ylabel("Cases")
        visualizations['lineChart'] = fig_to_base64(plt.gcf())
    
    return visualizations


def main():
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    df = load_csv(project_root)
    model_cancer, model_death, le_gender, le_cancer = train_models(df)

    raw = sys.stdin.read().strip() or '[]'
    try:
        payload = json.loads(raw)
    except Exception:
        payload = []

    if not isinstance(payload, list):
        payload = [payload]

    inputs = []
    for item in payload:
        age = int(item.get('age', 0))
        gender_val = item.get('gender', 0)
        # Map numeric 0/1 from UI to string for encoder if possible
        if isinstance(gender_val, (int, float)):
            gender_str = 'Male' if int(gender_val) == 0 else 'Female'
        else:
            gender_str = str(gender_val)
        try:
            gender_enc = int(le_gender.transform([gender_str])[0])
        except Exception:
            # Fallback: if unknown label, assume 0
            gender_enc = 0
        inputs.append({'age': age, 'gender_enc': gender_enc, 'gender_original': int(item.get('gender', 0))})

    X_pred = pd.DataFrame({'age': [i['age'] for i in inputs], 'gender_enc': [i['gender_enc'] for i in inputs]})

    cancer_pred_enc = model_cancer.predict(X_pred)
    cancer_pred = le_cancer.inverse_transform(cancer_pred_enc)
    death_pred_enc = model_death.predict(X_pred)
    death_pred = ['Died' if d == 1 else 'Alive' for d in death_pred_enc]

    # Create a DataFrame for visualization
    future_df = pd.DataFrame({
        'age': [i['age'] for i in inputs],
        'gender': [i['gender_original'] for i in inputs],
        'predicted_cancer': cancer_pred,
        'predicted_death': death_pred
    })
    
    # Generate visualizations
    visualizations = generate_visualizations(future_df, df)

    results = []
    for i, item in enumerate(inputs):
        result = {
            'age': int(item['age']),
            'gender': int(item['gender_original']),
            'predicted_cancer': str(cancer_pred[i]),
            'predicted_death': str(death_pred[i]),
        }
        
        # Add visualizations to the first result only
        if i == 0:
            result['visualizations'] = visualizations
            
        results.append(result)

    sys.stdout.write(json.dumps(results))


if __name__ == '__main__':
    main()


