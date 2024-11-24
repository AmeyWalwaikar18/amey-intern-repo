'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { rehydratePosts, incrementLike, addComment } from '../redux/postSlice';
import { useRouter } from 'next/navigation';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'; // Import like icons

export default function MainPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const posts = useSelector((state) => state.posts.posts);
  const [expandedComments, setExpandedComments] = useState({}); // Track expanded comments per post

  useEffect(() => {
    // Rehydrate posts from localStorage initially
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];

    // Ensure comments are always initialized as an empty array if missing
    const updatedPosts = storedPosts.map((post) => ({
      ...post,
      comments: post.comments || [], // Make sure comments is an array
    }));
    
    dispatch(rehydratePosts(updatedPosts));
  }, [dispatch]);

  const handleLike = (postId) => {
    dispatch(incrementLike(postId));

    // Update localStorage with the new likes count
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const updatedPost = { ...post, likes: post.likes + 1 }; // Increment the like count for the specific post
        return updatedPost;
      }
      return post;
    });

    localStorage.setItem('posts', JSON.stringify(updatedPosts)); // Save to localStorage
  };

  const handleAddComment = (postId, commentText) => {
    const comment = { user: 'User', text: commentText };

    // Dispatch the addComment action
    dispatch(addComment({ postId, comment }));

    // Update localStorage with the new comment
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        post.comments = post.comments || []; // Ensure comments is always an array
        return { ...post, comments: [...post.comments, comment] };
      }
      return post;
    });
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const toggleComments = (postId) => {
    setExpandedComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId], // Toggle the expanded state
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">All Posts</h1>
        <button
          onClick={() => router.push('/api/posts/add')}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow"
        >
          Create Post
        </button>
      </div>

      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p>{post.body}</p>

            {/* Like Button with Icon */}
            <button
              onClick={() => handleLike(post.id)}
              className="mt-2 px-4 py-2 flex items-center bg-blue-500 text-white rounded-lg"
            >
              {/* Like Icon */}
              {post.likes > 0 ? <AiFillLike className="mr-2" /> : <AiOutlineLike className="mr-2" />}
              Like ({post.likes})
            </button>

            <div className="mt-4">
              <h3 className="text-lg font-medium">Comments</h3>
              {(!post.comments || post.comments.length === 0) ? (
                <p>No comments yet.</p>
              ) : expandedComments[post.id] ? (
                // Show all comments if expanded
                post.comments.map((comment, idx) => (
                  <p key={idx}>
                    <strong>{comment.user}:</strong> {comment.text}
                  </p>
                ))
              ) : (
                // Show only the first comment if not expanded
                <p>
                  <strong>{post.comments[0].user}:</strong> {post.comments[0].text}
                </p>
              )}

              {/* Show More / Show Less Button */}
              {post.comments.length > 1 && (
                <button
                  onClick={() => toggleComments(post.id)}
                  className="mt-2 text-blue-500 underline"
                >
                  {expandedComments[post.id] ? 'Show Less' : 'Show More'}
                </button>
              )}

              {/* Add Comment Input */}
              <input
                type="text"
                placeholder="Add a comment"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    handleAddComment(post.id, e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full mt-2 px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
