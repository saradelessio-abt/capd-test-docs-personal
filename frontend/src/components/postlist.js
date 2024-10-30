import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import { format } from 'date-fns';

import "./components.css";

const PostList = () => {
    const [postList, setPostList] = useState([]);
    const [excerptList, setExcerptList] = useState([]);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://api.github.com/repos/saradelessio-abt/capd-test-docs-personal/contents/posts');
                const filesData = await response.json();
    
                const posts = await Promise.all(
                    filesData.map(async (file) => {
                        const postResponse = await fetch(file.download_url);
                        const content = await postResponse.text();
    
                        // Extract metadata and body
                        const metadataRegex = /title:\s*(.+)\nauthor:\s*(.+)\ndate:\s*(.+)\nthumbnail:\s*(.+)\n([\s\S]*)/;
                        const [, title, author, date, thumbnail, body] = content.match(metadataRegex) || [];
    
                        return { title, author, date, thumbnail, content: body };
                    })
                );
    
                setPostList(posts);
    
                // Generate excerpts
                const excerpts = posts.map(post => post.content.split(" ").slice(0, 20).join(" ") + "...");
                setExcerptList(excerpts);
    
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
    
        fetchPosts();
    }, []);
    
    

    return (
        <div>
        {postList.map((post, index) => (
            <div key={index}>
                <img src={post.thumbnail} alt="Post thumbnail" />
                <h2>{post.title}</h2>
                <p>Published on {format(new Date(post.date), "MMMM d, yyyy")} by {post.author}</p>
                <p>{excerptList[index]}</p>
            </div>
        ))}
    </div>
    );
};

export default PostList;
