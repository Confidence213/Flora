import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import './Map.css'
import { getPostsByLocation, getPostsBySpeciesAndLocation } from '../../firebase/database';
import MapFrame from '../../components/MapFrame/MapFrame';
import PostList from '../../components/PostList/PostList';
import { useParams } from 'react-router-dom'

function Map () {
  let { lat, lng, zm, spc } = useParams();
  let defaultCenter = [lat ?? 34.072830, lng ?? -118.451346];
  let defaultZoom = zm ?? 9;

  let speciesInput = React.createRef();
  let longInput = React.createRef();
  let latInput = React.createRef();
  let zoomInput = React.createRef();
  let button = React.createRef();

  const [bounds, setBounds] = useState(null);
  const [points, setPoints] = useState([]);

  const [list, setList] = useState(null);
  
  const [clickIndex, setClickIndex] = useState(null);
  const [clickUpdate, setClickUpdate] = useState(false);

  const navigate = useNavigate();

  async function getList() {
      const m_list = spc ? await getPostsBySpeciesAndLocation(spc, debouncedBounds?._northEast.lng, 
        debouncedBounds?._southWest.lng, debouncedBounds?._northEast.lat, debouncedBounds?._southWest.lat) :
        await getPostsByLocation(debouncedBounds?._northEast.lng, 
        debouncedBounds?._southWest.lng, debouncedBounds?._northEast.lat, debouncedBounds?._southWest.lat);
      /*(longMax, longMin, latMax, latMin) = northeast lng, southwest lng, northeast lat, southwest lat
      console.log(
        "searching between " + debouncedBounds?._northEast.lng +
        debouncedBounds?._southWest.lng + debouncedBounds?._northEast.lat + debouncedBounds?._southWest.lat
      )
      console.log(Array.from(m_list.values()));*/
      if(m_list === undefined) {
          setList(null);
      }
      else {
        setList(Array.from(m_list.values()));
        setPoints(Array.from(m_list.values()).map((info) => ({
          position: [info.latitude, info.longitude],
          message: <div><p>{info.species} seen {info.date}</p><Link to={"/post/" + info.id}>View Post</Link></div>
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

  function handleListClick(i) {
    setClickUpdate(!clickUpdate);
    setClickIndex(i);
  }

  const handleClick = (a) => {
    var zoom = 9;
    if (!(zoomInput.current.value == '' || isNaN(zoomInput.current.value)))
      zoom = parseInt(zoomInput.current.value);

    if (!(longInput.current.value == '' || latInput.current.value == '' || isNaN(longInput.current.value) || isNaN(latInput.current.value)))
    {
        navigate("/map/" + latInput.current.value + "/" + longInput.current.value + "/" + zoom +"/" + speciesInput.current.value);
        document.location.reload();
    }
  }

  const handleLocation = (a) => {
    button.current.style.background = 'grey';
    if (!"geolocation" in navigator) {
      alert("error: geological data not available")
    }
    else {
      navigator.geolocation.getCurrentPosition( (position) => {    
        latInput.current.value = position.coords.latitude;
        longInput.current.value = position.coords.longitude;
        button.current.style.background = 'white';
      });
    }
  }

  return (
    <div>
      <div class="searchBar">
        <table class="searchTable"><tr>
            <th><input ref={latInput} class="input" placeholder="*Latitude..." /></th>
            <th><input ref={longInput} class="input" placeholder="*Longitude..." /></th>
            <th><input ref={zoomInput} class ="input" placeholder="zoom level..." /></th>
            <th><input class="input"  ref={speciesInput} placeholder="Species..." /></th>
            <th><button onClick={handleLocation} className="button" ref={button}>Current Location</button></th>
            <th><button onClick={handleClick} className="button">SEARCH</button></th>
        </tr></table>
        <h2></h2>
      </div> 
  
      <div class="map-overall">
      {/*<table>
        <tr>
        <td>Southwest lng: {debouncedBounds?._southWest.lng} </td>
        <td>Southwest lat: {debouncedBounds?._southWest.lat} </td>
        <td>Northeast lng: {debouncedBounds?._northEast.lng} </td>
        <td>Northeast lat: {debouncedBounds?._northEast.lat} </td>
        </tr>
      </table>*/}
      <table class="map-table">
        <tr>
        <td class="map-td"><PostList list={list} listClick={handleListClick}/></td>
        <td class="map-td"><MapFrame setBounds={setBounds} points={points} defaultCenter={defaultCenter} 
          small={false} defaultZoom={defaultZoom} clickIndex={clickIndex} clickUpdate={clickUpdate} />
          </td>
          </tr>
      </table>
      </div>
    </div>
  ); 
}

export default Map;