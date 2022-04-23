import React from 'react';

function Header () {
    let username = "foo";
    let signedIn = false;
    return (
        <div>
            <h2><a href="example.com/home">FloraFauna</a></h2>
            {signedIn ?
                <div>
                    "Hello " {username}
                    <a href="example.com/profile">Profile</a>
                    <a href="example.com/newpost">New Post</a>
                    <a href="example.com/logout">Log Out</a>
                </div>
            : 
                <div>
                    "Not logged in"
                    <a href="example.com/signin">New Post</a>
                    <a href="example.com/signin">Sign In</a>
                </div>
            }
        </div>
    )
}