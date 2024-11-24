import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Rehydrate posts from localStorage, ensuring each post has a comments array
    rehydratePosts: (state, action) => {
      state.posts = action.payload.map((post) => ({
        ...post,
        comments: post.comments || [], // Ensure comments is always an array
      }));
    },

    // Increment like count for a specific post
    incrementLike: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.likes += 1; // Increment likes
        localStorage.setItem('posts', JSON.stringify(state.posts)); // Save to localStorage
      }
    },

    // Add a new comment to a specific post
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.comments = post.comments || []; // Ensure comments array exists
        post.comments.push(comment); // Add the new comment
        localStorage.setItem('posts', JSON.stringify(state.posts)); // Save to localStorage
      }
    },
  },
});

export const { rehydratePosts, incrementLike, addComment } = postsSlice.actions;
export default postsSlice.reducer;
