import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Carrega o estado inicial do localStorage
const loadInitialState = (): AuthState => {
  try {
    const saved = localStorage.getItem('authState');
    if (saved) return JSON.parse(saved);
  } catch {}
  return { isAuthenticated: false, user: null, token: null };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User, token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Salva no localStorage
      localStorage.setItem('authState', JSON.stringify({
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      }));
    },
    logout: (state) => {
      // Salva nome e foto do último usuário no localStorage
      if (state.user) {
        localStorage.setItem('lastUserNome', state.user.name || 'Usuário');
        localStorage.setItem('lastUserFoto', state.user.foto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png');
      }
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      // Remove do localStorage
      localStorage.removeItem('authState');
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('authState', JSON.stringify({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          token: state.token,
        }));
      }
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer; 