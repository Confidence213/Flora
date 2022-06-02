import React, {useState} from 'react';
import { useNavigate} from 'react-router-dom'
import './Upload.css'
import {Post, addNewPost} from "../../firebase/database"
import {userLoggedIn, getUsername} from "../../firebase/account"

function UploadPage() {

  const [species, setSpecies] = useState('');
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showSpecies, setShowSpecies] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [map, setMap] = useState(null);
  const [loggedIn, setLoggedIn] = useState(true);

  let latRef = React.createRef();
  let longRef = React.createRef();
  let button = React.createRef();

  const navigate = useNavigate();

  async function handleChange1(e) {    
    if (e.target.value.length < 40)
    setSpecies(e.target.value)
  }

  async function handleChange2(e) {    
    if (e.target.value.length < 20)
      setLat(e.target.value)
  }

  async function handleChange3(e) {    
    if (e.target.value.length < 20)
      setLong(e.target.value)
  }

  async function handleLocation() {
    if (!"geolocation" in navigator) {
      alert("error: geological data not available")
    }
    else {
      navigator.geolocation.getCurrentPosition( (position) => {    
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
        latRef.current.value = position.coords.latitude;
        longRef.current.value = position.coords.longitude;
      });
    }
  }

  async function handleSubmit(event) {
    var canPost = true;
    const m_signedIn = await userLoggedIn();
    setLoggedIn(m_signedIn)

    if (!m_signedIn){
      alert("Please sign in to post")
      navigate("/login");
      return;
    }
    if (species == '')
    {
      setShowSpecies(true);
      canPost = false;
    }
    else
      setShowSpecies(false);

    if (lat == '' || long == '' || isNaN(lat) || isNaN(long))
    {
      setShowLocation(true);
      canPost = false;
    }
    else
      setShowLocation(false);

    if (image == null)
    {
      setShowImage(true);
      canPost = false;
    }
    else
      setShowImage(false);

    if (canPost == true)
    {
      button.current.style.background = 'grey';
      const username = await getUsername();

      var today = new Date();
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

      var myPost = new Post(username, "title", "description", species, imageFile, lat, long, date);
      var postid = await addNewPost(myPost)
      button.current.style.background = 'white';
      //window.location = "/post/" + postid;
      navigate("/post/" + postid);
    }

    //alert(species + location);
    event.preventDefault();
  }

  async function handleImage(e) {    
    if (e.target.files && e.target.files[0]) {
      
      let file_size = e.target.files[0].size;
      var file_type = e.target.files[0].type
      if((file_size > 20000000) || (!(file_type.startsWith("image/"))))
      {
        setShowImage(true);
        return;
      }
      setShowImage(false);

      let img = e.target.files[0];

      var reader = new FileReader();
      var file = document.querySelector('input[type=file]').files[0];
      reader.readAsDataURL(file);

      setImageFile(file);
      setImage(URL.createObjectURL(img));
  }
}


  return (

  <div>
  <table className="page">
    <tc>
      <div className="image_input">
        <h3>Add Image:</h3>
        <input type="file" onChange={handleImage} accept="image/png, image/gif, image/jpeg" />
        <img id="image" src={image}/>
        {showImage && <p id='imageError'>Please upload image under 20mb</p>}
      </div>
    </tc>

    <tc>
      <div className="other_input">
        <h3>Species: </h3>

        <input type="text" onChange={handleChange1}/>
        {showSpecies && <p id='speciesError'>Please enter valid Species under 40 characters</p>}
        <h3>Lat and Long: </h3>
        <input type="text" ref={latRef} onChange={handleChange2} />

        <input type="text" ref={longRef} onChange={handleChange3}/>
        {showLocation && <p id='locationError'>Please enter valid Location under 20 digits</p>}
        <h3></h3>
        <h2></h2>
        <button onClick={handleLocation} className="post">Get Current Location</button>
        <button onClick={handleSubmit} ref={button} className="post">POST</button>
      </div>
    </tc>
  </table>
  </div>
  );
}

export default UploadPage;