import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import './Comment.css';
import { getCommentsByPost, 
  Comment,
  addCommentToPost } from '../../firebase/database';
import { getUsername } from '../../firebase/account';

 
/* pull this from the server, so that we aren't relying on it being hardcoded*/
{/*let comments = [
  { 
       text: "i love this picture",
       user: "foo",
       time: new Date().toISOString()
   },
  { 
       text: "mee too",
       user: "bar",
       time: new Date().toISOString()
   },
]*/}
 

 
 
//let commentsArr = Array.from(comments.keys())
 
function Comments(props) {
  const [list, setList] = useState(null)
  const [commentString, setCommentString] = useState("");
  const [currentComment, setCurrentComment] = useState("");

  const [username, setUsername] = useState(null)
 
    async function getList() {
        const m_list = await getCommentsByPost(props.postid);
        if(m_list === undefined) {
            setList(null)
        }
        else {
            setList(Array.from(m_list.values()));
        }
    }

    async function getUserInfo() {
      const m_username = await getUsername();
      setUsername(m_username);
  }

    useEffect(() => {
        getList();
        getUserInfo();
    }, [])
 
 /*
    handleChange(e) {
      setCommentString(event.target.value);
    }
 
    handleCommentSubmit(e) {
      setIsSubmitted(true);
      e.preventDefault();
    }*/
 

    return (
        <div style={{height: "55vh", overflowY: "auto"}}>
            <div className="title" style={{textAlign: "left"}}>Comments</div>
              <div className="form">
                <form onSubmit={(e) => {
                  if(!username) {
                    alert("You're not signed in! Sign in to add a comment.");
                    return;
                  }
                  const cm = new Comment(currentComment, username, new Date().toISOString());
                  addCommentToPost(cm, props.postid)
                  .then(() => {
                    setTimeout(() => {getList()}, 500)
                  })
                  setCurrentComment("");
                  setCommentString("");
                  e.preventDefault();
                }} onChange={e => setCurrentComment(e.target.value)}>
                    <div className="input-container">
                        <label></label>
                        <input class="comment-input" name="comment" type="text" value={commentString} onChange={(e) =>  {setCommentString(e.target.value);}} required/>
                    </div>
                    <div className="button-container">
                      <input class="comment-input" type="submit" />
                    </div>
                </form>
              </div>
            <div>
              {list?.map((comment) => {
                return ( <span><h4 style={{textAlign:"auto"}}>{comment.author + " " + comment.date}</h4>
                   <p style={{textAlign:"auto"}}>{comment.text}</p>
                </span>)
              })}
              {/*
            <h4 style={{textAlign:"auto"}}>{"foo " + <unix timestamp></unix>}</h4>
            <p style={{textAlign:"auto"}}>{"i love this picture"}</p>
            <h4 style={{textAlign:"auto"}}>{"bar " + <unix timestamp></unix>}</h4>
            <p style={{textAlign:"auto"}}>{"mee too"}</p>*/}
            </div>
 
        </div>
    );
 
}

 
export default Comments;