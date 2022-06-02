import { Link, useNavigate} from 'react-router-dom'
import { getAllPosts, getPostsByLocation } from '../../firebase/database';
import PostList from '../../components/PostList/PostList';
import Map from "./map.svg";
import React, {useEffect, useState} from 'react';
import './Home.css'
import { list } from 'firebase/storage';

function Home() {
  const [first5Posts, setPosts] = useState(null);
  const [showLoc, setShowLoc] = useState(false);
  const [showLen, setShowLen] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const validZoomInputs = Array.from(Array(19).keys()).map(String) //generate int array of 0, 1,2,..,18, then convert to string array

  let speciesInput = React.createRef();
  let longInput = React.createRef();
  let zoomInput = React.createRef();
  let latInput = React.createRef();
  let button = React.createRef();

  const navigate = useNavigate();

  async function getPosts() {
    //const m_posts = await getPostsByLocation(180, -180, 90, -90);
    const m_posts = null;
    if(m_posts === undefined)
    {
      setPosts(null)
    }
    else {
      setPosts(Array.from(m_posts.values()).slice(0, 5));
    }
  }

  useEffect(() => {
    getPosts();}, []
  );

  async function handleZoomChange(e) {   
    //alert(validZoomInputs.indexOf(e.target.value) >= 0); //returns true if zoom input is 0-18 integer (though, in string form)
    if (!e.target.value == '')
      setShowZoom(!(validZoomInputs.indexOf(e.target.value) >= 0))
    else
      setShowZoom(false)
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
            <input ref={zoomInput} onChange={handleZoomChange} id="zoom" placeholder="zoom level..." />
            {showZoom && <p className="error">Please enter int between 0-18</p>}
          </tr>
          
          <tr><input id="spinput" ref={speciesInput} placeholder="Search Species...(optional)" /></tr>
          <tr><button onClick={handleLocation} ref={button}>Get Current Location</button>
          <button onClick={handleClick} className="search">SEARCH</button></tr>
          <Link to="/map">Or Explore Map</Link>
        </table>
        <img id="map" src={Map} alt="graphic_map"/>
      </div>
      <h2></h2>
      <div className="gallery">
        <h3 id="title"> Discover Sightings</h3> <h2></h2>
        {/*first5Posts?.map((post) => {
          return (<Link to={"/post/" + post.id}><img class="img" src={post.image}/></Link>);
        })*/}
        <Link to="/post/UpkFbAUlB9sfUCm5MLC1"><img class="img" src="https://media.thetab.com/blogs.dir/179/files/2017/04/matts-pic-600x284.jpg"/></Link>
        <Link to="/post/dwk6zCvUuiPR3iU1Bi0y"><img class="img" src="https://i.imgur.com/dligDo7.jpg"/></Link>
        <Link to="/post/14seV2gHyOcd58gmPdVh"><img class="img" src="https://i.imgur.com/GLpoJXA.jpg"/></Link>
        <Link to="/post/yEefsX9HRCwJXxvnWsDL"><img class="img" src="https://i.redd.it/oxqwjebtg5g81.jpg"/></Link>
        <Link to="/post/GAqIP8UR7MyL2nDpjjBs"><img class="img" src="https://i.redd.it/f4vi3qlv24t71.jpg"/></Link>
      </div>
    </div>
  );
}

export default Home;