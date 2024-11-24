import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    rehydratePosts: (state, action) => {
      state.posts = action.payload;
    },
    incrementLike: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) post.likes += 1;
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) post.comments.push(comment);
    },
  },
});

export const { rehydratePosts, incrementLike, addComment } = postsSlice.actions;
export default postsSlice.reducer;
