import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import Rainfall from "./Rainfall"; // Import the Rainfall component

const Population = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [populationData, setPopulationData] = useState([]);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [name, setName] = useState("");
  const [showRainfall, setShowRainfall] = useState(false);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = populationData.filter(
      (data) =>
        data.state.toLowerCase().includes(term) ||
        data.district.toLowerCase().includes(term) ||
        data.year.toString().includes(term) ||
        data.month.toLowerCase().includes(term)
    );
    setPopulationData(filtered);
  };

  const handlePopulationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/predict", {
        state,
        district,
        year,
        month,
      });

      const predictedPopulation = response.data.predicted_population;

      setPopulationData((prevData) => [
        ...prevData,
        { state, district, year, month, predicted_population: predictedPopulation },
      ]);

      setShowRainfall(true); // Show Rainfall component after population is predicted
    } catch (error) {
      console.error("Error fetching population data:", error);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Population Prediction</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by State, District, Year..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="State"
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <input
            type="text"
            placeholder="District"
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
          <input
            type="number"
            placeholder="Year"
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <input
            type="text"
            placeholder="Month"
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handlePopulationSubmit}
          >
            Predict Population
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 text-white">
          <thead>
            <tr>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2">District</th>
              <th className="px-4 py-2">Year</th>
              <th className="px-4 py-2">Month</th>
              <th className="px-4 py-2">Predicted Population</th>
            </tr>
          </thead>
          <tbody>
            {populationData.map((data, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{data.state}</td>
                <td className="px-4 py-2">{data.district}</td>
                <td className="px-4 py-2">{data.year}</td>
                <td className="px-4 py-2">{data.month}</td>
                <td className="px-4 py-2">{data.predicted_population}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render Rainfall Component */}
      {showRainfall && (
        <Rainfall
          name={name}
          state={state}
          district={district}
          year={year}
          month={month}
        />
      )}
    </motion.div>
  );
};

export default Population;
