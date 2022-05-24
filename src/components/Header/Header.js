import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'
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
    
    return (
        <div class="header-center">
            <h2><Link class="header-link" to="/">FloraFauna</Link></h2>
            {signedIn ?
                <table class="header-table"><tr>
                    <th>Hello, {username}</th>
                    <th><Link class="header-link" to="/profile/me">Profile</Link></th>
                    <th><Link class="header-link" to="/upload">New Post</Link></th>
                    <th><a class="header-link" href="example.com/logout">Log Out</a></th>
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