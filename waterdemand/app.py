from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
from sklearn.model_selection import train_test_split
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ... rest of your Flask application code ...



# Load dataset
data = pd.read_csv('water_demand_model_updated.csv')  # Replace with your dataset path

# Select relevant columns for training (excluding predicted fields)
columns = ["res_state", "res_district", "res_year", "res_month", "res_frl", "liv_cap", 
           "rainfall", "population", "water demand (MCM)"]  # Include the new column
data = data[columns]

# Handle missing values
data = data.dropna()

# Encode categorical columns
categorical_cols = ["res_state", "res_district", "res_month"]
label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col])
    label_encoders[col] = le

# Split features and target
X = data.drop(columns=["water demand (MCM)"])  # Features excluding the new target
y = data["water demand (MCM)"]  # Target is the water demand

# Scale features (Only 8 features used for scaling)
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# Reshape input for LSTM
X_reshaped = X_scaled.reshape(X_scaled.shape[0], 1, X_scaled.shape[1])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_reshaped, y, test_size=0.2, random_state=42)

# Define the LSTM model
model = Sequential([
    LSTM(64, input_shape=(1, X_train.shape[2]), return_sequences=True),
    Dropout(0.2),
    LSTM(32),
    Dropout(0.2),
    Dense(1)
])

model.compile(optimizer='adam', loss='mean_squared_error')

# Train the model
model.fit(X_train, y_train, epochs=50, batch_size=32, validation_data=(X_test, y_test))

# Dynamic Prediction Function
def predict_water_demand(state, district, year, month, frl, liv_cap, rainfall, 
                         predicted_population, predicted_water_availability):
    """
    Predict water demand based on input factors, including dynamic population and water availability.
    :param state: Reservoir state (e.g., "Gujarat")
    :param district: Reservoir district (e.g., "Bhavnagar")
    :param year: Year (e.g., 2025)
    :param month: Month (e.g., "January")
    :param frl: Reservoir full reservoir level (e.g., 200.0)
    :param liv_cap: Reservoir live capacity (e.g., 150.0)
    :param rainfall: Rainfall in mm (e.g., 300.0)
    :param predicted_population: Predicted population (e.g., 563131.625)
    :param predicted_water_availability: Predicted water availability (e.g., 0.0121694877743721)
    :return: Predicted water demand
    """
    # Encode inputs
    encoded_state = label_encoders["res_state"].transform([state])[0]
    encoded_district = label_encoders["res_district"].transform([district])[0]
    encoded_month = label_encoders["res_month"].transform([month])[0]

    # Combine all inputs into a single array with only the features used for training
    input_data = np.array([[encoded_state, encoded_district, year, encoded_month, 
                            frl, liv_cap, rainfall, predicted_population, predicted_water_availability]])

    # Select the features used for training
    scaler_features = scaler.data_range_.shape[0]
    input_scaled = scaler.transform(input_data[:, :scaler_features])  # Only scale the features that were used for training

    # Convert float32 to float for JSON serialization
    input_scaled = input_scaled.astype(np.float32)

    # Reshape for LSTM input
    input_reshaped = input_scaled.reshape(1, 1, input_scaled.shape[1])

    # Predict water demand
    demand_prediction = model.predict(input_reshaped)

    # Convert to a native Python float for JSON serialization
    predicted_value = demand_prediction[0][0].item()

    # Return the predicted value
    return predicted_value

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Retrieve input data from request
        data = request.get_json()
        state = data['state']
        district = data['district']
        year = data['year']
        month = data['month']
        frl = data['frl']
        liv_cap = data['liv_cap']
        rainfall = data['rainfall']
        predicted_population = data['predicted_population']
        predicted_water_availability = data['predicted_water_availability']
        
        # Predict water demand
        predicted_demand = predict_water_demand(state, district, year, month, frl, liv_cap, rainfall,
                                                predicted_population, predicted_water_availability)
        
        # Return the prediction as a JSON response
        return jsonify({
            "state": state,
            "district": district,
            "year": year,
            "month": month,
            "frl": frl,
            "liv_cap": liv_cap,
            "rainfall": rainfall,
            "predicted_population": predicted_population,
            "predicted_water_availability": predicted_water_availability,
            "predicted_water_demand": predicted_demand
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,port=5004)
