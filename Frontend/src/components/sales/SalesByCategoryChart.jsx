import { useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Rainfall = () => {
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  const [rainfallData, setRainfallData] = useState([]);
  const [populationData, setPopulationData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [error, setError] = useState("");

  const [predictions, setPredictions] = useState([]); // Store the prediction table data

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending data:", { name, state, district, year, month });

    const yearAsNumber = parseInt(year, 10);

    try {
      const rainfallResponse = await axios.post("http://localhost:5001/predict", {
        name,
        state,
        district,
        year: yearAsNumber,
        month,
      });
      const predictedRainfall = rainfallResponse.data.predicted_rainfall;

      const populationResponse = await axios.post("http://localhost:5000/predict", {
        state,
        district,
        year: yearAsNumber,
        month,
      });
      const predictedPopulation = populationResponse.data.predicted_population;

      setRainfallData((prevData) => [
        ...prevData,
        { month, year, rainfall: predictedRainfall },
      ]);
      setPopulationData((prevData) => [
        ...prevData,
        { month, year, population: predictedPopulation },
      ]);

      const combinedData = rainfallData.map((rainfall, index) => ({
        month: rainfall.month,
        year: rainfall.year,
        rainfall: rainfall.rainfall,
        population: populationData[index]?.population || 0,
      }));
      setCombinedData(combinedData);

      setPredictions((prevPredictions) => [
        ...prevPredictions,
        { name, state, district, year, month, rainfall: predictedRainfall, population: predictedPopulation },
      ]);

      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Error predicting rainfall or population: " + err.message);
    }
  };

  // Dropdown options
  const states = ["Gujarat"];
  const districts = ["Bhavnagar", "Porbandar", "Rajkot","Jamnagar"];
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Combined Prediction (Rainfall & Population)</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="bg-gray-700 text-white rounded-lg p-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          {/* State Dropdown */}
          <select
            className="bg-gray-700 text-white rounded-lg p-3"
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          {/* District Dropdown */}
          <select
            className="bg-gray-700 text-white rounded-lg p-3"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Year"
            className="bg-gray-700 text-white rounded-lg p-3"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />

          {/* Month Dropdown */}
          <select
            className="bg-gray-700 text-white rounded-lg p-3"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month} value={month.toLowerCase()}>{month}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white mt-4 py-2 px-4 rounded-lg"
        >
          Predict
        </button>
      </form>

      {error && (
        <div className="mt-6 text-red-500">
          Error: {error}
        </div>
      )}

      {/* Prediction table and chart code remains the same */}
	  {predictions.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead>
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">State</th>
                <th className="border px-4 py-2">District</th>
                <th className="border px-4 py-2">Year</th>
                <th className="border px-4 py-2">Month</th>
                <th className="border px-4 py-2">Predicted Rainfall (mm)</th>
                <th className="border px-4 py-2">Predicted Population</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((pred, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{pred.name}</td>
                  <td className="border px-4 py-2">{pred.state}</td>
                  <td className="border px-4 py-2">{pred.district}</td>
                  <td className="border px-4 py-2">{pred.year}</td>
                  <td className="border px-4 py-2">{pred.month}</td>
                  <td className="border px-4 py-2">{pred.rainfall}</td>
                  <td className="border px-4 py-2">{pred.population}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
	  {/* Display the combined data chart using Recharts */}
      {combinedData.length > 0 && (
        <div className="mt-8">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={({ payload }) => {
                if (payload && payload.length) {
                  const { month, year, rainfall, population } = payload[0].payload;
                  return (
                    <div>
                      <p><strong>Month:</strong> {month}</p>
                      <p><strong>Year:</strong> {year}</p>
                      <p><strong>Predicted Rainfall:</strong> {rainfall} mm</p>
                      <p><strong>Predicted Population:</strong> {population}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="rainfall"
                stroke="#00C2A4"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="population"
                stroke="#FF5733"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Rainfall;
