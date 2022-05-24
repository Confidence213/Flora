import React, {useEffect, useRef} from 'react';
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
        },
    });
    return (null);
}

function MapFrame (props) {
    const pointsRef = useRef([]);

    useEffect(() => {
      if(props.clickIndex == null) {
        return;
      }
      pointsRef.current[props.clickIndex].togglePopup();
    }, [props.clickIndex, props.clickUpdate]);

    useEffect(() => {
      pointsRef.current = new Array(props.points.length);
    }, [props.points]);

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

        {props.points.map((point, i) => {
            const curRef = (e) => {pointsRef.current[i] = e;} 
            return (
                <Marker position={point.position} ref={curRef}>
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