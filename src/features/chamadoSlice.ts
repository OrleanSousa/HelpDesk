import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

/**
 * Interface que representa uma resposta a um chamado.
 */
interface Resposta {
  id: number;
  texto: string;
  usuario: string;
  data: string;
  anexos?: string[];
}

/**
 * Interface que representa um chamado no sistema.
 */
export interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  status: 'aberto' | 'em_atendimento' | 'resolvido';
  prioridade: 'baixa' | 'media' | 'alta';
  assunto: string;
  usuario: {
    id: string;
    nome: string;
    setor: string;
  };
  dataCriacao: string;
  respostas: Resposta[];
}

/**
 * Estado do slice de chamados no Redux.
 * - lista: lista de chamados carregados
 * - loading: indica se está carregando dados
 * - error: mensagem de erro, se houver
 */
interface ChamadoState {
  lista: Chamado[];
  loading: boolean;
  error: string | null;
}

/**
 * Estado inicial do slice de chamados.
 */
const initialState: ChamadoState = {
  lista: [],
  loading: false,
  error: null,
};

/**
 * Slice de chamados do Redux Toolkit.
 * Gerencia a lista de chamados, respostas, loading e erros.
 */
const chamadoSlice = createSlice({
  name: 'chamado',
  initialState,
  reducers: {
    /**
     * Define a lista de chamados (ex: após buscar do backend)
     */
    setChamados: (state, action: PayloadAction<Chamado[]>) => {
      state.lista = action.payload;
      state.loading = false;
      state.error = null;
    },
    /**
     * Adiciona um novo chamado à lista
     */
    addChamado: (state, action: PayloadAction<Chamado>) => {
      state.lista.push(action.payload);
    },
    /**
     * Atualiza um chamado existente na lista
     */
    updateChamado: (state, action: PayloadAction<Chamado>) => {
      const index = state.lista.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.lista[index] = action.payload;
      }
    },
    /**
     * Adiciona uma resposta a um chamado específico
     */
    addResposta: (state, action: PayloadAction<{ chamadoId: string; resposta: Resposta }>) => {
      const chamado = state.lista.find(c => c.id === action.payload.chamadoId);
      if (chamado) {
        chamado.respostas.push(action.payload.resposta);
      }
    },
    /**
     * Define o estado de loading (carregando)
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    /**
     * Define uma mensagem de erro
     */
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Exporta as actions para uso nos componentes
export const {
  setChamados,
  addChamado,
  updateChamado,
  addResposta,
  setLoading,
  setError,
} = chamadoSlice.actions;

// Exporta o reducer para ser usado na store do Redux
export default chamadoSlice.reducer;