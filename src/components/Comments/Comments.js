import React from 'react';
import { Link } from 'react-router-dom'
import './Comments.css'



class Comments extends React.Component {
    constructor(props) {
      super(props);
      this.state = {comment: '', isSubmitted: false};
      let comments = [
        { 
             text: "i love this picture",
             user: "foo",
             time: <unix timestamp></unix>
         },
        { 
             text: "mee too",
             user: "bar",
             time: <unix timestamp></unix>
         },
    ]
  
  
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
            <h4 style={{textAlign:"left"}}>{comments[1][user] + " " + comments[1][time]}</h4>
            <h3 style={{textAlign:"left"}}>{comments[1][text]}</h3>
            <h4 style={{textAlign:"left"}}>{comments[2][user] + " " + comments[2][time]}</h4>
            <h3 style={{textAlign:"left"}}>{comments[2][text]}</h3>
            </div>
        </div>
    )

}
    
}

export default Comments;