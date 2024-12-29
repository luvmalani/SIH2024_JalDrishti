from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import pandas as pd
import traceback

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load water availability data
data = pd.read_csv("water_availability_data.csv")  # Replace with your dataset file

# Preprocess data
categorical_cols = ['res_district', 'res_name', 'res_month', 'rain_month']
numeric_cols = ['res_year', 'res_level', 'cur_livsto', 'rainfall']

# Handle missing values
data = data.dropna()

# Encode categorical variables
label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col])
    label_encoders[col] = le

# Scale numeric features
scaler_X = MinMaxScaler()
X = data[numeric_cols]
X_scaled = scaler_X.fit_transform(X)

scaler_y = MinMaxScaler()
y = data["cur_livsto"].values.reshape(-1, 1)
y_scaled = scaler_y.fit_transform(y)

# Reshape for LSTM
def create_lstm_data(X, y, time_steps=1):
    X_lstm, y_lstm = [], []
    for i in range(len(X) - time_steps):
        X_lstm.append(X[i:i+time_steps])
        y_lstm.append(y[i+time_steps])
    return np.array(X_lstm), np.array(y_lstm)

time_steps = 3
X_lstm, y_lstm = create_lstm_data(X_scaled, y_scaled, time_steps)

# Train-test split
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X_lstm, y_lstm, test_size=0.2, random_state=42)

# Build LSTM model
model = Sequential([
    LSTM(50, return_sequences=False, input_shape=(X_train.shape[1], X_train.shape[2])),
    Dense(1)
])
model.compile(optimizer='adam', loss='mean_squared_error')
model.fit(X_train, y_train, epochs=10, batch_size=32, verbose=1)

# Helper functions for safe transformations
def safe_transform(label_encoder, value):
    """Safely transform a value using the label encoder, returning -1 if unseen."""
    value = value.strip().lower()
    try:
        return label_encoder.transform([value])[0]
    except ValueError:
        return -1

# Flask route for prediction
@app.route('/predict_water', methods=['POST'])
def predict_water():
    try:
        data = request.json
        year = int(data["year"])
        district = data["district"]
        name = data["name"]
        month = data["month"].strip().lower()
        rainfall = float(data["rainfall"])

        # Encode inputs
        encoded_district = label_encoders['res_district'].transform([district])[0]
        encoded_name = safe_transform(label_encoders['res_name'], name)
        encoded_month = safe_transform(label_encoders['res_month'], month)
        encoded_rain_month = safe_transform(label_encoders['rain_month'], month)

        # Prepare input data
        input_data = np.array([[year, rainfall, encoded_district, encoded_month]])
        input_scaled = scaler_X.transform(input_data)
        input_scaled = input_scaled.reshape((1, 1, input_scaled.shape[1]))

        # Make prediction
        predicted_scaled = model.predict(input_scaled)
        predicted_actual = scaler_y.inverse_transform(predicted_scaled)

        return jsonify({
            "year": year,
            "district": district,
            "predicted_water_availability": float(predicted_actual[0][0])
        })
    except Exception as e:
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5002)
