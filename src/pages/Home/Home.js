import React from 'react';
import ReactDOM from 'react-dom/client';
import './Home.css'

function uploadPage() {

  let speciesInput = React.createRef();
  let milesInput = React.createRef();
  let locationInput = React.createRef();
  
  const handleClick = (a) => {
    console.log(speciesInput.current.value);
    console.log(milesInput.current.value);
    console.log(locationInput.current.value);
  }

  return (
    <div className="page">
      <table className="inputs">
        <tr><h3>Find Community Sightings:</h3></tr>
        <tr id="LOCATIONinput">
          <input id="locinput" ref={locationInput} placeholder="Search Location..." />
          <input id="minput" ref={milesInput} placeholder="miles..." />
        </tr>
        
        <tr><input id="spinput" ref={speciesInput} placeholder="Search Species..." /></tr>
        <tr><button onClick={handleClick} className="search">SEARCH</button></tr>
      </table>
      <img id="map" src="https://svgshare.com/i/gvs.svg" alt="graphic_map"/>
    </div>
  );
}

export default uploadPage;