import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'
import {signOutUser} from "../../firebase/account"
import './Header.css'
import {userLoggedIn, getUsername} from "../../firebase/account"
function Header () {
    const [username, setUsername] = useState(null);
    const [signedIn, setIsLoggedIn] = useState(null);

    async function getUserInfo(){
        const m_username = await getUsername();
        const m_signedIn = await userLoggedIn();

        setUsername(m_username);
        setIsLoggedIn(m_signedIn);
    }
    useEffect(() => {
        getUserInfo();
      }, []);

    async function handleLogout(e) {
        e.preventDefault();
        if (signOutUser())
        {
            alert("Successfully signed out!");
            window.location = "/";
        }

        
        
    }
    
    return (
        <div class="header-center">
            <h2><Link class="header-link" to="/">FloraFauna</Link></h2>
            {signedIn ?
                <table class="header-table"><tr>
                    <th><Link class="header-link" to="/">Hello, {username}</Link></th>
                    <th><Link class="header-link" to="/profile/me">Profile</Link></th>
                    <th><Link class="header-link" to="/upload">New Post</Link></th>
                    <th><a href="#" class="header-link" onClick={handleLogout}>Log Out</a></th>
                </tr></table>
            : 
                <table class="header-table"><tr>
                    <th>Not logged in</th>
                    <th><Link class="header-link" to="/login">Login / Signup</Link></th>
                </tr></table>
            }
            <p></p>
        </div>
    )
}

export default Header;