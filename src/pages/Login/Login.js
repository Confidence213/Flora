import './Login.css';
import React, { useState } from "react";
import {signIn, makeUser} from "../../firebase/account"

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {lemail: '', lpassword: '', susername: '', 
    spassword: '', semail: ''};


    this.handleChange = this.handleChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleSignUpSubmit = this.handleSignUpSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name
    this.setState({[name]: event.target.value});
  }

  async handleLoginSubmit(event) {
    event.preventDefault();
    if(await signIn(this.state.lemail, this.state.lpassword)){
      alert("Successfully logged in!");
      window.location = "/";
    }
  }

  async handleSignUpSubmit(event) {
    event.preventDefault();
    if(await makeUser(this.state.susername, this.state.semail, this.state.spassword)){
      alert("Account successfuly made!");
      window.location = "/";
    }
  }

  render() {
    return (
      <div>
          <div>
          <table class="login-table"><tr>
            <td>
              <div className="title" style={{textAlign: "center"}}>Login</div>
              <div className="form">
              <form onSubmit={this.handleLoginSubmit}>
                <div className="input-container">
                  <label>
                    Email:
                  </label>
                  <input class="login-input" name="lemail" type="text" value={this.state.lemail} onChange={this.handleChange} required/>
                </div>
                <div className="input-container">
                  <label>
                    Password:
                  </label>
                  <input class="login-input" name="lpassword" type="password" value={this.state.lpassword} onChange={this.handleChange} required/>
                </div>
                <div className="button-container">
                  <input class="login-input" type="submit" />
                </div>
              </form>
            </div>
            </td>
            <td>
              <div className="title" style={{textAlign: "center"}}>Sign Up</div>
              <div className="form">
              <form onSubmit={this.handleSignUpSubmit}>
                <div className="input-container">
                  <label>
                    Email:
                  </label>
                  <input class="login-input" name="semail" type="text" value={this.state.semail} onChange={this.handleChange} required/>
                </div>
                <div className="input-container">
                  <label>
                    Username:
                  </label>
                  <input class="login-input" name="susername" type="text" value={this.state.susername} onChange={this.handleChange} required/>
                </div>
                <div className="input-container">
                  <label>
                    Password:
                  </label>
                  <input class="login-input" name="spassword" type="password" value={this.state.spassword} onChange={this.handleChange} required/>
                </div>
                <div className="button-container">
                  <input class="login-input" type="submit" />
                </div>
              </form>
            </div>
            </td>
          </tr></table>
        </div>
      </div>
    );
  }
}
export default Login;