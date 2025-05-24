import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { FaSearch, FaFilter, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  categoria: string;
  dataCriacao: string;
  usuarioId: string;
}

const Chamados = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [filtro, setFiltro] = useState({
    status: '',
    prioridade: '',
    categoria: '',
  });

  // Dados simulados (substitua por dados reais da API)
  const todosChamados: Chamado[] = [
    {
      id: '1',
      titulo: 'Problema com impressora',
      descricao: 'A impressora não está funcionando',
      status: 'aberto',
      prioridade: 'alta',
      categoria: 'Impressora',
      dataCriacao: '2024-03-15',
      usuarioId: '123',
    },
    // Adicione mais chamados conforme necessário
  ];

  // Filtra apenas os chamados do usuário atual (se não for admin)
  const chamadosFiltrados = auth.user?.isAdmin
    ? todosChamados
    : todosChamados.filter(chamado => chamado.usuarioId === auth.user?.id);

  // Aplica os filtros selecionados
  const chamadosFinal = chamadosFiltrados.filter(chamado => {
    return (!filtro.status || chamado.status === filtro.status) &&
           (!filtro.prioridade || chamado.prioridade === filtro.prioridade) &&
           (!filtro.categoria || chamado.categoria === filtro.categoria);
  });

  // Classes condicionais baseadas no tipo de usuário
  const containerClass = auth.user?.isAdmin
    ? "flex-1 bg-gray-900"
    : "flex-1 bg-gray-50";

  const cardClass = auth.user?.isAdmin
    ? "bg-gray-800 rounded-lg overflow-hidden"
    : "bg-white rounded-xl shadow-lg overflow-hidden";

  const headerClass = auth.user?.isAdmin
    ? "bg-gray-900 p-6"
    : "bg-blue-500 p-6";

  const tableHeaderClass = auth.user?.isAdmin
    ? "bg-gray-700"
    : "bg-gray-50";

  const tableHeaderCellClass = auth.user?.isAdmin
    ? "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600"
    : "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200";

  const tableCellClass = auth.user?.isAdmin
    ? "px-6 py-4 whitespace-nowrap text-sm text-white"
    : "px-6 py-4 whitespace-nowrap text-sm text-gray-900";

  const tableRowClass = auth.user?.isAdmin
    ? "bg-gray-800 hover:bg-gray-700 transition-colors"
    : "hover:bg-gray-50 transition-colors";

  const selectClass = auth.user?.isAdmin
    ? "bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    : "bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm";

  return (
    <div className={containerClass}>
      <div className="p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className={cardClass}>
            <div className={headerClass}>
              <h2 className={auth.user?.isAdmin ? "text-3xl font-bold text-left text-white border-none" : "text-3xl font-bold text-center text-white"}>
                {auth.user?.isAdmin ? 'Todos os Chamados' : 'Meus Chamados'}
              </h2>
            </div>

            

            {/* Filtros */}
            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-4">
                <select
                  value={filtro.categoria}
                  onChange={(e) => setFiltro({ ...filtro, categoria: e.target.value })}
                  className={selectClass}
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Rede">Rede</option>
                  <option value="Impressora">Impressora</option>
                  <option value="Email">Email</option>
                  <option value="Acesso">Acesso</option>
                  <option value="Outros">Outros</option>
                </select>

                <select
                  value={filtro.status}
                  onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}
                  className={selectClass}
                >
                  <option value="">Selecione um status</option>
                  <option value="aberto">Aberto</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="fechado">Fechado</option>
                </select>

                <select
                  value={filtro.prioridade}
                  onChange={(e) => setFiltro({ ...filtro, prioridade: e.target.value })}
                  className={selectClass}
                >
                  <option value="">Selecione a prioridade</option>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              {/* Tabela de Chamados */}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full border-collapse">
                  <thead className={tableHeaderClass}>
                    <tr>
                      <th className={tableHeaderCellClass}>Título</th>
                      <th className={tableHeaderCellClass}>Categoria</th>
                      <th className={tableHeaderCellClass}>Status</th>
                      <th className={tableHeaderCellClass}>Prioridade</th>
                      <th className={tableHeaderCellClass}>Data</th>
                      <th className={`${tableHeaderCellClass} text-center`}>Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {chamadosFinal.map((chamado) => (
                      <tr key={chamado.id} className={tableRowClass}>
                        <td className={tableCellClass}>{chamado.titulo}</td>
                        <td className={tableCellClass}>{chamado.categoria}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            chamado.status === 'aberto' 
                              ? 'bg-green-100 text-green-800' 
                              : chamado.status === 'em_andamento'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {chamado.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            chamado.prioridade === 'alta'
                              ? 'bg-red-100 text-red-800'
                              : chamado.prioridade === 'media'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {chamado.prioridade.toUpperCase()}
                          </span>
                        </td>
                        <td className={tableCellClass}>{chamado.dataCriacao}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <div className="flex justify-center space-x-2">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <FaEye className="text-gray-500 hover:text-gray-700" />
                            </button>
                            {auth.user?.isAdmin && (
                              <>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <FaEdit className="text-gray-500 hover:text-gray-700" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <FaTrash className="text-gray-500 hover:text-gray-700" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chamados; 