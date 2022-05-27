import React from 'react';
import './Upload.css'
import {Post, addNewPost, getAllPosts} from "../../firebase/database"
import {userLoggedIn, getUsername} from "../../firebase/account"



class UploadPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {loaded: false, species: '', lat: '', long: '', image: null, imageFile: null, showSpecies: false, showLocation: false, showImage: false, map: null, loggedIn: true};

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.handleLocation = this.handleLocation.bind(this); 

  }

  async handleChange1(event) {    this.setState({species: event.target.value});  }
  async handleChange2(event) {    this.setState({lat: event.target.value});  }
  async handleChange3(event) {    this.setState({long: event.target.value});  }

  latRef = React.createRef();
  longRef = React.createRef();
  button = React.createRef();

  async componentDidMount(){
    const m_signedIn = await userLoggedIn();
    this.setState({loaded: true, loggedIn: m_signedIn});
  }

  async handleLocation() {
    if (this.state.loaded)
    { 
      if (!"geolocation" in navigator) {
        alert("error: geological data not available")
      }
      else {
        navigator.geolocation.getCurrentPosition( (position) => {    
          this.setState({lat: position.coords.latitude });
          this.setState({long: position.coords.longitude });
          this.latRef.current.value = position.coords.latitude;
          this.longRef.current.value = position.coords.longitude;
        });
      }
    }
  }

  async handleSubmit(event) {

    var canPost = true;

    if (this.state.species == '')
    {
      this.setState({showSpecies: true });
      canPost = false;
    }
    else
      this.setState({showSpecies: false });

    if (this.state.lat == '' || this.state.long == '' || isNaN(this.state.lat) || isNaN(this.state.long))
    {
      this.setState({showLocation: true });
      canPost = false;
    }
    else
      this.setState({showLocation: false });

    if (this.state.image == null)
    {
      this.setState({showImage: true });
      canPost = false;
    }
    else
      this.setState({showImage: false });

    if (canPost == true)
    {
      this.button.current.style.background = 'grey';
      const username = await getUsername();

      var today = new Date();
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

      var myPost = new Post(username, "title", "description", this.state.species, this.state.imageFile, this.state.lat, this.state.long, date);

      if(await addNewPost(myPost)){
        this.button.current.style.background = 'white';
        alert("Post successfuly made!");
        //this.setState({map: getAllPosts()});
        window.location = "/";
      }
    }

    //alert(this.state.species + this.state.location);
    event.preventDefault();
  }

  handleImage(e) {    
    if (e.target.files && e.target.files[0]) {
      
      let img = e.target.files[0];

      var reader = new FileReader();
      var file = document.querySelector('input[type=file]').files[0];
      reader.readAsDataURL(file);

      this.setState({
        imageFile: file,
        image: URL.createObjectURL(img)
      });
      }
  }

  render() {
  return (

  <div>
    {this.state.loggedIn ?
          
    <table className="page">
    <tc>
      <div className="image_input">
        <h3>Add Image:</h3>
        <input type="file" onChange={this.handleImage} accept="image/png, image/gif, image/jpeg" />
        <img id="image" src={this.state.image}/>
        {this.state.showImage && <p id='imageError'>Please enter Image</p>}
      </div>
    </tc>

    <tc>
      <div className="other_input">
        <h3>Species: </h3>

        <input type="text" onChange={this.handleChange1}/>
        {this.state.showSpecies && <p id='speciesError'>Please enter valid Species</p>}
        <h3>Lat and Long: </h3>
        <input type="text" ref={this.latRef} onChange={this.handleChange2} />

        <input type="text" ref={this.longRef} onChange={this.handleChange3}/>
        {this.state.showLocation && <p id='locationError'>Please enter valid Location</p>}
        <h3></h3>
        <h2></h2>
        <button onClick={this.handleLocation} className="post">Get Current Location</button>
        <button onClick={this.handleSubmit} ref={this.button} className="post">POST</button>
      </div>
    </tc>
  </table>
:
<h2>Error: Not logged in</h2>
    }
    </div>
    );
  }
}

export default UploadPage;