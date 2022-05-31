import React,{useState, getProfile, useEffect} from 'react'
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
  }, []);

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
    console.log(profile?.totalCommentRating + " + " + profile?.totalPostRating + " + " + profile?.totalSpeciesIdentificationRating)
    if(profile?.totalCommentRating > 0) {
      finalarr.push(<img title="total comment rating" alt="total comment rating" src={commentbadge}/>);
    }
    if(profile?.totalPostRating > 1) {
      finalarr.push(<img title="total post rating" alt="total post rating" src={likebadge}/>);
    }
    if(profile?.totalSpeciesIdentificationRating > 0) {
      finalarr.push(<img title="total species identification rating" alt="total species identification rating" src={identificationbadge}/>);
    }
    console.log(finalarr.length)
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
          {listItems}
          </tr>
        </table>
      )
    }

  let creationDate = profile?.accountCreationDate;
  let numberPosts = profile?.totalPosts + ' Posts'
  let badges = generateBadges();

  
  return (
    <table style={{margin:"25px 100px"}}> <tr>
    <th style={{ border:"1px solid grey"}}>
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

