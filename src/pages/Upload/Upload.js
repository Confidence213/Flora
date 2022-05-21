import React from 'react';
import './Upload.css'
import {Post, addNewPost, getAllPosts} from "../../firebase/database"
import {getUsername} from "../../firebase/account"



class UploadPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {species: '', lat: '', long: '', image: null, imageFile: null, showSpecies: false, showLocation: false, showImage: false, map: null};

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImage = this.handleImage.bind(this);

  }

  async handleChange1(event) {    this.setState({species: event.target.value});  }
  async handleChange2(event) {    this.setState({lat: event.target.value});  }
  async handleChange3(event) {    this.setState({long: event.target.value});  }


  async handleSubmit(event) {

    var canPost = true;

    if (this.state.species == '')
    {
      this.setState({showSpecies: true });
      canPost = false;
    }
    else
      this.setState({showSpecies: false });

    if (this.state.lat == '' || this.state.long == '')
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
      const username = await getUsername();

      var today = new Date();
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

      var myPost = new Post(username, "title", "description", this.state.species, this.state.imageFile, this.state.lat, this.state.long, date);

      if(await addNewPost(myPost)){
        alert("Post successfuly made! (I hope..??!?)");
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
          {this.state.showSpecies && <p id='speciesError'>Please enter Species</p>}
          <h3>Lat and Long: </h3>
          <input type="text" onChange={this.handleChange2}/>

          <input type="text" onChange={this.handleChange3}/>
          {this.state.showLocation && <p id='locationError'>Please enter Location</p>}
          <h3></h3>
          <h2></h2>
          <button onClick={this.handleSubmit} className="post">POST</button>
        </div>
      </tc>
      
    </table>
  
    );
  }
}

export default UploadPage;