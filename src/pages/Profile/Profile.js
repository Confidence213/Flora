import React,{useState, useEffect} from 'react'
import { getUsername } from '../../firebase/account';
import { getPostsByUsername, getUserProfileStatistics} from '../../firebase/database';
import { useParams, useNavigate } from 'react-router-dom';
import PostList from '../../components/PostList/PostList';
import commentbadge from './comment-dots-solid.svg';
import likebadge from './medal-solid.svg';
import identificationbadge from './magnifying-glass-solid.svg';
import userProfile from './user-solid.svg';

const Profile = ()=>{
  let { userid } = useParams();
  const [username, setUsername] = useState(null);
  const [profile, setProfile] = useState(null);
  const [curPosts, setPosts] = useState(null);

  const [hoverText, setHoverText] = useState("");
  async function getUserInfo() {
        const m_username = await getUsername();
        setUsername(m_username);
    }
  async function getProfileInfo() {
        const m_profile = await getUserProfileStatistics(username);
        setProfile(m_profile);
    }
  
  async function getUserPosts() {
        const m_posts = await getPostsByUsername(username);
        setPosts(Array.from(m_posts.values()));
  }

  useEffect(() => {
        if(userid === "me") {
          getUserInfo();
        }
        else {
          setUsername(userid)
        }
  }, [userid]);

  useEffect(() => {
        if(username !== null) {
          //fetch profile with(username);
          getProfileInfo();
          getUserPosts();
        }
  }, [username]);

  const navigate = useNavigate();
  function handleListClick(i) {
      navigate("/post/" + curPosts[i]?.id);
  }

  function generateBadges() {
    let finalarr = [];
    if(profile?.totalSpeciesIdentifications > 2) {
      finalarr.push(<img title="total species identifications" 
      onMouseOver={()=>{setHoverText("User exceeds 2 species guesses")}} 
      onMouseOut={()=>{setHoverText("")}}
      alt="total species identifications" src={commentbadge}/>);
    }
    if(profile?.totalPostRating > 2) {
      finalarr.push(<img title="total post rating" 
      onMouseOver={()=>{setHoverText("Post karma exceeds 2 votes")}} 
      onMouseOut={()=>{setHoverText("")}}
      alt="total post rating" src={likebadge}/>);
    }
    if(profile?.totalSpeciesIdentificationRating > 2) {
      finalarr.push(<img title="total species identification rating" 
      onMouseOver={()=>{setHoverText("Species ID karma exceeds 2 votes")}} 
      onMouseOut={()=>{setHoverText("")}}
      alt="total species identification rating" src={identificationbadge}/>);
    }
    const listItems = finalarr.map(
      (item) => {
          return (
          <td> 
            &#12288;&#12288;{item}&#12288;&#12288;
          </td>)
        })
      return (
        <table>
          <tr>
          {finalarr.length > 0 ? listItems : "Badge shelf is empty :("}
          </tr>
        </table>
      )
    }

  let creationDate = profile?.accountCreationDate;
  let numberPosts = profile?.totalPosts + ' Posts'
  let badges = generateBadges();

  
  return (
    <table style={{margin:"25px 100px"}}> <tr>
    <th style={{ border:"1px solid grey", width:"22vw"}}>
      <div>
        <div style={{
          justifyContent:"space around",
          margin:"50px 100px",
          }}>
          <div>
            <img style={{width:"160px", height: "160px"}}
              src={userProfile}
              alt="profile avatar"/> 
            </div>
            <div>
              <h1 style={{textAlign:"center"}}>{username}</h1>
              <h4 style={{textAlign:"center"}}>{numberPosts}</h4>
              <h4 style={{textAlign:"center"}}>Account Created: {creationDate}</h4>
            </div>
            <div>
              {badges}
              <p>{hoverText ? hoverText : 
               <span style={{fontStyle:"italic"}}>(Hover over badges for details)</span>}</p>
            </div>
          </div>
        </div>
      </th>
      <th style={{ border:"1px solid grey" }}>
        <PostList list={curPosts} listClick={handleListClick}/>
      </th>
    </tr></table>
  )
}

export default Profile;

