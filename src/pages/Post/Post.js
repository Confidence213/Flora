import React from 'react';
import { useParams } from 'react-router-dom'
import SpeciesID from '../../components/SpeciesID/SpeciesID';
import NotFound from '../NotFound/NotFound';
import './Post.css'

function Post () {
    let { postid } = useParams();
    // change me
    if(postid === "invalid") {
        return (
            <NotFound url={'Post #' + postid} />
        );
    }
    let postName = "a bird maybe";
    let postTime = "5/3/22 10:41 AM";
    return (
      <div class="post-overall">
        <p id="post-title">
            <section id="post-postnum">{'#' + postid}</section>
            <section id="post-postname">{postName}</section>
            <section id="post-posttime">{postTime}</section>
        </p>
        <p></p>
        <table class="post-top-table">
            <tr>
                <td class="post-top-td"><img id="post-image" src="https://i.imgur.com/1cbbKOF.jpeg" /></td>
                <td class="post-top-td"><SpeciesID postid={postid} /></td>
            </tr>
        </table>
        <p></p>
        <table class="post-bottom-table">
            <tr>
                <td class="post-bottom-td">Comment frame go here</td>
                <td class="post-bottom-td"><img class="post-map-container" src="https://i.imgur.com/SLWHOjq.png" /></td>
            </tr>
        </table>
      </div>  
    );
}

export default Post;