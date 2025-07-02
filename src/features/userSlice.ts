import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

/**
 * Interface que representa um usuário do sistema.
 */
interface Usuario {
  nome: string
  email: string
  password: string
  cpf: string
  celular: string
  setor: string
  cargo: string
}

/**
 * Estado do slice de usuários no Redux.
 * - lista: lista de usuários cadastrados localmente
 */
interface UsuarioState {
  lista: Usuario[]
}

/**
 * Estado inicial do slice de usuários.
 */
const initialState: UsuarioState = {
  lista: [],
}

/**
 * Slice de usuários do Redux Toolkit.
 * Gerencia a lista de usuários cadastrados e permite adicionar ou remover usuários.
 */
const usuarioSlice = createSlice({
  name: 'usuario',
  initialState,
  reducers: {
    /**
     * Adiciona um novo usuário à lista.
     */
    cadastrarUsuario: (state, action: PayloadAction<Usuario>) => {
      state.lista.push(action.payload)
    },
    /**
     * Remove um usuário da lista pelo CPF.
     */
    removerUsuario: (state, action: PayloadAction<string>) => {
      state.lista = state.lista.filter(u => u.cpf !== action.payload)
    },
  },
})

// Exporta as actions para uso nos componentes
export const { cadastrarUsuario, removerUsuario } = usuarioSlice.actions
// Exporta o reducer para ser usado na store do Redux
export default usuarioSlice.reducer