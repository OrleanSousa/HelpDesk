import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { cadastrarUsuario } from '../features/userslice'

interface FormUsuario {
  nome: string
  email: string
  senha: string
  cpf: string
  celular: string
  setor: string
  cargo: string
}

const limparNumero = (numero: string) => numero.replace(/\D/g, '')

const formatarCelular = (valor: string) => {
  const numeros = limparNumero(valor)
  if (numeros.length <= 2) return `(${numeros}`
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`
}

const CadastroUsuario = () => {
  const dispatch = useDispatch()

  const [form, setForm] = useState<FormUsuario>({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    celular: '',
    setor: '',
    cargo: '',
  })

  const [erros, setErros] = useState<Partial<FormUsuario>>({})
  const [sucesso, setSucesso] = useState(false)

  const validar = () => {
    const novoErros: Partial<FormUsuario> = {}

    const cpfLimpo = limparNumero(form.cpf)
    const celularLimpo = limparNumero(form.celular)

    if (!form.nome) novoErros.nome = 'Nome obrigatório'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) novoErros.email = 'Email inválido'
    if (!form.senha || form.senha.length < 6) novoErros.senha = 'Mínimo 6 caracteres'
    if (cpfLimpo.length !== 11) novoErros.cpf = 'CPF deve ter 11 dígitos'
    if (celularLimpo.length !== 11) novoErros.celular = 'Celular deve ter 11 dígitos'
    if (!form.setor) novoErros.setor = 'Setor obrigatório'
    if (!form.cargo) novoErros.cargo = 'Cargo obrigatório'

    setErros(novoErros)
    return Object.keys(novoErros).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'celular') {
      setForm({ ...form, [name]: formatarCelular(value) })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validar()) {
      dispatch(cadastrarUsuario({
        ...form,
        cpf: limparNumero(form.cpf),
        celular: limparNumero(form.celular),
      }))
      setSucesso(true)
      setForm({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        celular: '',
        setor: '',
        cargo: '',
      })
      setErros({})
      setTimeout(() => setSucesso(false), 3000)
    }
  }

  return (
    <div className="min-h-screen w-[80%] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Cadastro de Usuário
        </h2>

        {sucesso && (
          <div className="bg-green-500 text-white text-center p-2 rounded mb-4">
            Usuário cadastrado com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: 'Nome', name: 'nome' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Senha', name: 'senha', type: 'password' },
            { label: 'CPF', name: 'cpf', maxLength: 14 },
            { label: 'Celular', name: 'celular', maxLength: 15 },
            { label: 'Setor', name: 'setor' },
            { label: 'Cargo', name: 'cargo' },
          ].map(({ label, name, type = 'text', maxLength }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={form[name as keyof FormUsuario]}
                onChange={handleChange}
                maxLength={maxLength}
                className={`w-full border ${
                  erros[name as keyof FormUsuario]
                    ? 'border-red-500'
                    : 'border-gray-300'
                } rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {erros[name as keyof FormUsuario] && (
                <p className="text-red-500 text-xs mt-1">
                  {erros[name as keyof FormUsuario]}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl shadow-md transition"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  )
}

export default CadastroUsuario
