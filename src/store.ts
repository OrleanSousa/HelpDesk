import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import authReducer from './store/slices/authSlice'
import chamadoReducer from './features/chamadoSlice'


export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    chamado: chamadoReducer,
  },
})

// Inferindo os tipos do RootState e AppDispatch da própria store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
