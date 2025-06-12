import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getChamados, deleteChamado, updateChamado } from '../services';

interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  assunto: string;
  dataCriacao: string;
  usuarioId: string;
}

const Chamados = () => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const [filtro, setFiltro] = useState({ status: '', prioridade: '', assunto: '' });
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalEdit, setModalEdit] = useState<{ open: boolean; chamado: Chamado | null }>({ open: false, chamado: null });
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    getChamados()
      .then(res => {
        const normalizados = res.data.map((c: Chamado) => ({
          ...c,
          status: c.status?.toUpperCase() ?? '',
          prioridade: c.prioridade?.toLowerCase() ?? '',
          assunto: c.assunto?.toLowerCase() ?? '',
        }));
        setChamados(normalizados);
      })
      .catch(() => setError('Erro ao carregar chamados'))
      .finally(() => setLoading(false));
  }, []);

  const chamadosFiltrados = auth.user?.tipo === 'admin'
    ? chamados
    : chamados.filter(chamado => String(chamado.usuarioId) === String(auth.user?.id));

  const chamadosFinal = chamadosFiltrados.filter(chamado => {
    const statusMatch = filtro.status ? chamado.status === filtro.status.toUpperCase() : true;
    const prioridadeMatch = filtro.prioridade ? chamado.prioridade === filtro.prioridade.toLowerCase() : true;
    const assuntoMatch = filtro.assunto ? chamado.assunto === filtro.assunto.toLowerCase() : true;
    return statusMatch && prioridadeMatch && assuntoMatch;
  });

  const containerClass = "flex-1 bg-gray-900 min-h-screen";
  const cardClass = "bg-gray-800 rounded-lg overflow-hidden";
  const headerClass = "bg-gray-900 p-6";
  const tableHeaderClass = "bg-gray-700";
  const tableHeaderCellClass = "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600";
  const tableCellClass = "px-6 py-4 whitespace-nowrap text-sm text-white";
  const tableRowClass = "bg-gray-800 hover:bg-gray-700 transition-colors";
  const selectClass = "bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const handleDeleteChamado = async (id: string | number) => {
    if (!window.confirm('Tem certeza que deseja remover este chamado?')) return;
    try {
      setLoading(true);
      await deleteChamado(id);
      setChamados(chamados.filter(c => c.id !== id));
      toast.success('Chamado removido com sucesso!');
    } catch {
      toast.error('Erro ao remover chamado!');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (chamado: Chamado) => {
    setEditStatus(chamado.status);
    setModalEdit({ open: true, chamado });
  };

  const handleEditChamado = async () => {
    if (!modalEdit.chamado) return;
    const novoChamado = {
      ...modalEdit.chamado,
      status: editStatus.toUpperCase(),
      prioridade: modalEdit.chamado.prioridade.toLowerCase().trim(),
    };
    try {
      await updateChamado(novoChamado.id, novoChamado);
      setChamados(chamados.map(c => c.id === novoChamado.id ? novoChamado : c));
      toast.success('Chamado editado com sucesso!');
      setModalEdit({ open: false, chamado: null });
    } catch {
      toast.error('Erro ao editar chamado!');
    }
  };

  if (loading) return <div className={containerClass}><div className="p-6 text-white">Carregando chamados...</div></div>;
  if (error) return <div className={containerClass}><div className="p-6 text-red-500">{error}</div></div>;

  return (
    <div className={containerClass}>
      <div className="p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className={cardClass}>
            <div className={headerClass}>
              <h2 className="text-3xl font-bold text-left text-white">
                {auth.user?.tipo === 'admin' ? 'Todos os Chamados' : 'Meus Chamados'}
              </h2>
            </div>

            {/* Filtros */}
            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-4">
                <select value={filtro.assunto} onChange={e => setFiltro({ ...filtro, assunto: e.target.value })} className={selectClass}>
                  <option value="">Todos</option>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="rede">Rede</option>
                  <option value="impressora">Impressora</option>
                  <option value="email">Email</option>
                  <option value="acesso">Acesso</option>
                  <option value="outros">Outros</option>
                </select>
                <select value={filtro.status} onChange={e => setFiltro({ ...filtro, status: e.target.value })} className={selectClass}>
                  <option value="">Todos</option>
                  <option value="ABERTO">Aberto</option>
                  <option value="EM_ATENDIMENTO">Em Atendimento</option>
                  <option value="ENCERRADO">Concluído</option>
                </select>
                <select value={filtro.prioridade} onChange={e => setFiltro({ ...filtro, prioridade: e.target.value })} className={selectClass}>
                  <option value="">Todos</option>
                  <option value="baixo">Baixa</option>
                  <option value="medio">Média</option>
                  <option value="alto">Alta</option>
                </select>
              </div>
            </div>

            {/* Tabela de chamados */}
            <table className="min-w-full divide-y divide-gray-700">
              <thead className={tableHeaderClass}>
                <tr>
                  <th className={tableHeaderCellClass}>Título</th>
                  <th className={tableHeaderCellClass}>Status</th>
                  <th className={tableHeaderCellClass}>Prioridade</th>
                  <th className={tableHeaderCellClass}>Assunto</th>
                  <th className={tableHeaderCellClass}>Data</th>
                  <th className={tableHeaderCellClass}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {chamadosFinal.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-white">Nenhum chamado encontrado.</td>
                  </tr>
                ) : (
                  chamadosFinal.map(chamado => (
                    <tr key={chamado.id} className={tableRowClass}>
                      <td className={tableCellClass}>{chamado.titulo}</td>
                      <td className={tableCellClass}>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          chamado.status === 'ABERTO'
                            ? 'bg-green-600 bg-opacity-20 text-green-200'
                            : chamado.status === 'EM_ATENDIMENTO'
                            ? 'bg-yellow-600 bg-opacity-20 text-yellow-200'
                            : 'bg-red-600 bg-opacity-20 text-red-200'
                        }`}>
                          {chamado.status === 'ABERTO'
                            ? 'Aberto'
                            : chamado.status === 'EM_ATENDIMENTO'
                            ? 'Em Atendimento'
                            : 'Encerrado'}
                        </span>
                      </td>
                      <td className={tableCellClass}>
                        {(() => {
                          const prioridade = chamado.prioridade?.toLowerCase().trim();
                          let cor = '';
                          let texto = '';
                          switch (prioridade) {
                            case 'baixo':
                              cor = 'bg-green-600 bg-opacity-20 text-green-200';
                              texto = 'Baixa';
                              break;
                            case 'medio':
                              cor = 'bg-yellow-600 bg-opacity-20 text-yellow-200';
                              texto = 'Média';
                              break;
                            case 'alto':
                              cor = 'bg-red-600 bg-opacity-20 text-red-200';
                              texto = 'Alta';
                              break;
                            default:
                              cor = 'bg-gray-600 bg-opacity-20 text-gray-200';
                              texto = 'Não definida';
                          }
                          return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${cor}`}>{texto}</span>;
                        })()}
                      </td>
                      <td className={tableCellClass}>
                        {chamado.assunto.charAt(0).toUpperCase() + chamado.assunto.slice(1)}
                      </td>
                      <td className={tableCellClass}>
                        {new Date(chamado.dataCriacao).toLocaleDateString()}
                      </td>
                      <td className={`${tableCellClass} space-x-3`}>
                        <button onClick={() => navigate(`/chamados/${chamado.id}`)} className="hover:text-blue-500" title="Visualizar">
                          <FaEye size={18} />
                        </button>
                        {auth.user?.tipo === 'admin' && (
                          <button onClick={() => openEditModal(chamado)} className="hover:text-yellow-500" title="Editar">
                            <FaEdit size={18} />
                          </button>
                        )}
                        <button onClick={() => handleDeleteChamado(chamado.id)} className="hover:text-red-500" title="Excluir">
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Modal de Edição */}
            {modalEdit.open && modalEdit.chamado && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-gray-900 p-6 rounded-lg w-96">
                  <h3 className="text-lg font-semibold mb-4 text-white">Editar Chamado</h3>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                    className={selectClass + ' w-full mb-4'}
                  >
                    <option value="ABERTO">Aberto</option>
                    <option value="EM_ATENDIMENTO">Em Atendimento</option>
                    <option value="ENCERRADO">Encerrado</option>
                  </select>
                  <select
                    value={modalEdit.chamado.prioridade}
                    onChange={e =>
                      setModalEdit({
                        ...modalEdit,
                        chamado: modalEdit.chamado
                          ? { ...modalEdit.chamado, prioridade: e.target.value }
                          : null
                      })
                    }
                    className={selectClass + ' w-full mb-4'}
                  >
                    <option value="baixo">Baixa</option>
                    <option value="medio">Média</option>
                    <option value="alto">Alta</option>
                  </select>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setModalEdit({ open: false, chamado: null })}
                      className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleEditChamado}
                      className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Chamados;
