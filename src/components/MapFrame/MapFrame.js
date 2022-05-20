import React, {useEffect} from 'react';
import './MapFrame.css'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";

function MapDependent(props) {
    const mapOnce = useMap();
    useEffect(() => {
        props.setBounds(mapOnce.getBounds());
      }, []);
    const map = useMapEvents({
        move: () => {
            props.setBounds(map.getBounds());
            console.log(map.getCenter())
        },
    });
    return (null);
}

function MapFrame (props) {
    
    return (
        <MapContainer
          id={props.small ? "leaflet-container-small": "leaflet-container-large"}
          center={props.defaultCenter}
          zoom={props.defaultZoom}
          maxZoom={18}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
            //34.072830, -118.451346
        {props.points.map((point) => {
            return (
                <Marker position={point.position}>
                    <Popup>
                        {point.message}
                    </Popup>
                </Marker>
            );
        })}
        <MapDependent setBounds={props.setBounds}/>
        </MapContainer>
      ); 
}

export default MapFrame;