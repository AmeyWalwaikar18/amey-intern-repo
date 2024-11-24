import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Post() {
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const { query } = useRouter();

  useEffect(() => {
    if (query.id) {
      const storedPosts = JSON.parse(localStorage.getItem('mockPosts')) || [];
      const foundPost = storedPosts.find((p) => p.id === parseInt(query.id, 10));
      setPost(foundPost);
    }
  }, [query.id]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = { user: 'User', text: newComment };

    // Update the post's comments locally
    const updatedPost = {
      ...post,
      comments: [...post.comments, comment],
    };
    setPost(updatedPost);

    // Update the mockPosts in localStorage
    const storedPosts = JSON.parse(localStorage.getItem('mockPosts')) || [];
    const updatedPosts = storedPosts.map((p) =>
      p.id === updatedPost.id ? updatedPost : p
    );
    localStorage.setItem('mockPosts', JSON.stringify(updatedPosts));

    // Clear the input field
    setNewComment('');
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <p><strong>Likes: {post.likes}</strong></p>

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

      {/* Add a comment form */}
      <input
        type="text"
        placeholder="Add a comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button onClick={handleAddComment}>Submit</button>
    </div>
  );
}
