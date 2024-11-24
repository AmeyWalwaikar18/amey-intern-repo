'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { rehydratePosts } from '../redux/postSlice';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function AddPostPage() {
  const dispatch = useDispatch();
  const router = useRouter(); // Initialize router
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      id: Date.now(), // Create a unique ID based on timestamp
      title,
      body,
      likes: 0,
      comments: [],
    };

    // Get current posts from localStorage or Redux
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    const updatedPosts = [...storedPosts, newPost];
    localStorage.setItem('posts', JSON.stringify(updatedPosts));

    // Rehydrate Redux state with the updated posts
    dispatch(rehydratePosts(updatedPosts));

    setTitle('');
    setBody('');

    // Navigate back to the main page after adding the post
    router.push('/'); // Use router.push to navigate back to the homepage
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-semibold">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="body" className="block text-lg font-semibold">Body</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows="4"
            required
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Add Post
        </button>
      </form>
    </div>
  );
}
