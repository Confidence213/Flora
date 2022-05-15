import React from "react"
import './Upload.css'
  
class UploadPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {species: '', location: '', image: null, showSpecies: false, showLocation: false, showImage: false};

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImage = this.handleImage.bind(this);

  }

  handleChange1(event) {    this.setState({species: event.target.value});  }
  handleChange2(event) {    this.setState({location: event.target.value});  }

  handleSubmit(event) {
    if (this.state.species == '')
    {
      this.setState({showSpecies: true });
    }
    else {
      this.setState({showSpecies: false });
    }

    if (this.state.location == '')
    {
      this.setState({showLocation: true });
    }
    else {
      this.setState({showLocation: false });
    }

    if (this.state.image == null)
    {
      this.setState({showImage: true });
    }
    else {
      this.setState({showImage: false });
    }

    //alert(this.state.species + this.state.location);
    event.preventDefault();
  }

  handleImage(e) {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      this.setState({
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
          <h3>Location: </h3>
          <input type="text" id = "species" onChange={this.handleChange2}/>
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