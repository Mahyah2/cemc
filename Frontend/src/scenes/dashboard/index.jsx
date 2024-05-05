import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/Header";
import Map from '../Map/Map';


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to store the data fetched from the backend
  const [tableData, setTableData] = useState([]);
  
 


  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="VTICEMC" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      <Map/>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >

      </Box>

      {/* TABLE */}
      <Box mt={4}>
        <Typography variant="h5" mb={2}>Data Table</Typography>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Distance</th>
              <th>Emissions</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(row => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.distance}</td>
                <td>{row.emissions}</td>
                <td>{row.latitude}</td>
                <td>{row.longitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default Dashboard;