import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";

import "./components.css";

const PostList = () => {
    const [postList, setPostList] = useState([]);
    const [excerptList, setExcerptList] = useState([]);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetch metadata for each file in the posts folder
                const response = await fetch('https://api.github.com/repos/saradelessio-abt/capd-test-docs-personal/contents/posts');
                const filesData = await response.json();
    
                const posts = await Promise.all(
                    filesData.map(async (file) => {
                        // Fetch each file's content from its download_url
                        const postResponse = await fetch(file.download_url);
                        const content = await postResponse.text(); // Use .text() for Markdown files
                        return { content };
                    })
                );
    
                setPostList(posts);
    
                // Generate excerpts for each post
                const excerpts = posts.map(post => post.content.split(" ").slice(0, 20).join(" ") + "...");
                setExcerptList(excerpts);
    
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
    
        fetchPosts();
    }, []);
    

    return (
        <div className="postlist">
            <h1 className="title">All Posts</h1>
            {postList.length > 0 && 
                postList.map((post, i) => (
                    <div key={i} className="post-card">
                         <div className="img-container">
                            {post.thumbnail && <img className="thumbnail" width={80} src={post.thumbnail} alt=""/> }
                            <h2 className="post-title"><Link className="links" to={`/post/${post.id}`}>{post.title}</Link></h2>
                        </div>
                        <small>Published on {post.date} by {post.author}</small>
                        <hr/>
                        <Markdown>{excerptList[i]}</Markdown>
                        <small><Link className="links" to={`/post/${post.id}`}>Read more</Link></small>
                    </div>
                ))
            }
        </div>
    );
};

export default PostList;
