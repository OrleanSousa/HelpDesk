import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { FaUsers } from 'react-icons/fa';
import { getChamados, getUsers } from '../services';

interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  categoria: string;
  dataCriacao: string;
  usuarioId: string;
  respostas?: { autorId: string; autorNome: string; mensagem: string; data: string }[];
}

const Dashboard = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Estados para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const chamadosPorPagina = 4;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getChamados(),
      getUsers()
    ])
      .then(([chamadosRes, usersRes]) => {
        setChamados(chamadosRes.data || []);
        setUsuarios(usersRes.data || []);
      })
      .catch((err) => {
        console.error('Erro ao carregar dados:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Contadores
  const chamadosAbertos = chamados.filter(c => c.status === 'ABERTO').length;
  const chamadosEmAtendimento = chamados.filter(c => c.status === 'EM_ATENDIMENTO').length;
  const chamadosEncerrados = chamados.filter(c => c.status === 'ENCERRADO').length;
  const totalChamados = chamados.length;

  const usuariosAtivos = usuarios.filter(u => u.status === 'ativo').length;
  const usuariosInativos = usuarios.filter(u => u.status === 'inativo').length;

  // Ordenação segura
  const chamadosOrdenados = [...chamados].sort((a, b) => 
    (b.dataCriacao || '').localeCompare(a.dataCriacao || '')
  );

  // Paginação: calcula os chamados da página atual
  const indexUltimoChamado = paginaAtual * chamadosPorPagina;
  const indexPrimeiroChamado = indexUltimoChamado - chamadosPorPagina;
  const chamadosPaginados = chamadosOrdenados.slice(indexPrimeiroChamado, indexUltimoChamado);
  const totalPaginas = Math.ceil(chamadosOrdenados.length / chamadosPorPagina);

  // Busca nome do usuário
  const getNomeUsuario = (id: string) => {
    const user = usuarios.find(u => String(u.id) === String(id));
    return user?.name || `ID: ${id}`;
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-900 p-6">
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>

        {/* Cards principais */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Abertos', value: chamadosAbertos, color: 'blue' },
            { label: 'Em Atendimento', value: chamadosEmAtendimento, color: 'yellow' },
            { label: 'Encerrados', value: chamadosEncerrados, color: 'green' },
            { label: 'Total', value: totalChamados, color: 'purple' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`bg-gray-800 rounded-lg p-4 border-l-4 border-l-${color}-500`}>
              <h3 className="text-lg font-semibold text-white">{label}</h3>
              <p className="text-3xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Usuários */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Usuários Ativos', value: usuariosAtivos, color: 'green' },
            { label: 'Usuários Inativos', value: usuariosInativos, color: 'red' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{label}</h3>
                <FaUsers className={`text-2xl text-${color}-500`} />
              </div>
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-sm text-gray-400 mt-2">Total de {label.toLowerCase()} no sistema</p>
            </div>
          ))}
        </div>

        {/* Tabela */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-white">Chamados Recentes</h3>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-700">
                {['ID', 'Título', 'Status', 'Usuário', 'Data'].map(header => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center text-white py-8">Carregando chamados...</td>
                </tr>
              ) : chamadosOrdenados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-8">Nenhum chamado encontrado.</td>
                </tr>
              ) : (
                chamadosPaginados.map(chamado => (
                  <tr key={chamado.id} className="bg-gray-800 hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">#{chamado.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{chamado.titulo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        chamado.status === 'aberto'
                          ? 'bg-blue-100 text-blue-800'
                          : chamado.status === 'em_atendimento'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {chamado.status === 'ABERTO'
                          ? 'Aberto'
                          : chamado.status === 'EM_ATENDIMENTO'
                          ? 'Em Atendimento'
                          : 'Concluído'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{getNomeUsuario(chamado.usuarioId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{chamado.dataCriacao || 'Sem data'}</td>
                  </tr>
                ))
              )}
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
    </div>
  );
};

export default Dashboard;
