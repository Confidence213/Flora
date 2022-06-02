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

  const validZoomInputs = Array.from(Array(19).keys()).map(String)
  const [showZoom, setShowZoom] = useState(false);
  const [showLoc, setShowLoc] = useState(false);
  const [showLen, setShowLen] = useState(false);

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
    var exit = false;

    if (showZoom)
      return;

    if (!zoomInput.current.value == '')
      zoom = parseInt(zoomInput.current.value);

    if (longInput.current.value.length >= 20 || latInput.current.value.length >= 20 || speciesInput.current.value.length >= 40 || zoomInput.current.value.length >= 10) {
      setShowLen(true);
      exit = true;
    }
    else
      setShowLen(false);

    if (longInput.current.value == '' || latInput.current.value == '' || isNaN(longInput.current.value) || isNaN(latInput.current.value)) {
      setShowLoc(true);
      exit = true;
    }
    else
      setShowLoc(false);

    if (exit)
      return;

    navigate("/map/" + latInput.current.value + "/" + longInput.current.value + "/" + zoom +"/" + speciesInput.current.value);
    document.location.reload();
  }

  async function handleZoomChange(e) {   
    //alert(validZoomInputs.indexOf(e.target.value) >= 0); //returns true if zoom input is 0-18 integer (though, in string form)
    if (!e.target.value == '')
      setShowZoom(!(validZoomInputs.indexOf(e.target.value) >= 0))
    else
      setShowZoom(false)
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
          {showLen && <p className="error">Please shorten your inputs</p>}
          
            <th><input ref={latInput} class="input" placeholder="*Latitude..." /></th>
            <th><input ref={longInput} class="input" placeholder="*Longitude..." /></th>
            <th><input ref={zoomInput} class ="input" onChange={handleZoomChange} placeholder="zoom level..." /></th>
            
            <th><input class="input"  ref={speciesInput} placeholder="Species..." /></th>
            <th><button onClick={handleLocation} className="button" ref={button}>Current Location</button></th>
            <th><button onClick={handleClick} className="button">SEARCH</button></th>
        </tr></table>
        {showLoc && <p className="error">Please enter valid lat and long</p>}
        {showZoom && <p className="error">Please enter int between 0-18</p>}
        {showLen && <p className="error">Please shorten your inputs</p>}
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