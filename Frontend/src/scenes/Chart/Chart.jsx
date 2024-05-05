import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

const Chart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/emissions');
      setChartData(response.data);
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };
 

  return (
    <Box m="20px">
      <Typography variant="h4" mb={4}>Distance vs Emissions</Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="CO2_emissions" />
          <YAxis dataKey="distance" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="CO2_emissions" stroke="#8884d8" />
          <Line type="monotone" dataKey="distance" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Chart;
