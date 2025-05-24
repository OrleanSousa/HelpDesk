import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

// Carrega o estado inicial do localStorage
const loadInitialState = (): AuthState => {
  try {
    const saved = localStorage.getItem('authState');
    if (saved) return JSON.parse(saved);
  } catch {}
  return { isAuthenticated: false, user: null };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      // Salva no localStorage
      localStorage.setItem('authState', JSON.stringify({
        isAuthenticated: true,
        user: action.payload
      }));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Remove do localStorage
      localStorage.removeItem('authState');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer; 