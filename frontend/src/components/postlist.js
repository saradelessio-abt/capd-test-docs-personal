import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import { format } from "date-fns";
import "./components.css";

const PostList = () => {
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/saradelessio-abt/capd-test-docs-personal/contents/posts"
        );
        const data = await response.json();

        console.log(data);

        // Fetch actual content from each post's download_url
        const posts = await Promise.all(
          data.map(async (post) => {
            const postsResponse = await fetch(post.download_url);
            const postContent = await postsResponse.text();
            return parseMarkdown(postContent);
          })
        );

        setPostList(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Function to parse Markdown content
  const parseMarkdown = (markdown) => {
    const metaRegex = /---\n([\s\S]*?)---/;
    const match = markdown.match(metaRegex);
    let metadata = {};
    let body = markdown;

    if (match) {
      const metaString = match[1];
      body = markdown.replace(metaRegex, "").trim();

      // Extract metadata key-value pairs
      metaString.split("\n").forEach((line) => {
        const [key, ...value] = line.split(":");
        if (key && value) {
          metadata[key.trim()] = value.join(":").trim();
        }
      });
    }

    return { ...metadata, body };
  };

  return (
    <div>
      {postList.map((post, index) => (
        <div key={index}>
          <img
            height={100}
            width={100}
            src={`${process.env.PUBLIC_URL}${post.thumbnail}`} 
            alt="Thumbnail"
          />
          <h2>{post.title}</h2>
          <p>
            Published on {format(new Date(post.date), "MMMM d, yyyy")} by{" "}
            {post.author}
          </p>
          <Markdown>{post.body}</Markdown>
        </div>
      ))}
    </div>
  );
};

export default PostList;
