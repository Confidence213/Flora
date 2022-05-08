import React from 'react';
import { Link } from 'react-router-dom'
import './Header.css'

function Header () {
    let username = "foo";
    let signedIn = true;
    return (
        <div class="header-center">
            <h2><Link class="header-link" to="/">FloraFauna</Link></h2>
            {signedIn ?
                <table class="header-table"><tr>
                    <th><Link class="header-link" to="/">Hello, {username}</Link></th>
                    <th><Link class="header-link" to="/profile/me">Profile</Link></th>
                    <th><Link class="header-link" to="/upload">New Post</Link></th>
                    <th><a class="header-link" href="example.com/logout">Log Out</a></th>
                </tr></table>
            : 
                <table class="header-table"><tr>
                    <th>Not logged in</th>
                    <th><Link class="header-link" to="/login">New Post</Link></th>
                    <th><Link class="header-link" to="/login">Sign In</Link></th>
                </tr></table>
            }
        </div>
    )
}

export default Header;