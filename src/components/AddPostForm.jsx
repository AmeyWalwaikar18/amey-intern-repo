'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { rehydratePosts } from '../redux/postSlice';

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [comments, setComments] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Retrieve existing posts from localStorage
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];

    // Create a new post object
    const newPost = {
      id: storedPosts.length + 1,
      title,
      body,
      likes: 0,
      comments: comments
        ? comments.split('\n').map((comment) => ({ user: 'User', text: comment }))
        : [],
    };

    // Update localStorage
    const updatedPosts = [...storedPosts, newPost];
    localStorage.setItem('posts', JSON.stringify(updatedPosts));

    // Dispatch rehydration to update Redux store
    dispatch(rehydratePosts(updatedPosts));

    // Redirect to the main page
    router.push('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="body">
            Body
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows="4"
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="comments">
            Comments (Optional)
          </label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows="3"
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
