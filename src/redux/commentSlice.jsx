import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    comments: localStorage.getItem("comments") ? JSON.parse(localStorage.getItem("comments")) : {}, 
    // Object to store comments keyed by postId
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // Action to add a new comment to a specific post
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      if (!state.comments[postId]) {
        state.comments[postId] = []; // Initialize comments array if it doesn't exist
      }
      state.comments[postId].push(comment); // Add the new comment to the array
    },
  },
});

export const { addComment } = commentsSlice.actions;

export default commentsSlice.reducer;
