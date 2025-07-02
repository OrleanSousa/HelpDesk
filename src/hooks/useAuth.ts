import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { login } from '@/store/slices/authSlice';

/**
 * Hook customizado useAuth
 * 
 * Responsável por fornecer o estado de autenticação do usuário e garantir que,
 * ao carregar a aplicação, o estado de autenticação seja restaurado do localStorage
 * (caso o usuário já tenha feito login anteriormente).
 * 
 * - Retorna o estado de autenticação (auth) do Redux.
 * - Ao montar, verifica se há dados salvos no localStorage e, se houver,
 *   faz o login automático do usuário.
 */
export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Tenta carregar o estado de autenticação do localStorage ao montar o componente
    const savedState = localStorage.getItem('authState');
    if (savedState && !auth.isAuthenticated) {
      const authData = JSON.parse(savedState);
      if (authData.isAuthenticated && authData.user) {
        dispatch(login(authData.user));
      }
    }
  }, [dispatch, auth.isAuthenticated]);

  return auth;
};

export default useAuth;