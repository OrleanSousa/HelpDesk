export interface User {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  cpf?: string;
  celular?: string;
  setor: string;
  cargo: string;
  isAdmin: boolean;
  dataCadastro?: string;
  ultimoAcesso?: string;
}

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

export interface Resposta {
  id: string;
  chamadoId: string;
  usuarioId: string;
  conteudo: string;
  dataCriacao: string;
  anexos?: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface RootState {
  auth: AuthState;
}

export interface Stats {
  chamadosAbertos: number;
  chamadosEmAtendimento: number;
  chamadosEncerrados: number;
  totalChamados: number;
  usuariosAtivos?: number;
  tempoMedioResposta?: string;
  satisfacaoMedia?: string;
} 