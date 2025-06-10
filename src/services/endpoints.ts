const endpoints = {
  login: '/api/login',
  logout: '/api/logout',
  users: '/api/users',
  user: (id: number | string) => `/api/users/${id}`,
  chamados: '/api/called',
  chamado: (id: number | string) => `/api/called/${id}`,
  chamadoCreate: '/api/called/create',
  chamadoUpdate: (id: number | string) => `/api/called/${id}`,
  chamadoDelete: (id: number | string) => `/api/called/${id}`,
  chamadoClose: (id: number | string) => `/api/called/${id}/close`,
  chamadoStats: '/api/called/stats',
  chamadoResponse: '/api/called/response',
  report: '/api/report',
  chamadosByStatus: (status: string) => `/api/${status}`,
};

export default endpoints; 