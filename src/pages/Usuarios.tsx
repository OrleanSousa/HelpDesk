import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  setor: string;
  status: 'ativo' | 'inativo';
  dataCadastro: string;
}

interface ModalEditarUsuarioProps {
  usuario: Usuario | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (usuario: Usuario) => void;
}

const ModalEditarUsuario: React.FC<ModalEditarUsuarioProps> = ({ usuario, isOpen, onClose, onSave }) => {
  const [form, setForm] = useState<Usuario | null>(usuario);

  if (!isOpen || !form) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form) {
      onSave(form);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Overlay com animação */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <div className="flex items-center justify-center min-h-screen p-4 text-center">
        {/* Hack para centralização vertical */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal com animação */}
        <div className="relative inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="p-6 pb-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Editar Usuário</h2>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Cargo</label>
                <input
                  type="text"
                  value={form.cargo}
                  onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Setor</label>
                <input
                  type="text"
                  value={form.setor}
                  onChange={(e) => setForm({ ...form, setor: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as 'ativo' | 'inativo' })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const Usuarios = () => {
  const [modalUsuario, setModalUsuario] = useState<Usuario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dados simulados (substitua por dados reais da API)
  const usuarios: Usuario[] = [
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      cargo: 'Analista',
      setor: 'TI',
      status: 'ativo',
      dataCadastro: '2024-01-15',
    },
    // Adicione mais usuários conforme necessário
  ];

  const handleEditarUsuario = (usuario: Usuario) => {
    setModalUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleSalvarUsuario = (usuarioAtualizado: Usuario) => {
    // Implemente a lógica de atualização do usuário aqui
    console.log('Usuário atualizado:', usuarioAtualizado);
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-900 p-6">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Usuários</h2>
          <Link
            to="/cadastro"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaUserPlus />
            Novo Usuário
          </Link>
        </div>

        {/* Tabela de Usuários */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Cargo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Setor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Data Cadastro</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="bg-gray-800 hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{usuario.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{usuario.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{usuario.cargo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{usuario.setor}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      usuario.status === 'ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{usuario.dataCadastro}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEditarUsuario(usuario)}
                        className="p-1 hover:bg-gray-600 rounded"
                      >
                        <FaEdit className="text-gray-300 hover:text-white" />
                      </button>
                      <button className="p-1 hover:bg-gray-600 rounded">
                        <FaTrash className="text-gray-300 hover:text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição */}
      <ModalEditarUsuario
        usuario={modalUsuario}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvarUsuario}
      />
    </div>
  );
};

export default Usuarios;