'use client'; // Mark this as a client-side component

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Use this for dynamic routing in App Router
import { SlLike } from 'react-icons/sl'; // Use the same like icon as in MainPage

export default function PostPage() {
  const { id } = useParams(); // Get the dynamic route parameter (id)
  const [post, setPost] = useState(null);
  const [showMore, setShowMore] = useState(false); // Track "Show More" state for comments

  useEffect(() => {
    if (id) {
      // Fetch the post from localStorage based on the id
      const storedPosts = JSON.parse(localStorage.getItem('mockPosts')) || [];
      const selectedPost = storedPosts.find((post) => post.id === parseInt(id)); // Assuming post.id is an integer
      setPost(selectedPost || null); // Set post or null if not found
    }
  }, [id]);

  // Handle "Show More" and "Show Less" toggling
  const handleShowMoreToggle = () => {
    setShowMore((prev) => !prev);
  };

  // Handle likes increment
  const handleLike = () => {
    const updatedPost = { ...post, likes: post.likes + 1 };
    setPost(updatedPost);

    // Update likes in localStorage
    const storedPosts = JSON.parse(localStorage.getItem('mockPosts')) || [];
    const updatedPosts = storedPosts.map((p) =>
      p.id === post.id ? updatedPost : p
    );
    localStorage.setItem('mockPosts', JSON.stringify(updatedPosts));
  };

  // Handle case when the post is not found
  if (!post) {
    return <h1 className="text-center text-2xl font-bold text-red-500">Post Not Found</h1>;
  }

  return (
    <div className="post-page max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      {/* Post Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">{post.title}</h1>

      {/* Post Body */}
      <p className="text-gray-700 text-lg mb-8">{post.body}</p>

      {/* Post Likes */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={handleLike}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:w-fit sm:w-fit md:w-fit flex items-center space-x-2"
        >
          <SlLike />
          <span>Like</span>
        </button>
        <p className="text-lg font-semibold text-blue-600">Likes: {post.likes}</p>
      </div>

      {/* Comments Section */}
      <h3 className="text-2xl font-medium text-gray-800 mb-4">Comments:</h3>

      <ul className="space-y-4 mb-6">
        {(post.comments || []).length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          <>
            {/* Show the first comment and toggle between "Show More" and "Show Less" */}
            {(showMore ? post.comments : post.comments.slice(0, 1)).map((comment, index) => (
              <li key={index} className="text-md text-gray-700 bg-gray-100 p-4 rounded-lg shadow">
                <strong>{comment.user}:</strong> {comment.text}
              </li>
            ))}
            {post.comments.length > 1 && (
              <button
                onClick={handleShowMoreToggle}
                className="text-blue-500 text-sm font-semibold hover:underline"
              >
                {showMore ? 'Show Less' : `Show More (${post.comments.length - 1} more)`}
              </button>
            )}
          </>
        )}
      </ul>
    </div>
  );
}
