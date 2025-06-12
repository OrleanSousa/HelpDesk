import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Resposta {
  id: number;
  texto: string;
  usuario: string;
  data: string;
  anexos?: string[];
}

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

interface ChamadoState {
  lista: Chamado[];
  loading: boolean;
  error: string | null;
}

const initialState: ChamadoState = {
  lista: [],
  loading: false,
  error: null,
};

const chamadoSlice = createSlice({
  name: 'chamado',
  initialState,
  reducers: {
    setChamados: (state, action: PayloadAction<Chamado[]>) => {
      state.lista = action.payload;
      state.loading = false;
      state.error = null;
    },
    addChamado: (state, action: PayloadAction<Chamado>) => {
      state.lista.push(action.payload);
    },
    updateChamado: (state, action: PayloadAction<Chamado>) => {
      const index = state.lista.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.lista[index] = action.payload;
      }
    },
    addResposta: (state, action: PayloadAction<{ chamadoId: string; resposta: Resposta }>) => {
      const chamado = state.lista.find(c => c.id === action.payload.chamadoId);
      if (chamado) {
        chamado.respostas.push(action.payload.resposta);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setChamados,
  addChamado,
  updateChamado,
  addResposta,
  setLoading,
  setError,
} = chamadoSlice.actions;

export default chamadoSlice.reducer; 