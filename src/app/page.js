'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { SlLike } from 'react-icons/sl';

export default function MainPage() {
  const [posts, setPosts] = useState([]);
  const reduxPosts = useSelector((state) => state.posts.posts);
  const [newComments, setNewComments] = useState({});
  const [showMore, setShowMore] = useState({}); // Track the show more state for each post

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('mockPosts')) || [];
    setPosts(storedPosts);
  }, [reduxPosts]);

  // Dark mode toggle handler
  const handleDarkModeToggle = () => {
    // Toggle the 'dark' class on the <html> element
    const isDarkMode = document.documentElement.classList.contains('dark');
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // Check and apply the user's theme preference from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleLike = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('mockPosts', JSON.stringify(updatedPosts));
  };

  const handleAddComment = (postId) => {
    const commentText = newComments[postId];
    if (!commentText) return;

    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: [...(post.comments || []), { user: 'User', text: commentText }],
          }
        : post
    );

    setPosts(updatedPosts);
    localStorage.setItem('mockPosts', JSON.stringify(updatedPosts));
    setNewComments((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleCommentInputChange = (postId, value) => {
    setNewComments((prev) => ({ ...prev, [postId]: value }));
  };

  const handleShowMore = (postId) => {
    setShowMore((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="main-page max-w-4xl mx-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center sm:text-3xl md:text-4xl lg:text-4xl dark:text-white">
        Welcome to the Post Management App
      </h1>
      <p className="text-center text-blue-400 text-[20px] font-semibold dark:text-gray-300">Below is the list of all posts:</p>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={handleDarkModeToggle}
        className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-full dark:bg-gray-200 dark:text-black"
      >
        Toggle Dark Mode
      </button>

      {posts.length === 0 ? (
        <p className="text-center text-xl sm:text-base dark:text-gray-300">No posts available.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li
              key={post.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 mb-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 text-[16px] mb-4">{post.body}</p>
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:w-fit sm:w-fit md:w-fit"
                >
                  <SlLike />
                </button>
                <strong className="text-lg sm:text-base dark:text-gray-100">Likes: {post.likes}</strong>
              </div>

              <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">Comments:</h3>
              <ul className="space-y-2 mb-4">
                {(post.comments || []).length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                ) : (
                  <>
                    {/* Show only the first comment initially */}
                    {post.comments.slice(0, 1).map((comment, index) => (
                      <li key={index} className="text-md text-gray-600 dark:text-gray-300">
                        <strong>{comment.user}:</strong> {comment.text}
                      </li>
                    ))}

                    {/* "Show More" and "Show Less" functionality */}
                    {post.comments.length > 1 && !showMore[post.id] && (
                      <button
                        onClick={() => handleShowMore(post.id)}
                        className="text-sm text-blue-500 hover:underline dark:text-blue-400"
                      >
                        Show More
                      </button>
                    )}
                    {showMore[post.id] && (
                      <>
                        {post.comments.slice(1).map((comment, index) => (
                          <li key={index + 1} className="text-sm text-gray-600 dark:text-gray-300">
                            <strong>{comment.user}:</strong> {comment.text}
                          </li>
                        ))}
                        <button
                          onClick={() => handleShowMore(post.id)}
                          className="text-sm text-blue-500 hover:underline dark:text-blue-400"
                        >
                          Show Less
                        </button>
                      </>
                    )}
                  </>
                )}
              </ul>

              <div>
                <div className="flex flex-col space-y-4">
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={newComments[post.id] || ''}
                    onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-full"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="self-start px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-auto"
                  >
                    Submit
                  </button>
                </div>

                <div className="mt-4">
                  <Link href={`/api/posts/${post.id}`}>
                    <button className="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 sm:w-full md:w-auto">
                      View Post
                    </button>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 text-center">
        <Link href="/api/posts/add">
          <button className="px-8 py-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:w-full md:w-auto">
            Add New Post
          </button>
        </Link>
      </div>
    </div>
  );
}
