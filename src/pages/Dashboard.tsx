import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { FaTicketAlt, FaUsers, FaClock, FaChartLine } from 'react-icons/fa';
import usersData from '../data/users.json';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3001/chamados')
      .then(res => setChamados(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Contadores
  const chamadosAbertos = chamados.filter(c => c.status === 'aberto').length;
  const chamadosEmAtendimento = chamados.filter(c => c.status === 'em_atendimento').length;
  const chamadosEncerrados = chamados.filter(c => c.status === 'fechado').length;
  const totalChamados = chamados.length;

  // Ordenar do mais recente para o mais antigo
  const chamadosOrdenados = [...chamados].sort((a, b) => b.dataCriacao.localeCompare(a.dataCriacao));

  // Função para buscar nome do usuário pelo id
  const getNomeUsuario = (id: string) => {
    const user = usersData.users.find(u => String(u.id) === String(id));
    return user ? user.nome : id;
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-900 p-6">
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>

        {/* Cards de Estatísticas Principais */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-l-blue-500">
            <h3 className="text-lg font-semibold text-white">Abertos</h3>
            <p className="text-3xl font-bold text-white">{chamadosAbertos}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-l-yellow-500">
            <h3 className="text-lg font-semibold text-white">Em Atendimento</h3>
            <p className="text-3xl font-bold text-white">{chamadosEmAtendimento}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-l-green-500">
            <h3 className="text-lg font-semibold text-white">Encerrados</h3>
            <p className="text-3xl font-bold text-white">{chamadosEncerrados}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-l-purple-500">
            <h3 className="text-lg font-semibold text-white">Total</h3>
            <p className="text-3xl font-bold text-white">{totalChamados}</p>
          </div>
        </div>

        {/* Métricas Adicionais (mantidas como exemplo, mas pode remover se quiser) */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Usuários Ativos</h3>
              <FaUsers className="text-2xl text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-white">-</p>
            <p className="text-sm text-gray-400 mt-2">Total de usuários ativos no sistema</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Tempo Médio de Resposta</h3>
              <FaClock className="text-2xl text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-white">-</p>
            <p className="text-sm text-gray-400 mt-2">Média de tempo para primeira resposta</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Satisfação dos Usuários</h3>
              <FaChartLine className="text-2xl text-green-500" />
            </div>
            <p className="text-3xl font-bold text-white">-</p>
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
              {loading ? (
                <tr><td colSpan={5} className="text-center text-white py-8">Carregando chamados...</td></tr>
              ) : chamadosOrdenados.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-400 py-8">Nenhum chamado encontrado.</td></tr>
              ) : (
                chamadosOrdenados.map((chamado) => (
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
                        {chamado.status === 'aberto' ? 'Aberto' : chamado.status === 'em_atendimento' ? 'Em Atendimento' : 'Concluído'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{getNomeUsuario(chamado.usuarioId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{chamado.dataCriacao}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;