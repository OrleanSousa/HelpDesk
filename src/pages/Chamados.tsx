import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { FaEye, FaEdit, FaTrash, FaRegCommentDots } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getChamados, deleteChamado, updateChamado, createChamadoResponse } from '../services';

interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  assunto: string;
  dataCriacao: string;
  usuarioId: string;
  respostas?: { autorId: string; autorNome: string; mensagem: string; data: string }[];
}

const Chamados = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState({
    status: '',
    prioridade: '',
    assunto: '',
  });
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalEdit, setModalEdit] = useState<{ open: boolean; chamado: Chamado | null }>({ open: false, chamado: null });
  const [editStatus, setEditStatus] = useState('');
  const [modalResposta, setModalResposta] = useState<{ open: boolean; chamado: Chamado | null }>({ open: false, chamado: null });
  const [respostaTexto, setRespostaTexto] = useState('');
  const [modalDetalhes, setModalDetalhes] = useState<{ open: boolean; chamado: Chamado | null }>({ open: false, chamado: null });
  const [respostaDetalhe, setRespostaDetalhe] = useState('');
  const [enviandoResposta, setEnviandoResposta] = useState(false);

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
  // Estilos escuros iguais ao print
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
    } catch (err) {
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
      status: editStatus,
      prioridade: modalEdit.chamado.prioridade
    };
    try {
      await updateChamado(novoChamado.id, novoChamado);
      setChamados(chamados.map(c => c.id === novoChamado.id ? novoChamado : c));
      toast.success('Chamado editado com sucesso!');
      setModalEdit({ open: false, chamado: null });
    } catch (err) {
      toast.error('Erro ao editar chamado!');
    }
  };

  const handleEnviarResposta = async () => {
    if (!modalResposta.chamado) return;
    setEnviandoResposta(true);
    try {
      await createChamadoResponse({ chamadoId: modalResposta.chamado.id, mensagem: respostaTexto });
      toast.success('Resposta enviada com sucesso!');
      setModalResposta({ open: false, chamado: null });
      setRespostaTexto('');
    } catch {
      toast.error('Erro ao enviar resposta!');
    } finally {
      setEnviandoResposta(false);
    }
  };

  const handleEnviarRespostaDetalhe = async () => {
    if (!modalDetalhes.chamado || !auth.user) return;
    setEnviandoResposta(true);
    const novaResposta = {
      autorId: String(auth.user.id),
      autorNome: auth.user.name,
      mensagem: respostaDetalhe,
      data: new Date().toISOString(),
    };
    const novoChamado = {
      ...modalDetalhes.chamado,
      respostas: [...(modalDetalhes.chamado.respostas || []), novaResposta],
    };
    try {
      await updateChamado(modalDetalhes.chamado.id, novoChamado);
      const { data } = await getChamados();
      setChamados(data);
      const chamadoAtualizado = data.find((c: Chamado) => c.id === novoChamado.id);
      setModalDetalhes({ open: true, chamado: chamadoAtualizado || null });
      setRespostaDetalhe('');
      toast.success('Resposta enviada com sucesso!');
    } catch {
      toast.error('Erro ao enviar resposta!');
    } finally {
      setEnviandoResposta(false);
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
              <h2 className="text-3xl font-bold text-left text-white border-none">
                {auth.user?.tipo === 'admin' ? 'Todos os Chamados' : 'Meus Chamados'}
              </h2>
            </div>
            {/* Filtros */}
            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-4">
                <select
                  value={filtro.assunto}
                  onChange={(e) => setFiltro({ ...filtro, assunto: e.target.value })}
                  className={selectClass}
                >
                  <option value="">Todos</option>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="rede">Rede</option>
                  <option value="impressora">Impressora</option>
                  <option value="email">Email</option>
                  <option value="acesso">Acesso</option>
                  <option value="outros">Outros</option>
                </select>
                <select
                  value={filtro.status}
                  onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}
                  className={selectClass}
                >
                  <option value="">Todos</option>
                  <option value="ABERTO">Aberto</option>
                  <option value="EM_ATENDIMENTO">Em Atendimento</option>
                  <option value="ENCERRADO">Concluído</option>
                </select>
                <select
                  value={filtro.prioridade}
                  onChange={(e) => setFiltro({ ...filtro, prioridade: e.target.value })}
                  className={selectClass}
                >
                  <option value="">Todos</option>
                  <option value="baixo">Baixa</option>
                  <option value="medio">Média</option>
                  <option value="alto">Alta</option>
                </select>
              </div>
            </div>

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

                      {/* Status com cores */}
                      <td className={tableCellClass}>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            chamado.status === 'ABERTO'
                              ? 'bg-green-600 bg-opacity-20 text-green-200'
                              : chamado.status === 'EM_ATENDIMENTO'
                              ? 'bg-yellow-600 bg-opacity-20 text-yellow-200'
                              : 'bg-red-600 bg-opacity-20 text-red-200'
                          }`}
                        >
                          {chamado.status === 'ABERTO'
                            ? 'Aberto'
                            : chamado.status === 'EM_ATENDIMENTO'
                            ? 'Em Atendimento'
                            : 'Encerrado'}
                        </span>
                      </td>

                      {/* Prioridade com cores */}
                      <td className={tableCellClass}>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            chamado.prioridade === 'baixo'
                              ? 'bg-green-600 bg-opacity-20 text-green-200'
                              : chamado.prioridade === 'medio'
                              ? 'bg-yellow-600 bg-opacity-20 text-yellow-200'
                              : 'bg-red-600 bg-opacity-20 text-red-200'
                          }`}
                        >
                          {chamado.prioridade === 'baixo'
                            ? 'Baixa'
                            : chamado.prioridade === 'medio'
                            ? 'Média'
                            : 'Alta'}
                        </span>
                      </td>

                      <td className={tableCellClass}>{chamado.assunto.charAt(0).toUpperCase() + chamado.assunto.slice(1)}</td>
                      <td className={tableCellClass}>{new Date(chamado.dataCriacao).toLocaleDateString()}</td>

                      <td className={`${tableCellClass} space-x-3`}>
                        <button
                          onClick={() => setModalDetalhes({ open: true, chamado })}
                          className="hover:text-blue-500"
                          title="Visualizar"
                        >
                          <FaEye size={18} />
                        </button>

                        {auth.user?.tipo === 'admin' && (
                          <>
                            <button
                              onClick={() => openEditModal(chamado)}
                              className="hover:text-yellow-500"
                              title="Editar"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteChamado(chamado.id)}
                              className="hover:text-red-500"
                              title="Excluir"
                            >
                              <FaTrash size={18} />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setModalResposta({ open: true, chamado })}
                          className="hover:text-green-500"
                          title="Responder"
                        >
                          <FaRegCommentDots size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Modal Editar */}
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

            {/* Modal Responder */}
            {modalResposta.open && modalResposta.chamado && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-gray-900 p-6 rounded-lg w-96">
                  <h3 className="text-lg font-semibold mb-4 text-white">Responder Chamado</h3>
                  <textarea
                    value={respostaTexto}
                    onChange={e => setRespostaTexto(e.target.value)}
                    className="w-full p-2 mb-4 rounded bg-gray-700 text-white resize-none"
                    rows={4}
                    placeholder="Digite sua resposta..."
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setModalResposta({ open: false, chamado: null })}
                      className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleEnviarResposta}
                      disabled={enviandoResposta}
                      className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-white disabled:opacity-50"
                    >
                      {enviandoResposta ? 'Enviando...' : 'Enviar'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Detalhes */}
            {modalDetalhes.open && modalDetalhes.chamado && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto p-4">
                <div className="bg-gray-900 p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <h3 className="text-2xl font-bold mb-2 text-white">{modalDetalhes.chamado.titulo}</h3>
                  <p className="mb-4 text-white whitespace-pre-line">{modalDetalhes.chamado.descricao}</p>

                  <h4 className="font-semibold text-white mb-2">Respostas:</h4>
                  {modalDetalhes.chamado.respostas && modalDetalhes.chamado.respostas.length > 0 ? (
                    modalDetalhes.chamado.respostas.map((r, i) => (
                      <div key={i} className="mb-3 border-l-4 border-blue-600 pl-3 text-white">
                        <p className="font-semibold">{r.autorNome} <span className="text-xs text-gray-400">{new Date(r.data).toLocaleString()}</span></p>
                        <p>{r.mensagem}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 mb-4">Nenhuma resposta ainda.</p>
                  )}

                  {/* Campo para adicionar resposta */}
                  <textarea
                    value={respostaDetalhe}
                    onChange={e => setRespostaDetalhe(e.target.value)}
                    rows={4}
                    className="w-full p-2 mb-4 rounded bg-gray-700 text-white resize-none"
                    placeholder="Digite sua resposta..."
                  />

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setModalDetalhes({ open: false, chamado: null })}
                      className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white"
                    >
                      Fechar
                    </button>
                    <button
                      onClick={handleEnviarRespostaDetalhe}
                      disabled={enviandoResposta}
                      className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-white disabled:opacity-50"
                    >
                      {enviandoResposta ? 'Enviando...' : 'Enviar Resposta'}
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
