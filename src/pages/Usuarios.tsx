import { useEffect, useState } from 'react';
import { deleteUser, getUsers, updateUser } from '@/services';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Interface que representa um usuário do sistema.
 */
interface Usuario {
  id: string;
  name: string;
  email: string;
  cargo: string;
  setor: string;
  status: string;
  tipo: string;
}

/**
 * Página de listagem e gerenciamento de usuários.
 * Permite visualizar, editar, deletar e cadastrar novos usuários.
 * Possui paginação e modal para edição rápida.
 */
const Usuarios = () => {
  // Estado para lista de usuários
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  // Estado para usuário selecionado no modal de edição
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  // Estado para controle de exibição do modal
  const [modalAberto, setModalAberto] = useState(false);
  // Estado para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const usuariosPorPagina = 10;

  // Carrega usuários ao montar o componente
  useEffect(() => {
    const carregarUsuarios = async () => {
      const resposta = await getUsers();
      // Garante que todos os usuários tenham o campo status
      const users = Array.isArray(resposta.data) ? resposta.data.map((u: any) => ({ ...u, status: u.status ?? '' })) : [];
      setUsuarios(users);
    };
    carregarUsuarios();
  }, []);

  // Paginação: calcula os índices dos usuários da página atual
  const indexUltimoUsuario = paginaAtual * usuariosPorPagina;
  const indexPrimeiroUsuario = indexUltimoUsuario - usuariosPorPagina;
  const usuariosPaginados = usuarios.slice(indexPrimeiroUsuario, indexUltimoUsuario);
  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);

  /**
   * Abre o modal de edição para o usuário selecionado.
   */
  const handleAbrirModal = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setModalAberto(true);
  };

  /**
   * Deleta um usuário do sistema.
   */
  const handleDeletarUsuario = async (id: string) => {
    try {
      await deleteUser(id);
      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  /**
   * Salva as alterações do usuário editado no modal.
   */
  const handleSalvarUsuario = async () => {
    if (!usuarioSelecionado) return;

    try {
      const dadosAtualizados = {
        name: usuarioSelecionado.name,
        email: usuarioSelecionado.email,
        cargo: usuarioSelecionado.cargo,
        setor: usuarioSelecionado.setor,
        status: usuarioSelecionado.status,
        tipo: usuarioSelecionado.tipo,
      };

      await updateUser(usuarioSelecionado.id, dadosAtualizados);

      setUsuarios(usuarios.map(u => u.id === usuarioSelecionado.id ? usuarioSelecionado : u));
      setModalAberto(false);
      setUsuarioSelecionado(null);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-900 p-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header com título e botão de novo usuário */}
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
        {/* Tabela de usuários */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Cargo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Setor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {usuariosPaginados.map((usuario) => (
                <tr key={usuario.id} className="bg-gray-800 hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{usuario.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{usuario.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{usuario.cargo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{usuario.setor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {/* Select para alterar status do usuário */}
                    <select
                      value={usuario.status}
                      onChange={async (e) => {
                        const novoStatus = e.target.value;
                        try {
                          await updateUser(usuario.id, { status: novoStatus } as Partial<Usuario>);
                          setUsuarios(usuarios.map(u => u.id === usuario.id ? { ...u, status: novoStatus } : u));
                        } catch (error) {
                          console.error('Erro ao atualizar status:', error);
                        }
                      }}
                      className={`px-2 py-1 text-xs font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${usuario.status && usuario.status.trim().toLowerCase() === 'ativo'
                          ? 'bg-green-100 text-green-800 border border-green-400'
                          : 'bg-red-100 text-red-800 border border-red-400'}`}
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="flex justify-center space-x-2">
                      {/* Botão para abrir modal de edição */}
                      <button onClick={() => handleAbrirModal(usuario)} className="p-1 hover:bg-gray-600 rounded"><FaEdit className="text-gray-300 hover:text-white" /></button>
                      {/* Botão para deletar usuário */}
                      <button onClick={() => handleDeletarUsuario(usuario.id)} className="p-1 hover:bg-gray-600 rounded"><FaTrash className="text-gray-300 hover:text-white" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Paginação UX/UI melhorada */}
          {totalPaginas > 1 && (
            <div
              className="flex justify-center items-center gap-4 px-6 py-4 border-t border-gray-700 bg-gray-800 rounded-b-lg"
              style={{ minHeight: '64px' }}
            >
              <button
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className={`px-4 py-2 rounded transition-colors duration-150 font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  paginaAtual === 1
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Anterior
              </button>
              <span className="text-white font-medium text-base select-none">
                Página {paginaAtual} de {totalPaginas}
              </span>
              <button
                onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
                className={`px-4 py-2 rounded transition-colors duration-150 font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  paginaAtual === totalPaginas
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Edição */}
      {modalAberto && usuarioSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-white">Editar Usuário</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nome"
                value={usuarioSelecionado.name ?? ""}
                onChange={e => setUsuarioSelecionado({ ...usuarioSelecionado, name: e.target.value })}
                className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={usuarioSelecionado.email ?? ""}
                onChange={e => setUsuarioSelecionado({ ...usuarioSelecionado, email: e.target.value })}
                className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Cargo"
                value={usuarioSelecionado.cargo ?? ""}
                onChange={e => setUsuarioSelecionado({ ...usuarioSelecionado, cargo: e.target.value })}
                className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Setor"
                value={usuarioSelecionado.setor ?? ""}
                onChange={e => setUsuarioSelecionado({ ...usuarioSelecionado, setor: e.target.value })}
                className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={usuarioSelecionado.status ?? ""}
                onChange={e => setUsuarioSelecionado({ ...usuarioSelecionado, status: e.target.value })}
                className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
              <select
                value={usuarioSelecionado.tipo ?? "usuario"}
                onChange={e => setUsuarioSelecionado({ ...usuarioSelecionado, tipo: e.target.value })}
                className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="admin">Administrador</option>
                <option value="usuario">Usuário</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => {
                  setModalAberto(false);
                  setUsuarioSelecionado(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarUsuario}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
