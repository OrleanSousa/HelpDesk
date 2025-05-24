import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { FaTicketAlt, FaUsers, FaClock, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const auth = useSelector((state: RootState) => state.auth);

  // Dados simulados (substitua por dados reais da API)
  const stats = {
    chamadosAbertos: 10,
    chamadosEmAtendimento: 5,
    chamadosEncerrados: 8,
    totalChamados: 23,
    usuariosAtivos: 45,
    tempoMedioResposta: '2h 30min',
    satisfacaoMedia: '98%',
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-900 p-6">
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>

        {/* Cards de Estatísticas Principais */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-l-blue-500">
            <h3 className="text-lg font-semibold text-white">Abertos</h3>
            <p className="text-3xl font-bold text-white">{stats.chamadosAbertos}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-l-yellow-500">
            <h3 className="text-lg font-semibold text-white">Em Atendimento</h3>
            <p className="text-3xl font-bold text-white">{stats.chamadosEmAtendimento}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-l-green-500">
            <h3 className="text-lg font-semibold text-white">Encerrados</h3>
            <p className="text-3xl font-bold text-white">{stats.chamadosEncerrados}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-l-purple-500">
            <h3 className="text-lg font-semibold text-white">Total</h3>
            <p className="text-3xl font-bold text-white">{stats.totalChamados}</p>
          </div>
        </div>

        {/* Métricas Adicionais */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Usuários Ativos</h3>
              <FaUsers className="text-2xl text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.usuariosAtivos}</p>
            <p className="text-sm text-gray-400 mt-2">Total de usuários ativos no sistema</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Tempo Médio de Resposta</h3>
              <FaClock className="text-2xl text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.tempoMedioResposta}</p>
            <p className="text-sm text-gray-400 mt-2">Média de tempo para primeira resposta</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Satisfação dos Usuários</h3>
              <FaChartLine className="text-2xl text-green-500" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.satisfacaoMedia}</p>
            <p className="text-sm text-gray-400 mt-2">Média de avaliações positivas</p>
          </div>
        </div>

        {/* Tabela de Chamados Recentes */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-white">Chamados Recentes</h3>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Usuário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {/* Exemplo de linha - substitua por dados reais */}
              <tr className="bg-gray-800 hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">#1234</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Problema com impressora</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Em Atendimento
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">João Silva</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">2024-03-15</td>
              </tr>
              {/* Adicione mais linhas conforme necessário */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;