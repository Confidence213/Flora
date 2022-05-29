import React from 'react';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import { getCommentsByPost, 
  Comment,
  addCommentToPost,
incrementCommentRating,
decrementCommentRating} from '../../firebase/database';

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

class Comments extends React.Component {
    constructor(props) {
      super(props);
      this.state = {comment: '', isSubmitted: false, list: null, setList: null};

    
 

    async function getList() {
        const m_list = await getCommentsByPost(props.postid);
        console.log(Array.from(m_list.values()));
        if(m_list === undefined) {
            this.setState({list: null})
        }
        else {
            this.setState({list: (Array.from(m_list.values()))});
        }
    }

      this.state = getList();

      this.handleChange = this.handleChange.bind(this);
      this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    }
  
    handleChange(event) {
      const name = event.target.name
      this.setState({[name]: event.target.value});
    }
  
    handleCommentSubmit(event) {
      this.setState({isSubmitted: true});
      event.preventDefault();
    }
    
render ()
{
    return (
        <div>
            <div className="title" style={{textAlign: "left"}}>Comments</div>
              {this.state.isSubmitted ? <div>{this.state.comment}</div> :
              <div className="form">
                <form onSubmit={this.handleCommentSubmit}>
                    <div className="input-container">
                        <label></label>
                        <input class="comment-input" name="comment" type="text" value={this.state.comment} onChange={this.handleChange} required/>
                    </div>
                    <div className="button-container">
                      <input class="comment-input" type="submit" />
                    </div>
                </form>
              </div>
            }
            <div>
              {this.state.list?.map((comment) => {
                return ( <span><h4 style={{textAlign:"auto"}}>{comment.user + " " + comment.time}</h4>
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
    )

}
    
}

export default Comments;