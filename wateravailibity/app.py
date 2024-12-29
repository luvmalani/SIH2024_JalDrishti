from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from tensorflow.keras.models import Sequential
from sklearn.model_selection import train_test_split
from tensorflow.keras.layers import LSTM, Dense
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import Flask-CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the dataset (in actual use, this will be done once in the Flask app setup)
water_columns = ["res_district", "res_name", "res_year", "res_month", "res_level", "cur_livsto", "rain_month", "rainfall"]
water_data = pd.read_csv("water_availability_data.csv")  # Replace with actual file path
water_data = water_data[water_columns].dropna()

# Categorical and numeric columns
categorical_cols = ['res_district', 'res_name', 'res_month', 'rain_month']
numeric_cols = ['res_year', 'res_level', 'cur_livsto', 'rainfall']

# Step 1: Encode categorical columns
label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    water_data[col] = le.fit_transform(water_data[col])
    label_encoders[col] = le

# Step 2: Feature Scaling for numeric columns only
scaler_X = MinMaxScaler()
X = water_data[numeric_cols]
X_scaled = scaler_X.fit_transform(X)

# Optionally, scale the target variable 'y' if needed
scaler_y = MinMaxScaler()
y = water_data["cur_livsto"].values.reshape(-1, 1)  # Target: Current Live Storage
y_scaled = scaler_y.fit_transform(y)

# Reshaping for LSTM (3D array: samples, time steps, features)
def create_lstm_data(X, y, time_steps=1):
    X_lstm, y_lstm = [], []
    for i in range(len(X) - time_steps):
        X_lstm.append(X[i:i+time_steps])
        y_lstm.append(y[i+time_steps])
    return np.array(X_lstm), np.array(y_lstm)

# Define time_steps (use the past 3 data points as input to predict the next one)
time_steps = 3
X_lstm, y_lstm = create_lstm_data(X_scaled, y_scaled, time_steps)

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X_lstm, y_lstm, test_size=0.2, random_state=42)

# Create the LSTM model
model = Sequential()
model.add(LSTM(units=50, return_sequences=False, input_shape=(X_train.shape[1], X_train.shape[2])))  # Input shape: (time_steps, features)
model.add(Dense(units=1))  # Output layer (single prediction)
model.compile(optimizer='adam', loss='mean_squared_error')

# Train the model
model.fit(X_train, y_train, epochs=10, batch_size=32, verbose=1)

# Prediction function
def predict_water_availability(year, district, state, month, rainfall):
    encoded_district = label_encoders["res_district"].transform([district])[0]
    encoded_name = label_encoders["res_name"].transform([state])[0]
    encoded_month = safe_transform(label_encoders["res_month"], month)
    encoded_rain_month = safe_transform(label_encoders["rain_month"], month)

    input_data = np.array([[year, encoded_district, encoded_rain_month, rainfall]])
    input_scaled = scaler_X.transform(input_data)
    input_scaled = np.reshape(input_scaled, (input_scaled.shape[0], 1, input_scaled.shape[1]))

    prediction_scaled = model.predict(input_scaled)
    prediction_actual = scaler_y.inverse_transform(prediction_scaled.reshape(-1, 1))

    # Convert prediction to float for JSON serialization
    prediction_value = prediction_actual[0][0].item()
    
    return prediction_value

# Function to safely transform unseen labels using LabelEncoder
def safe_transform(label_encoder, value):
    value = value.strip().lower()
    try:
        return label_encoder.transform([value])[0]
    except ValueError:
        print(f"Warning: '{value}' not found in encoder. Assigning default value -1.")
        return -1  # Return -1 or another placeholder for unseen values

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    year = data.get('year')
    district = data.get('district')
    state = data.get('state')
    month = data.get('month')
    rainfall = data.get('rainfall')

    predicted_water = predict_water_availability(year, district, state, month, rainfall)
    return jsonify({'predicted_water': predicted_water})

if __name__ == '__main__':
    app.run(debug=True, port=5003)
