import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface Usuario {
  nome: string
  email: string
  password: string
  cpf: string
  celular: string
  setor: string
  cargo: string
}

interface UsuarioState {
  lista: Usuario[]
}

const initialState: UsuarioState = {
  lista: [],
}

const usuarioSlice = createSlice({
  name: 'usuario',
  initialState,
  reducers: {
    cadastrarUsuario: (state, action: PayloadAction<Usuario>) => {
      state.lista.push(action.payload)
    },
    removerUsuario: (state, action: PayloadAction<string>) => {
      state.lista = state.lista.filter(u => u.cpf !== action.payload)
    },
  },
})

export const { cadastrarUsuario, removerUsuario } = usuarioSlice.actions
export default usuarioSlice.reducer
