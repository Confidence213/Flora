import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'
import MapFrame from '../../components/MapFrame/MapFrame';
import SpeciesID from '../../components/SpeciesID/SpeciesID';
import NotFound from '../NotFound/NotFound';
import { getPostById,
    toggleIncrementPostRating,
    toggleDecrementPostRating } from '../../firebase/database';
import './Post.css'

function Post () {
    let { postid } = useParams();
    const [post, setPost] = useState(null);
    const [postFound, setPostFound] = useState(true);
    const [map, setMap] = useState(null);
    
    async function getPost () {
        const m_post = await getPostById(postid);
        console.log(m_post);
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
    useEffect(() => {
        getPost();
      }, []);

    if(!postFound) {
        return (
            <NotFound url={'Post #' + postid} />
        );
    }
    

    return (
      <div class="post-overall">
        <p id="post-title">
            <section id="post-postvote">
                <button onClick={() => {
                    toggleIncrementPostRating(postid, post.author)
                    .then((n) => {setTimeout(() => {getPost()}, 500)})
                }}>&#11014;</button>
                {" " + post?.rating + " "}
                <button onClick={() => {
                    toggleDecrementPostRating(postid)
                    .then((n) => {setTimeout(() => {getPost()}, 500)})
                }}>&#11015;</button>
            </section>
            <section id="post-postnum">{'#' + postid}</section>
            <section id="post-postname">{post?.title}</section>
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
                <td class="post-bottom-td">Comment frame go here</td>
                <td class="post-bottom-td">{map}</td>
            </tr>
        </table>
      </div>  
    );
}

export default Post;