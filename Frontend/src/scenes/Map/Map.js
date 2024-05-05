import React, {useEffect, useState} from "react";
import { GoogleMap, LoadScript, Marker} from '@react-google-maps/api'
import io from 'socket.io-client';

const socket = io('http://localhost:8081'); // Connect to the backend server directly

const Map = () =>{

    const [trackerPosition, setTrackerPosition] = useState({
        latitude: 0, // Initial position
        longitude: 0
      });
    
      useEffect(() => {
      
        // Listen for real-time updates from your backend
        socket.on('trackerUpdate', (data) => {
          setTrackerPosition({
            latitude: data.latitude,
            longitude: data.longitude,
          });
        });
      
        // Clean up the socket connection when the component unmounts
        return () => socket.disconnect();
      }, []);
      
    
      useEffect(() => {
      }, [trackerPosition]);

    const api = 'AIzaSyDh--gm4WfeXJ0-ENwK383cKIYF3sy8JSc'
    return(
        <div>
            <LoadScript
            id="script-loader"
            googleMapsApiKey= {api}
             >
                <GoogleMap
            mapContainerClassName="map"
            center={{lat:8, lng:0}}
            zoom={9.5}
            >
                <Marker position={
                  {lat:trackerPosition.latitude, lng:trackerPosition.longitude}} />
            </GoogleMap>
          </LoadScript>
            
        </div>
    )
}

export default Map