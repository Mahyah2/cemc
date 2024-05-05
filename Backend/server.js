const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port =  8081;
const http = require('http');
const socketIo = require('socket.io');
const mqtt = require('mqtt');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    // origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});


app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:'',
    database:"final_year_project",
    port:"3306"
});

connection.connect();


// MQTT Client setup
const MQTT_USERNAME = 'vehicletracking-carbonemissions@ttn'
const MQTT_PASSWORD = 'NNSXS.QBIEABWCTHM7FLOLG6ABLZL7Z33GT76OX3UBRIQ.HTFSUBAE5DG4SCQFDKZJ42NI3I5BY4GXD45EKM7GWFF3OJIDQFCA'

const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const host = 'mqtt://eu1.cloud.thethings.network:1883';
const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  rejectUnauthorized: false
};

const mqttClient = mqtt.connect(host, options);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT Broker');
    mqttClient.subscribe('v3/vehicletracking-carbonemissions@ttn/devices/+/up', (err) => {
        if (!err) {
            console.log('Subscription successful');
        } else {
            console.error('Subscription failed:', err);
        }
    });
});



global.io = io;

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
  });

  mqttClient.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    console.log('Received message:', data);
    io.emit('trackerUpdate', data);  // Emit to all connected Socket.IO clients
  });



// API endpoint to receive data from Things Console and calculate emissions
app.post('/api/data', (req, res) => {
  const { distance, CO2_emissions, latitude, longitude } = req.body;
  console.log('Received request', req.body);

  // Insert emissions data into database
  connection.query('INSERT INTO emissions_data (distance, CO2_emissions, latitude, longitude) VALUES (?, ?, ?, ?)', [distance, CO2_emissions, latitude, longitude], (error, results) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).send('Error saving data');
      return;
    } else{
      global.io.emit('trackerUpdate',{distance, CO2_emissions, latitude, longitude})
      console.log('Received data', {distance, CO2_emissions, latitude, longitude})
    }
  }
);

// API endpoint to fetch emissions data
app.get('/api/emissions', (req, res) => {
  connection.query('SELECT * FROM emissions_data', (error, results) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results); // Send emissions data as JSON response
  });
});
  
});

server.listen(port || 5000, '0.0.0.0', () => console.log(`Server running on port ${port}`));

app.get('/',(req,res)=>{
  res.send("hello world")
})