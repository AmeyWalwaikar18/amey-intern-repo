import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: localStorage.getItem("posts") ? JSON.parse(localStorage.getItem("posts")) : [],  // Store posts in an array
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Action to add a new post
    addPost: (state, action) => {
      state.posts.push(action.payload);  // Add the new post to the posts array
    },
  },
});

export const { addPost } = postsSlice.actions;  // Export the addPost action
export default postsSlice.reducer;  // Export the reducer
