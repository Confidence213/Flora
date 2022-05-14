import './Map.css'

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";


function Map () {
    return (
        <MapContainer
          className="leaflet-container"
          center={[51.0, 19.0]}
          zoom={4}
          maxZoom={18}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
            //34.072830, -118.451346
        <Marker position={[34.073, -118.451]}>
            <Popup>
            I know where you live. <br /> Run. 
            </Popup>
        </Marker>
        </MapContainer>
      ); 
}

export default Map;