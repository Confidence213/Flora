import React, { useState, useEffect } from 'react';
import './Map.css'
import { getPostsByLocation, getPostsBySpeciesAndLocation } from '../../firebase/database';
import MapFrame from '../../components/MapFrame/MapFrame';
import { useParams } from 'react-router-dom'

function Map () {
  let { lat, lng, zm, spc } = useParams();
  let defaultCenter = [lat ?? 34.072830, lng ?? -118.451346];
  let defaultZoom = zm ?? 9;

  const [bounds, setBounds] = useState(null);
  const [points, setPoints] = useState([]);

  const [list, setList] = useState(null);
  
  async function getList() {
      const m_list = spc ? await getPostsBySpeciesAndLocation(spc, debouncedBounds?._northEast.lng, 
        debouncedBounds?._southWest.lng, debouncedBounds?._northEast.lat, debouncedBounds?._southWest.lat) :
        await getPostsByLocation(debouncedBounds?._northEast.lng, 
        debouncedBounds?._southWest.lng, debouncedBounds?._northEast.lat, debouncedBounds?._southWest.lat);
      //(longMax, longMin, latMax, latMin) = northeast lng, southwest lng, northeast lat, southwest lat
      console.log(
        "searching between " + debouncedBounds?._northEast.lng +
        debouncedBounds?._southWest.lng + debouncedBounds?._northEast.lat + debouncedBounds?._southWest.lat
      )
      console.log(Array.from(m_list.values()));
      if(m_list === undefined) {
          setList(null);
      }
      else {
        setList(Array.from(m_list.values()));
        setPoints(Array.from(m_list.values()).map((info) => ({
          position: [info.latitude, info.longitude],
          message: <div><p>{info.species} seen {info.date}</p><a href={"/post/" + info.id}>View Post</a></div>
        })));
      }
  }

  const debouncedBounds = useDebounce(bounds, 500);
  useEffect(
    () => {
      getList();
    },
    [debouncedBounds] 
  );

  // debounce custom hook
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(
      () => {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay] 
    );

    return debouncedValue;
  }



  return (
    <div>
    <span>
      <p>Southwest lng: {debouncedBounds?._southWest.lng} </p>
      <p>Southwest lat: {debouncedBounds?._southWest.lat} </p>
      <p>Northeast lng: {debouncedBounds?._northEast.lng} </p>
      <p>Northeast lat: {debouncedBounds?._northEast.lat} </p>
    </span>

      <MapFrame setBounds={setBounds} points={points} defaultCenter={defaultCenter} 
        small={false} defaultZoom={defaultZoom} />
    </div>
  ); 
}

export default Map;