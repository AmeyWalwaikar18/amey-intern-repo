'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { rehydratePosts, incrementLike, addComment } from '../redux/postSlice';
import { useRouter } from 'next/navigation';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';

export default function MainPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const posts = useSelector((state) => state.posts.posts);
  const [expandedComments, setExpandedComments] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect to handle dark mode based on localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Effect to save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    const updatedPosts = storedPosts.map((post) => ({
      ...post,
      comments: post.comments || [],
    }));
    dispatch(rehydratePosts(updatedPosts));
  }, [dispatch]);

  const handleLike = (postId) => {
    dispatch(incrementLike(postId));
  };

  const handleAddComment = (postId, commentText) => {
    const comment = { user: 'User', text: commentText };
    dispatch(addComment({ postId, comment }));
  };

  const toggleComments = (postId) => {
    setExpandedComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
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
        
        {/* Dark Mode Toggle Button */}
        <button
          onClick={() => setIsDarkMode((prevMode) => !prevMode)}
          className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-lg shadow"
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 rounded-lg shadow-md mb-4 dark:bg-gray-800"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {post.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{post.body}</p>

            <button
              onClick={() => handleLike(post.id)}
              className="mt-2 px-4 py-2 flex items-center bg-blue-500 text-white rounded-lg"
            >
              {post.likes > 0 ? <AiFillLike className="mr-2" /> : <AiOutlineLike className="mr-2" />}
              Like ({post.likes})
            </button>

            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Comments</h3>
              {(!post.comments || post.comments.length === 0) ? (
                <p className="text-gray-700 dark:text-gray-300">No comments yet.</p>
              ) : expandedComments[post.id] ? (
                post.comments.map((comment, idx) => (
                  <p key={idx} className="text-gray-700 dark:text-gray-300">
                    <strong>{comment.user}:</strong> {comment.text}
                  </p>
                ))
              ) : (
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>{post.comments[0].user}:</strong> {post.comments[0].text}
                </p>
              )}

              {post.comments.length > 1 && (
                <button
                  onClick={() => toggleComments(post.id)}
                  className="mt-2 text-blue-500 underline"
                >
                  {expandedComments[post.id] ? 'Show Less' : 'Show More'}
                </button>
              )}

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
