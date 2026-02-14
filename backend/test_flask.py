import joblib
import numpy as np
import pandas as pd

# Load the trained models, scaler, and label encoders
model_savings = joblib.load('desired_savings_model.pkl')
model_percentage = joblib.load('desired_savings_percentage_model.pkl')
scaler = joblib.load('scaler.pkl')
label_encoder_occupation = joblib.load('label_encoder_occupation.pkl')
label_encoder_city_tier = joblib.load('label_encoder_city_tier.pkl')

# Example input data
data = {
    'Income': 50000,
    'Age': 30,
    'Dependents': 2,
    'Occupation': 'Professional',  # Example occupation
    'City_Tier': 'Tier_1',  # Example city tier
    'Disposable_Income': 20000,
    'Total_Expenses': 15000
}

try:
    # Debug: Print raw input data
    print("Raw Input Data:", data)

    # Encode categorical variables
    data['Occupation'] = label_encoder_occupation.transform([data['Occupation']])[0]
    data['City_Tier'] = label_encoder_city_tier.transform([data['City_Tier']])[0]
    
    # Debug: Print encoded data
    print("Encoded Data:", data)

    # Convert input to DataFrame for scaling
    input_df = pd.DataFrame([data])

    # Debug: Print DataFrame before scaling
    print("DataFrame Before Scaling:", input_df)

    # Scale numerical features
    numerical_features = ['Income', 'Age', 'Disposable_Income', 'Total_Expenses']
    input_df[numerical_features] = scaler.transform(input_df[numerical_features])

    # Debug: Print DataFrame after scaling
    print("DataFrame After Scaling:", input_df)

    # Reorder columns to match the training feature order
    feature_order = ['Income', 'Age', 'Dependents', 'Occupation', 'City_Tier', 'Disposable_Income', 'Total_Expenses']
    input_features = input_df[feature_order]

    # Debug: Print final input features
    print("Final Input Features:", input_features)

    # Make predictions for Desired Savings and Desired Savings Percentage
    predicted_savings = model_savings.predict(input_features)
    predicted_percentage = model_percentage.predict(input_features)

    # Debug: Print predictions
    print('Predicted Desired Savings:', predicted_savings[0])
    print('Predicted Desired Savings Percentage:', predicted_percentage[0])

except Exception as e:
    print("Error:", str(e))
