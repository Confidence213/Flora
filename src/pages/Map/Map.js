import React, { useState } from 'react';
import './Map.css'
import MapFrame from '../../components/MapFrame/MapFrame';

function Map () {
  let defaultCenter = [34.072830, -118.451346]
  const [bounds, setBounds] = useState(null);
  const [points, setPoints] = useState([{
      position: [34.073, -118.451],
      message: <div><p>Bird seen 5:55 AM</p><a href="https://example.com">View Post</a></div>
    },
    {
      position: [34.173, -118.551],
      message: <div><p>Squirell seen 6:55 AM</p><a href="https://example.com">View Post</a></div>
    },
  ]);


  return (
    <div>
    {bounds ? 
    <span>
      <p>Southwest lng: {bounds._southWest.lat} </p>
      <p>Southwest lat: {bounds._southWest.lng} </p>
      <p>Northeast lng: {bounds._northEast.lat} </p>
      <p>Northeast lat: {bounds._northEast.lng} </p> 
      </span>
      : null 
    }
      <MapFrame setBounds={setBounds} points={points} defaultCenter={defaultCenter} 
        small={false} defaultZoom={9} />
    </div>
  ); 
}

export default Map;