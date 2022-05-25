import { setSelectionRange } from '@testing-library/user-event/dist/utils';
import React, {useState} from 'react';
import './Home.css'

function UploadPage() {
  const [showLoc, setShowLoc] = useState(false);

  let speciesInput = React.createRef();
  let longInput = React.createRef();
  let latInput = React.createRef();

  const handleClick = (a) => {
    if (!(longInput.current.value == '' || latInput.current.value == '' || isNaN(longInput.current.value) || isNaN(latInput.current.value)))
      window.location = "/map/" + latInput.current.value + "/" + longInput.current.value + "/9/" + speciesInput.current.value;
    else
      setShowLoc(true);
  }

  const handleLocation = (a) => {
    if (!"geolocation" in navigator) {
      alert("error: geological data not available")
    }
    else {
      navigator.geolocation.getCurrentPosition( (position) => {    
        latInput.current.value = position.coords.latitude;
        longInput.current.value = position.coords.longitude;
      });
    }
  }

  return (
    <div>
      <div className="page">
        <table className="inputs">
          <tr><h3>Find Community Sightings:</h3></tr>
          <tr id="LOCATIONinput">
            <input ref={latInput} id="lat" placeholder="*Enter Latitude..." />
            <input ref={longInput} id="long" placeholder="*Enter Longitude..." />
            {showLoc && <p id='speciesError'>Please enter valid lat and long</p>}
          </tr>
          
          <tr><input id="spinput" ref={speciesInput} placeholder="Search Species...(optional)" /></tr>
          <tr><button onClick={handleLocation} className="post">Get Current Location</button>
          <button onClick={handleClick} className="search">SEARCH</button></tr>
        </table>
        <img id="map" src="https://svgshare.com/i/gvs.svg" alt="graphic_map"/>
      </div>
      <h2></h2>
        <h3 id="title"> This Week's Gallery</h3> <h2></h2>
        <img class="img" src="https://media.thetab.com/blogs.dir/179/files/2017/04/matts-pic-600x284.jpg"/>
        <img class="img" src="https://i.imgur.com/dligDo7.jpg"/>
        <img class="img" src="https://i.imgur.com/GLpoJXA.jpg"/>
        <img class="img" src="https://i.redd.it/oxqwjebtg5g81.jpg"/>
        <img class="img" src="https://i.redd.it/f4vi3qlv24t71.jpg"/>
      
    </div>
  );
}

export default UploadPage;