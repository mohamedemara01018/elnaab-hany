import { configureStore } from '@reduxjs/toolkit'
import toastificationReducer from './slices/toastificationSlice'
import meReducer from './slices/auth/meSlice'
export const store = configureStore({
    reducer: {
        toastificationSlice: toastificationReducer,
        me: meReducer

    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch