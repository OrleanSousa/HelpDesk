/**
 * Mapeamento centralizado dos endpoints da API.
 * Utilize este objeto para garantir padronização e facilitar manutenção das rotas.
 */
const endpoints = {
  // Autenticação
  login: '/api/login',
  logout: '/api/logout',

  // Usuários
  users: '/api/users',
  user: (id: number | string) => `/api/users/${id}`,

  // Chamados
  chamados: '/api/called',
  chamado: (id: number | string) => `/api/called/${id}`,
  chamadoCreate: '/api/called/create',
  chamadoUpdate: (id: number | string) => `/api/called/${id}`,
  chamadoDelete: (id: number | string) => `/api/called/${id}`,
  chamadoClose: (id: number | string) => `/api/called/${id}/close`,
  chamadoStats: '/api/called/stats',
  chamadoResponse: '/api/called/response',

  // Relatórios
  report: '/api/report',

  // Chamados por status
  chamadosByStatus: (status: string) => `/api/${status}`,
};

export default endpoints;