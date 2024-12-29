import { useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Rainfall = () => {
  const [state, setState] = useState(""); // State input
  const [name, setName] = useState(""); // Name input
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

    const yearAsNumber = parseInt(year, 10);

    try {
      const rainfallResponse = await axios.post("http://localhost:5002/predict", {
        name,
        state,
        district,
        year: yearAsNumber,
        month,
      });
      const predictedRainfall = rainfallResponse.data.predicted_rainfall;

      const populationResponse = await axios.post("http://localhost:5001/predict", {
        state,
        district,
        year: yearAsNumber,
        month,
      });
      const predictedPopulation = populationResponse.data.predicted_population;

      // Update rainfall and population data arrays
      setRainfallData((prevData) => [
        ...prevData,
        { district, month, year, rainfall: predictedRainfall },
      ]);
      setPopulationData((prevData) => [
        ...prevData,
        { district, month, year, population: predictedPopulation },
      ]);

      // Combine the data for rendering
      setCombinedData((prevCombinedData) => {
        const newCombinedData = [...prevCombinedData];
        const newData = {
          district,
          month,
          year,
          rainfall: predictedRainfall,
          population: predictedPopulation,
        };
        newCombinedData.push(newData);
        return newCombinedData;
      });

      // Add predictions to the table
      setPredictions((prevPredictions) => [
        ...prevPredictions,
        { name, state, district, year, month, rainfall: predictedRainfall, population: predictedPopulation },
      ]);

      setError("");
    } catch (err) {
      setError("Error predicting rainfall or population: " + err.message);
    }
  };

  const handleClear = () => {
    setState("");
    setName("");
    setDistrict("");
    setYear("");
    setMonth("");
    setRainfallData([]);
    setPopulationData([]);
    setCombinedData([]);
    setPredictions([]);
    setError("");
  };

  // Dropdown options
  const states = ["Gujarat"];
  const districts = ["Bhavnagar", "Porbandar", "Rajkot", "Jamnagar"];
  const names = ["Shetrunji Reservoir", "Advana", "Aji-I", "Aji - II", "Aji-III", "Phadangbeti", "Phodarness"]; // Example names
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

  // Group combined data by district
  const groupedData = combinedData.reduce((acc, data) => {
    const { district } = data;
    if (!acc[district]) acc[district] = [];
    acc[district].push(data);
    return acc;
  }, {});

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Combined Prediction (Rainfall & Population)</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <select
            className="bg-gray-700 text-white rounded-lg p-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
            <option value="">Select Name</option>
            {names.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

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
        <div className="mt-4 flex space-x-4">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
            Predict
          </button>
          <button type="button" onClick={handleClear} className="bg-red-500 text-white py-2 px-4 rounded-lg">
            Clear
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 text-red-500">
          Error: {error}
        </div>
      )}

      {predictions.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead>
              <tr>
                <th className="border px-4 py-2">State</th>
                <th className="border px-4 py-2">Name</th>
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
                  <td className="border px-4 py-2">{pred.state}</td>
                  <td className="border px-4 py-2">{pred.name}</td>
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

      {Object.keys(groupedData).length > 0 && (
        <div className="mt-8 space-y-6">
          {Object.entries(groupedData).map(([district, districtData]) => (
            <div key={district} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-center mb-4">
                  {district} - Rainfall Trends
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={districtData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="rainfall"
                      stroke="#00C2A4"
                      activeDot={{ r: 8 }}
                      name="Rainfall (mm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-center mb-4">
                  {district} - Population Trends
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={districtData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="population"
                      stroke="#FF5733"
                      activeDot={{ r: 8 }}
                      name="Population"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rainfall;
