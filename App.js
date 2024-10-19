// App.js
import React, { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};

const center = {
  lat: 38.6270, // Default center (St. Louis)
  lng: -90.1994,
};

function App() {
  const [response, setResponse] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Fetch markers from the backend when the app loads
  useEffect(() => {
    axios.get('http://localhost:5000/locations')
      .then((res) => {
        setMarkers(res.data); // Set markers from the database
      })
      .catch((err) => console.error(err));
  }, []);

  // Handle user response (Yes or No)
  const handleResponse = (isHot) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newMarker = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          isHot,
        };

        // Save the new marker to the backend
        axios.post('http://localhost:5000/locations', newMarker)
          .then((res) => {
            setMarkers([...markers, res.data]); // Add the new marker locally
          })
          .catch((err) => console.error(err));
        
        setResponse(isHot);
      });
    }
  };

  return (
    <Box sx={{ padding: 4, textAlign: 'center' }}>
      <Typography variant="h4">Temperature Monitor</Typography>
      <Box mt={2}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={center}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={{
                url: marker.isHot
                  ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                  : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              }}
            />
          ))}
        </GoogleMap>
      </Box>

      <Typography variant="h6" mt={4}>
        Is it hot at your location?
      </Typography>
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleResponse(true)}
          sx={{ marginRight: 2 }}
        >
          Yes
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleResponse(false)}
        >
          No
        </Button>
      </Box>
    </Box>
  );
}

export default App;
