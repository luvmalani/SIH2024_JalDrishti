from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
from sklearn.model_selection import train_test_split

# Flask app setup
app = Flask(__name__)
CORS(app)

# Step 1: Load and preprocess the dataset
data = pd.read_csv("population_model_data.csv")  # Replace with your file name

# Step 2: Select relevant columns
population_columns = ["res_state", "res_district", "pop_year", "pop_month", "population"]
population_data = data[population_columns]
population_data = population_data.dropna()
population_data["pop_month"] = population_data["pop_month"].str.capitalize()

# Step 3: Encode categorical variables
label_encoders = {}
categorical_columns = ["res_state", "res_district", "pop_month"]
for col in categorical_columns:
    le = LabelEncoder()
    population_data[col] = le.fit_transform(population_data[col])
    label_encoders[col] = le

# Step 4: Define features and target
X = population_data.drop(columns=["population"])
y = population_data["population"]

# Step 5: Feature scaling
scaler_X = MinMaxScaler(feature_range=(0, 1))
X_scaled = scaler_X.fit_transform(X)

scaler_y = MinMaxScaler(feature_range=(0, 1))
y_scaled = scaler_y.fit_transform(y.values.reshape(-1, 1))

X_scaled = X_scaled.reshape((X_scaled.shape[0], 1, X_scaled.shape[1]))
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_scaled, test_size=0.2, random_state=42)

# Step 6: Create and train the LSTM model
model = Sequential()
model.add(LSTM(units=50, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])))
model.add(Dropout(0.2))
model.add(LSTM(units=50, return_sequences=False))
model.add(Dropout(0.2))
model.add(Dense(units=1))

model.compile(optimizer="adam", loss="mean_squared_error")
model.fit(X_train, y_train, epochs=20, batch_size=32, validation_data=(X_test, y_test))

# Flask Routes
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        print("Received Data:", data)  # Debugging purpose

        future_year = int(data.get("year"))
        state = data.get("state")
        district = data.get("district")
        month = data.get("month")

        # Encode input data
        encoded_month = label_encoders["pop_month"].transform([month.capitalize()])[0]
        encoded_state = label_encoders["res_state"].transform([state])[0]
        encoded_district = label_encoders["res_district"].transform([district])[0]

        # Prepare the input for prediction
        future_data = np.array([[encoded_state, encoded_district, future_year, encoded_month]])
        future_data_scaled = scaler_X.transform(future_data)
        future_data_scaled = future_data_scaled.reshape((future_data_scaled.shape[0], 1, future_data_scaled.shape[1]))

        # Predict and inverse transform
        future_population_scaled = model.predict(future_data_scaled)
        future_population = scaler_y.inverse_transform(future_population_scaled)

        print("Predicted Population:", future_population)  # Debugging

        return jsonify({"year": future_year, "predicted_population": float(round(future_population[0][0]))})
    except Exception as e:
        print("Error in Prediction:", str(e))  # Debugging
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
