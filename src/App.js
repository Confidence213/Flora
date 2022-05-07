import './App.css';
import React, { useState } from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {lusername: '', lpassword: '', susername: '', 
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
    alert('A name was submitted: ' + this.state.lusername + " and a password: " + this.state.lpassword);
    event.preventDefault();
  }

  handleSignUpSubmit(event) {
    this.setState({isSubmitted: true});
    alert('A name was submitted: ' + this.state.susername + " and a password: " + this.state.spassword
    + "email: " + this.state.semail);
    event.preventDefault();
  }

  render() {
    return (
      <login-table><tr>
        <div className="app">
          <div className="login-form" >
            <td>
              <div className="title" style={{textAlign: "center"}}>Login</div>
              {this.state.isSubmitted ? <div>User successfully logged in</div> : 
              <div className="form">
              <form onSubmit={this.handleLoginSubmit}>
                <div className="input-container">
                  <label>
                    Username:
                  </label>
                  <input name="lusername" type="text" value={this.state.lusername} onChange={this.handleChange} required/>
                </div>
                <div className="input-container">
                  <label>
                    Password:
                  </label>
                  <input name="lpassword" type="text" value={this.state.lpassword} onChange={this.handleChange} required/>
                </div>
                <div className="button-container">
                  <input type="submit" />
                </div>
              </form>
            </div>
              }
            </td>
            <td>
              <div className="title" style={{textAlign: "center"}}>SignUp</div>
              {this.state.isSubmitted ? <div>User successfully signed up</div> : 
              <div className="form">
              <form onSubmit={this.handleSignUpSubmit}>
                <div className="input-container">
                  <label>
                    Email:
                  </label>
                  <input name="semail" type="text" value={this.state.semail} onChange={this.handleChange} required/>
                </div>
                <div className="input-container">
                  <label>
                    Username:
                  </label>
                  <input name="susername" type="text" value={this.state.susername} onChange={this.handleChange} required/>
                </div>
                <div className="input-container">
                  <label>
                    Password:
                  </label>
                  <input name="spassword" type="text" value={this.state.spassword} onChange={this.handleChange} required/>
                </div>
                <div className="button-container">
                  <input type="submit" />
                </div>
              </form>
            </div>
              }
            </td>
          </div>
        </div>
      </tr></login-table>
    );
  }
}

/*function App() {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dummy User Login database
  const database = [
    {
      username: "user1",
      password: "pass1"
    },
    {
      username: "user2",
      password: "pass2"
    }
  ];

  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };

  const handleLoginSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass, email } = document.forms[0];

    // Find user login info
    const userData = database.find((user) => user.username === uname.value);

    // Compare user info
    if (userData) {
      if (userData.password !== pass.value) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        setIsSubmitted(true);
      }
    } else {
      // Username not found
      setErrorMessages({ name: "uname", message: errors.uname });
    }
  };

  const handleSignUpSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();
    setIsSubmitted(true);
  }

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderLoginForm = (
    <div className="form">
      <form onSubmit={handleLoginSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  const renderSignUpForm = (
    <div className="form">
      <form onSubmit={handleSignUpSubmit}>
      <div className="input-container">
          <label>Email </label>
          <input type="text" name="email" required />
        </div>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  return (
    <login-table><tr>
      <div className="app">
        <div className="login-form" >
          <td>
            <div className="title" style={{textAlign: "center"}}>Login</div>
            {isSubmitted ? <div>User successfully logged in</div> : renderLoginForm}
          </td>
          <td>
            <div className="title" style={{textAlign: "center"}}>Sign Up</div>
            {isSubmitted ? <div>User successfully signed up</div> : renderSignUpForm}
          </td>
        </div>
      </div>
    </tr></login-table>
  );
}*/



export default App;