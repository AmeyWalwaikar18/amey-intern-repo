// list of all the posts are in here
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [newComments, setNewComments] = useState({}); // Holds new comment inputs for each post

  useEffect(() => {
    // Fetch posts from API when the component mounts
    fetch('/api/posts')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  const handleAddComment = async (postId) => {
    const commentText = newComments[postId];
    if (!commentText) return;

    const newComment = { user: 'User', text: commentText };

    try {
      // Add the new comment via the API
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });

      const updatedComments = await response.json();

      // Update the post's comments locally
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments: updatedComments } : post
        )
      );

      // Clear the comment input for this post
      setNewComments((prev) => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCommentInputChange = (postId, value) => {
    setNewComments((prev) => ({ ...prev, [postId]: value }));
  };

  return (
    <div>
      <h1>All Posts</h1>
      <ul>
        {posts.length === 0 ? (
          <p>No posts available. Please create a post!</p>
        ) : (
          posts.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}>
                <a>{post.title}</a>
              </Link>
              <p>Likes: {post.likes}</p>
              <h3>Comments:</h3>
              <ul>
                {post.comments.length === 0 ? (
                  <p>No comments yet. Be the first to comment!</p>
                ) : (
                  post.comments.map((comment, index) => (
                    <li key={index}>
                      <strong>{comment.user}:</strong> {comment.text}
                    </li>
                  ))
                )}
              </ul>
              <div>
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={newComments[post.id] || ''}
                  onChange={(e) =>
                    handleCommentInputChange(post.id, e.target.value)
                  }
                />
                <button onClick={() => handleAddComment(post.id)}>Submit</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
