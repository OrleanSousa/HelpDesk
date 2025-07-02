/**
 * Interface que representa um usuário do sistema.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  cpf?: string;
  celular?: string;
  setor: string;
  cargo: string;
  tipo: string;
  dataCadastro?: string;
  ultimoAcesso?: string;
  foto?: string;
}

/**
 * Interface que representa um chamado/ticket do sistema.
 */
export interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  status: 'aberto' | 'em_atendimento' | 'encerrado';
  prioridade: 'baixa' | 'media' | 'alta';
  categoria: string;
  dataCriacao: string;
  dataAtualizacao?: string;
  usuarioId: string;
  tecnicoId?: string;
  respostas?: Resposta[];
}

/**
 * Interface que representa uma resposta a um chamado.
 */
export interface Resposta {
  id: string;
  chamadoId: string;
  usuarioId: string;
  conteudo: string;
  dataCriacao: string;
  anexos?: string[];
}

/**
 * Interface do estado de autenticação global.
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

/**
 * Interface do estado global da aplicação (Redux).
 */
export interface RootState {
  auth: AuthState;
}

/**
 * Interface para estatísticas do dashboard.
 */
export interface Stats {
  chamadosAbertos: number;
  chamadosEmAtendimento: number;
  chamadosEncerrados: number;
  totalChamados: number;
  usuariosAtivos?: number;
  tempoMedioResposta?: string;
  satisfacaoMedia?: string;
}