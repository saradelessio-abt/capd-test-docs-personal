import React from "react";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import postlist from "../posts.json"; 

import "./components.css";

const PostList = () => {
    return (
        <div className="postlist">
            <h1 className="title">All Posts</h1>
            {postlist.length > 0 ? ( // Check if there are posts
                postlist.map((post) => {
                    const excerpt = post.content.split(" ").slice(0, 20).join(" ") + "..."; 
                    return (
                        <div key={post.id} className="post-card"> 
                            <div className="img-container">
                                {post.thumbnail && <img className="thumbnail" width={80} src={post.thumbnail} alt="" />}
                                <h2 className="post-title">
                                    <Link className="links" to={`/post/${post.id}`}>{post.title}</Link>
                                </h2>
                            </div>
                            <small>Published on {post.date} by {post.author}</small>
                            <hr />
                            <Markdown>{excerpt}</Markdown> 
                            <small><Link className="links" to={`/post/${post.id}`}>Read more</Link></small>
                        </div>
                    );
                })
            ) : (
                <p>No posts available.</p> 
            )}
        </div>
    );
}

export default PostList;
