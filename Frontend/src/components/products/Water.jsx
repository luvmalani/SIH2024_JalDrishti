import { useState } from "react";
import axios from "axios";


const Water = () => { 
  const [year, setYear] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [month, setMonth] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const states = ["Shetrunji Reservoir", "Advana", "Aji-I", "Aji - II", "Aji-III", "Phadangbeti", "Phodarness"]; // Example states
  const districts = ["Bhavnagar", "Porbandar", "Rajkot", "Jamnagar"];  // Example districts
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5003/predict", {
        year: parseInt(year),
        district: district,
        state: state,
        month: month,
        rainfall: parseFloat(rainfall),
      });

      setPrediction(response.data.predicted_water);
      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setError("Error predicting water availability: " + error.message);
    }
  };

  const handleClear = () => {
    setYear("");
    setDistrict("");
    setState("");
    setMonth("");
    setRainfall("");
    setPrediction(null);
    setError(""); // Reset error as well
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Water Availability Prediction</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Year Input */}
          <input
            type="number"
            placeholder="Year"
            className="bg-gray-700 text-white rounded-lg p-3"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />

          {/* District Dropdown */}
          <select
            className="bg-gray-700 text-white rounded-lg p-3"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>

          {/* State Dropdown */}
          <select
            className="bg-gray-700 text-white rounded-lg p-3"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          >
            <option value="">Select Name</option>
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          {/* Month Dropdown */}
          <select
            className="bg-gray-700 text-white rounded-lg p-3"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          >
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>

          {/* Rainfall Input */}
          <input
            type="number"
            placeholder="Rainfall (BCM)"
            className="bg-gray-700 text-white rounded-lg p-3"
            value={rainfall}
            onChange={(e) => setRainfall(e.target.value)}
            required
          />
        </div>
        <div className="mt-4 flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Predict
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Clear
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 text-red-500">
          Error: {error}
        </div>
      )}

      {prediction !== null && (
        <div className="mt-6 p-4 bg-green-900 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Prediction:</h3>
          <p className="text-sm mt-2">
            Predicted Water Availability: <strong>{prediction.toFixed(2)}</strong> BCM
          </p>
        </div>
      )}
    </div>
  );
};

export default Water;
