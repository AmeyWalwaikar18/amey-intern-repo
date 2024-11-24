import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import { combineReducers } from 'redux';

// Import your reducers
import postsReducer from './postSlice';
import commentsReducer from './commentSlice';

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['posts', 'comments'], // Only persist the 'posts' and 'comments' reducers
};

// Combine your reducers (if you have more than one)
const rootReducer = combineReducers({
  posts: postsReducer,
  comments: commentsReducer, // Include other slices if needed
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create the persistor
export const persistor = persistStore(store);
