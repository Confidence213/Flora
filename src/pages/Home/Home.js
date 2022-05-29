import { Link, useNavigate} from 'react-router-dom'
import React, {useState} from 'react';
import './Home.css'

function UploadPage() {
  const [showLoc, setShowLoc] = useState(false);
  const [showLen, setShowLen] = useState(false);

  let speciesInput = React.createRef();
  let longInput = React.createRef();
  let zoomInput = React.createRef();
  let latInput = React.createRef();
  let button = React.createRef();

  const navigate = useNavigate();

  const handleClick = (a) => {
    var zoom = 9;
    if (!(zoomInput.current.value == '' || isNaN(zoomInput.current.value)))
      zoom = parseInt(zoomInput.current.value);

    if (longInput.current.value.length >= 20 || latInput.current.value.length >= 20 || speciesInput.current.value.length >= 40 || zoomInput.current.value.length >= 10) 
    {
      setShowLen(true);
      return;
    }

    setShowLen(false);

    if (longInput.current.value == '' || latInput.current.value == '' || isNaN(longInput.current.value) || isNaN(latInput.current.value))
    {
      setShowLoc(true);
      return;
    }

    setShowLoc(false);
    navigate("/map/" + latInput.current.value + "/" + longInput.current.value + "/" + zoom +"/" + speciesInput.current.value);
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
      <div className="page">
        <table className="inputs">
          <tr><h3>Find Community Sightings:</h3></tr>
          <tr id="LOCATIONinput">
          {showLen && <p className="error">Please shorten your inputs</p>}
          {showLoc && <p className="error">Please enter valid lat and long</p>}
            <input ref={latInput} id="lat" placeholder="*Enter Latitude..." />
            <input ref={longInput} id="long" placeholder="*Enter Longitude..." />
            <input ref={zoomInput} id="zoom" placeholder="zoom level..." />
          </tr>
          
          <tr><input id="spinput" ref={speciesInput} placeholder="Search Species...(optional)" /></tr>
          <tr><button onClick={handleLocation} ref={button}>Get Current Location</button>
          <button onClick={handleClick} className="search">SEARCH</button></tr>
          <Link to="/map">Or Explore Map</Link>
        </table>
        <img id="map" src="https://svgshare.com/i/gvs.svg" alt="graphic_map"/>
      </div>
      <h2></h2>
      <div className="gallery">
        <h3 id="title"> This Week's Gallery</h3> <h2></h2>
        <Link to="/post/UpkFbAUlB9sfUCm5MLC1"><img class="img" src="https://media.thetab.com/blogs.dir/179/files/2017/04/matts-pic-600x284.jpg"/></Link>
        <Link to="/post/dwk6zCvUuiPR3iU1Bi0y"><img class="img" src="https://i.imgur.com/dligDo7.jpg"/></Link>
        <Link to="/post/14seV2gHyOcd58gmPdVh"><img class="img" src="https://i.imgur.com/GLpoJXA.jpg"/></Link>
        <Link to="/post/yEefsX9HRCwJXxvnWsDL"><img class="img" src="https://i.redd.it/oxqwjebtg5g81.jpg"/></Link>
        <Link to="/post/GAqIP8UR7MyL2nDpjjBs"><img class="img" src="https://i.redd.it/f4vi3qlv24t71.jpg"/></Link>
      </div>
    </div>
  );
}

export default UploadPage;