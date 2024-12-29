import React, { useState } from 'react';
import axios from 'axios';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';

const WaterDemand = () => {
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    year: '',
    month: '',
    frl: '',
    liv_cap: '',
    rainfall: '',
    predicted_population: '',
    predicted_water_availability: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post('http://localhost:5004/predict', formData);
      
      console.log(response.data); // Log to check response
      
      setPrediction(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Something went wrong!');
    }
  };

  // If prediction data is available, use it to create the chart data
  const chartData = prediction
    ? [
        {
          name: 'Prediction',
          population: parseFloat(prediction.predicted_population) || 0,
          water_availability: parseFloat(prediction.predicted_water_availability) || 0,
          water_demand: parseFloat(prediction.predicted_water_demand) || 0,
          rainfall: parseFloat(prediction.rainfall) || 0,
        },
      ]
    : [];

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h1 className="text-2xl font-semibold text-gray-100 mb-6 text-center">Water Demand Prediction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-gray-300 mb-1 capitalize">{key.replace(/_/g, ' ')}:</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-gray-200 border border-gray-600"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded w-full"
        >
          Predict
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {prediction && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Prediction Result</h2>

          {/* Population Graph */}
          <div style={{ width: '100%', height: 300, marginBottom: '20px' }}>
            <h3 className="text-lg text-gray-100 mb-2">Population</h3>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    borderColor: '#4B5563',
                  }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Legend />
                <Bar
                  dataKey="population"
                  name="Population"
                  fill="#3B82F6"
                  isAnimationActive={false}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Water Availability Graph */}
          <div style={{ width: '100%', height: 300, marginBottom: '20px' }}>
            <h3 className="text-lg text-gray-100 mb-2">Water Availability</h3>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    borderColor: '#4B5563',
                  }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Legend />
                <Bar
                  dataKey="water_availability"
                  name="Water Availability"
                  fill="#10B981"
                  isAnimationActive={false}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Water Demand Graph */}
          <div style={{ width: '100%', height: 300, marginBottom: '20px' }}>
            <h3 className="text-lg text-gray-100 mb-2">Water Demand</h3>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    borderColor: '#4B5563',
                  }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Legend />
                <Bar
                  dataKey="water_demand"
                  name="Water Demand"
                  fill="#F59E0B"
                  isAnimationActive={false}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Rainfall Graph */}
          <div style={{ width: '100%', height: 300 }}>
            <h3 className="text-lg text-gray-100 mb-2">Rainfall</h3>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    borderColor: '#4B5563',
                  }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Legend />
                <Bar
                  dataKey="rainfall"
                  name="Rainfall"
                  fill="#8B5CF6"
                  isAnimationActive={false}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WaterDemand;
