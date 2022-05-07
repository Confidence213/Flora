import React from 'react';

function NotFound (props) {
    return (
        <div>
            <p>Oops! We can't find the page you're looking for. Error code: 404 </p>
            <p>Page requested: "<it>{props.url}</it>"</p>
        </div>
    );
}

export default NotFound;