import './Login.css';
import React, { useState } from "react";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {lemail: '', lpassword: '', susername: '', 
    spassword: '', semail: '', isSubmitted: false};


    this.handleChange = this.handleChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleSignUpSubmit = this.handleSignUpSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name
    this.setState({[name]: event.target.value});
  }

  handleLoginSubmit(event) {
    this.setState({isSubmitted: true});
    alert('An email was submitted: ' + this.state.lemail + " and a password: " + this.state.lpassword);
    event.preventDefault();
  }

  handleSignUpSubmit(event) {
    this.setState({isSubmitted: true});
    alert('A name was submitted: ' + this.state.susername + " and a password: " + this.state.spassword
    + " and email: " + this.state.semail);
    event.preventDefault();
  }

  render() {
    return (
      <div>
          <div>
          <table class="login-table"><tr>
            <td>
              <div className="title" style={{textAlign: "center"}}>Login</div>
              {this.state.isSubmitted ? <div>User successfully logged in</div> : 
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
                  <input class="login-input" name="lpassword" type="text" value={this.state.lpassword} onChange={this.handleChange} required/>
                </div>
                <div className="button-container">
                  <input class="login-input" type="submit" />
                </div>
              </form>
            </div>
              }
            </td>
            <td>
              <div className="title" style={{textAlign: "center"}}>Sign Up</div>
              {this.state.isSubmitted ? <div>User successfully signed up</div> : 
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
                  <input class="login-input" name="spassword" type="text" value={this.state.spassword} onChange={this.handleChange} required/>
                </div>
                <div className="button-container">
                  <input class="login-input" type="submit" />
                </div>
              </form>
            </div>
              }
            </td>
          </tr></table>
        </div>
      </div>
    );
  }
}


export default Login;