# train_model.py
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

df = pd.read_csv('disaster_severity_dataset.csv')

X = df.drop('severity_index', axis=1)
y = df['severity_index']

model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, 'severity_model.pkl')
