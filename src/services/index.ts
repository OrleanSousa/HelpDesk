import api from './api';
import endpoints from './endpoints';
import type { User } from '../types';

/**
 * Serviços de autenticação
 */
export const login = (data: any) => api.post(endpoints.login, data);
export const logout = () => api.post(endpoints.logout);

/**
 * Serviços de usuários
 */
export const getUsers = () => api.get<User[]>(endpoints.users);
export const getUser = (id: number | string) => api.get<User>(endpoints.user(id));
export const createUser = (data: User) => api.post(endpoints.users, data);
export const updateUser = (id: number | string, data: Partial<User>) =>
  api.put(endpoints.user(id), data);
export const deleteUser = (id: number | string) => api.delete(endpoints.user(id));

/**
 * Serviços de chamados
 */
export const getChamados = () => api.get(endpoints.chamados);
export const getChamado = (id: number | string) => api.get(endpoints.chamado(id));
export const createChamado = (data: any) => api.post(endpoints.chamadoCreate, data);
export const updateChamado = (id: number | string, data: any) =>
  api.put(endpoints.chamadoUpdate(id), data);
export const deleteChamado = (id: number | string) =>
  api.delete(endpoints.chamadoDelete(id));
export const closeChamado = (id: number | string) =>
  api.post(endpoints.chamadoClose(id));
export const getChamadoStats = () => api.get(endpoints.chamadoStats);
export const createChamadoResponse = (data: any) =>
  api.post(endpoints.chamadoResponse, data);
/**
 * Buscar respostas de um chamado específico
 */
export const getChamadoResponses = (id: number | string) =>
  api.get(`/api/called/${id}/responses`);

/**
 * Serviços de relatórios
 */
export const getReport = () => api.get(endpoints.report, { responseType: 'blob' });

/**
 * Buscar chamados por status
 */
export const getChamadosByStatus = (status: string) =>
  api.get(endpoints.chamadosByStatus(status));
