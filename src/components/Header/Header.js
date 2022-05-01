import React from 'react';
import './Header.css'

function Header () {
    let username = "foo";
    let signedIn = true;
    return (
        <div>
            <h2><a href="example.com/home">FloraFauna</a></h2>
            {signedIn ?
                <table><tr>
                    <th>Hello,  {username}</th>
                    <th><a href="example.com/profile">Profile</a></th>
                    <th><a href="example.com/newpost">New Post</a></th>
                    <th><a href="example.com/logout">Log Out</a></th>
                </tr></table>
            : 
                <table><tr>
                    <th>Not logged in</th>
                    <th><a href="example.com/signin">New Post</a></th>
                    <th><a href="example.com/signin">Sign In</a></th>
                </tr></table>
            }
        </div>
    )
}

export default Header;