import React from 'react';
import './PostList.css';

function PostList(props) {
    if(!props.list || props.list?.length === 0) {
        return (
            <p class="postlist-centermsg">No posts for this area... yet &#128532;</p>
        )
    }
    return (
        <div class="postlist-overall">
            {props.list.map((post, i) => {
                return (
                    <div class="postlist-pad">
                    <table class="postlist-entry" onClick={() => {props.listClick(i)}}>
                        <tr>
                            <td class="postlist-td">
                                <p class="postlist-title">{post?.title + post?.species}</p>
                                <p class="postlist-subtitle">{"by " + post?.author + " on " + (post?.date ?? "unknown date")}</p>
                            </td>
                            <td class="postlist-td">
                                <img src={post.image} class="postlist-image" />
                            </td>
                        </tr>
                    </table>
                    </div>
                );
            })}
            
        </div>
    );
}

export default PostList;