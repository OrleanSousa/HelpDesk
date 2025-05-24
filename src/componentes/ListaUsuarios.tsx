import React, { useState } from 'react'

interface Usuario {
  id: number
  nome: string
  email: string
  setor: string
  cargo: string
}

const usuariosIniciais: Usuario[] = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com', setor: 'TI', cargo: 'Analista' },
  { id: 2, nome: 'Maria Souza', email: 'maria@email.com', setor: 'RH', cargo: 'Assistente' },
]

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciais)
  const [novoUsuario, setNovoUsuario] = useState<Omit<Usuario, 'id'>>({
    nome: '',
    email: '',
    setor: '',
    cargo: '',
  })
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [editUsuario, setEditUsuario] = useState<Omit<Usuario, 'id'>>({
    nome: '',
    email: '',
    setor: '',
    cargo: '',
  })

  // Adicionar usuário
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoUsuario.nome || !novoUsuario.email) return
    setUsuarios([
      ...usuarios,
      { id: Date.now(), ...novoUsuario }
    ])
    setNovoUsuario({ nome: '', email: '', setor: '', cargo: '' })
  }

  // Remover usuário
  const handleRemove = (id: number) => {
    setUsuarios(usuarios.filter(u => u.id !== id))
  }

  // Iniciar edição
  const handleEditInit = (usuario: Usuario) => {
    setEditandoId(usuario.id)
    setEditUsuario({
      nome: usuario.nome,
      email: usuario.email,
      setor: usuario.setor,
      cargo: usuario.cargo,
    })
  }

  // Salvar edição
  const handleEditSave = (id: number) => {
    setUsuarios(usuarios.map(u => u.id === id ? { id, ...editUsuario } : u))
    setEditandoId(null)
  }

  return (
    <div className="flex-1 p-8 bg-gray-300 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-black">Usuários</h2>

      {/* Formulário de novo usuário */}
      <form onSubmit={handleAdd} className="flex flex-wrap gap-2 mb-6 bg-gray-300 p-4 rounded shadow text-black">
        <input
          className="border rounded p-2 flex-1 "
          placeholder="Nome"
          value={novoUsuario.nome}
          onChange={e => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
        />
        <input
          className="border rounded p-2 flex-1"
          placeholder="Email"
          value={novoUsuario.email}
          onChange={e => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
        />
        <input
          className="border rounded p-2 flex-1"
          placeholder="Setor"
          value={novoUsuario.setor}
          onChange={e => setNovoUsuario({ ...novoUsuario, setor: e.target.value })}
        />
        <input
          className="border rounded p-2 flex-1"
          placeholder="Cargo"
          value={novoUsuario.cargo}
          onChange={e => setNovoUsuario({ ...novoUsuario, cargo: e.target.value })}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Adicionar</button>
      </form>

      {/* Lista de usuários */}
      <table className="w-full bg-white rounded shadow text-black text-center">
        <thead className="bg-gray-300">
          <tr>
            <th className="p-2 text-black">Nome</th>
            <th className="p-2 text-black">Email</th>
            <th className="p-2 text-black">Setor</th>
            <th className="p-2 text-black">Cargo</th>
            <th className="p-2 text-black">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id} className="border-b">
              {editandoId === usuario.id ? (
                <>
                  <td className="p-2">
                    <input
                      className="border rounded p-1"
                      value={editUsuario.nome}
                      onChange={e => setEditUsuario({ ...editUsuario, nome: e.target.value })}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="border rounded p-1"
                      value={editUsuario.email}
                      onChange={e => setEditUsuario({ ...editUsuario, email: e.target.value })}
                    />
                  </td>
                  <td className="p-2 ">
                    <input
                      className="border rounded p-1"
                      value={editUsuario.setor}
                      onChange={e => setEditUsuario({ ...editUsuario, setor: e.target.value })}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="border rounded p-1"
                      value={editUsuario.cargo}
                      onChange={e => setEditUsuario({ ...editUsuario, cargo: e.target.value })}
                    />
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      onClick={() => handleEditSave(usuario.id)}
                    >
                      Salvar
                    </button>
                    <button
                      className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                      onClick={() => setEditandoId(null)}
                    >
                      Cancelar
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2">{usuario.nome}</td>
                  <td className="p-2">{usuario.email}</td>
                  <td className="p-2">{usuario.setor}</td>
                  <td className="p-2">{usuario.cargo}</td>
                  <td className="p-2 flex gap-2 justify-center">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      onClick={() => handleEditInit(usuario)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      onClick={() => handleRemove(usuario.id)}
                    >
                      Remover
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListaUsuarios