import React, {useState, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom'
import MapFrame from '../../components/MapFrame/MapFrame';
import SpeciesID from '../../components/SpeciesID/SpeciesID';
import NotFound from '../NotFound/NotFound';
import Comments from '../../components/Comment/Comment';
import { getPostById,
    toggleIncrementPostRating,
    toggleDecrementPostRating,
    hasUserLikedPost,
    hasUserDislikedPost } from '../../firebase/database';
import './Post.css'

function Post () {
    let { postid } = useParams();
    const [post, setPost] = useState(null);
    const [postFound, setPostFound] = useState(true);
    const [map, setMap] = useState(null);

    const [voteStyle, setVoteStyle] = useState({
        up: null,
        num: null,
        down: null})
    
    async function getPost () {
        const m_post = await getPostById(postid);
        if(m_post === undefined) {
            setPostFound(false);
            return;
        }
        setPost(m_post);
        // dynamic map generation is hard, so we'll do it here. 
        setMap(<MapFrame class="post-map-container" 
            setBounds={(n) => {}}
            points={[{
                position: [m_post.latitude, m_post.longitude],
            }]}
            defaultCenter={[m_post.latitude, m_post.longitude]} defaultZoom={[11]}
            small={true} 
        />)
    }

    async function getLikeInfo() {
        const m_liked = await hasUserLikedPost(postid);
        const m_disliked = await hasUserDislikedPost(postid);
        if(m_liked) {
            setVoteStyle({
                up: "post-darkbutton",
                num: "post-green",
                down: null
            });
        }
        else if(m_disliked) {
            setVoteStyle({
                up: null,
                num: "post-red",
                down: "post-darkbutton"
            });
        }
        else {
            setVoteStyle({
                up: null,
                num: null,
                down: null
            });
        }
    }
    useEffect(() => {
        getPost();
      }, []);

    useEffect(() => {
        if(post===null) {
            return;
        }
        getLikeInfo();
    }, [post])

    if(!postFound) {
        return (
            <NotFound url={'Post #' + postid} />
        );
    }
    

    return (
      <div class="post-overall">
        <p id="post-title">
            <section id="post-postvote">
                <button class={voteStyle?.up} onClick={() => {
                    toggleIncrementPostRating(postid, post.author)
                    .then((n) => {setTimeout(() => {getPost()}, 500)})
                }}>&#11014;</button>
                <span class={voteStyle?.num}>{" " + post?.rating + " "}</span>
                <button class={voteStyle?.down} onClick={() => {
                    toggleDecrementPostRating(postid, post.author)
                    .then((n) => {setTimeout(() => {getPost()}, 500)})
                }}>&#11015;</button>
            </section>
            <section id="post-postnum">{'#' + postid}</section>
            <section id="post-postname">{post?.species}</section>
            <Link id="post-postuser" to={"/profile/" + post?.author}>
                {post?.author}</Link>
            <section id="post-posttime">{post?.date}</section>
        </p>
        <p></p>
        <table class="post-top-table">
            <tr>
                <td class="post-top-td"><img id="post-image" src={post?.image} /></td>
                <td class="post-top-td"><SpeciesID postid={postid} /></td>
            </tr>
        </table>
        <p></p>
        <table class="post-bottom-table">
            <tr>
                <td class="post-bottom-td"><Comments postid={postid} /></td>
                <td class="post-bottom-td">{map}</td>
            </tr>
        </table>
      </div>  
    );
}

export default Post;