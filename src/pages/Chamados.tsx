import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { FaEye, FaEdit, FaTrash, FaRegCommentDots } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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

const Chamados = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState({
    status: '',
    prioridade: '',
    categoria: '',
  });
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalEdit, setModalEdit] = useState<{open: boolean, chamado: Chamado | null}>({open: false, chamado: null});
  const [editStatus, setEditStatus] = useState('');
  const [modalResposta, setModalResposta] = useState<{open: boolean, chamado: Chamado | null}>({open: false, chamado: null});
  const [respostaTexto, setRespostaTexto] = useState('');
  const [modalDetalhes, setModalDetalhes] = useState<{open: boolean, chamado: Chamado | null}>({open: false, chamado: null});
  const [respostaDetalhe, setRespostaDetalhe] = useState('');
  const [enviandoResposta, setEnviandoResposta] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3001/chamados')
      .then(res => setChamados(res.data))
      .catch(() => setError('Erro ao carregar chamados'))
      .finally(() => setLoading(false));
  }, []);

  // Filtra apenas os chamados do usuário atual (se não for admin)
  const chamadosFiltrados = auth.user?.isAdmin
    ? chamados
    : chamados.filter(chamado => String(chamado.usuarioId) === String(auth.user?.id));

  // Aplica os filtros selecionados
  const chamadosFinal = chamadosFiltrados.filter(chamado => {
    const statusMatch = !filtro.status || chamado.status === filtro.status;
    const prioridadeMatch = !filtro.prioridade || chamado.prioridade === filtro.prioridade;
    const categoriaMatch = !filtro.categoria || chamado.categoria === filtro.categoria;
    return statusMatch && prioridadeMatch && categoriaMatch;
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

  const handleDeleteChamado = async (id: string | number) => {
    if (!window.confirm('Tem certeza que deseja remover este chamado?')) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3001/chamados/${id}`);
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
    setModalEdit({open: true, chamado});
  };

  const handleEditChamado = async () => {
    if (!modalEdit.chamado) return;
    const novoChamado = { ...modalEdit.chamado, status: editStatus };
    try {
      await axios.put(`http://localhost:3001/chamados/${modalEdit.chamado.id}`, novoChamado);
      setChamados(chamados.map(c => c.id === novoChamado.id ? novoChamado : c));
      toast.success('Chamado editado com sucesso!');
      setModalEdit({open: false, chamado: null});
    } catch (err) {
      toast.error('Erro ao editar chamado!');
    }
  };

  const openRespostaModal = (chamado: Chamado) => {
    setRespostaTexto('');
    setModalResposta({open: true, chamado});
  };

  const handleEnviarResposta = () => {
    // Aqui você pode futuramente fazer um POST/PUT para salvar a resposta
    toast.success('Resposta enviada com sucesso!');
    setModalResposta({open: false, chamado: null});
  };

  const openDetalhesModal = (chamado: Chamado) => {
    setRespostaDetalhe('');
    setModalDetalhes({open: true, chamado});
  };

  const handleEnviarRespostaDetalhe = async () => {
    if (!modalDetalhes.chamado || !auth.user) return;
    setEnviandoResposta(true);
    const novaResposta = {
      autorId: String(auth.user.id),
      autorNome: auth.user.nome,
      mensagem: respostaDetalhe,
      data: new Date().toISOString(),
    };
    const novoChamado = {
      ...modalDetalhes.chamado,
      respostas: [...(modalDetalhes.chamado.respostas || []), novaResposta],
    };
    try {
      await axios.put(`http://localhost:3001/chamados/${modalDetalhes.chamado.id}`, novoChamado);
      const { data } = await axios.get('http://localhost:3001/chamados');
      setChamados(data);
      const chamadoAtualizado = data.find((c: Chamado) => c.id === novoChamado.id);
      setModalDetalhes({open: true, chamado: chamadoAtualizado});
      setRespostaDetalhe('');
      toast.success('Resposta enviada com sucesso!');
    } catch {
      toast.error('Erro ao enviar resposta!');
    } finally {
      setEnviandoResposta(false);
    }
  };

  if (loading) return <div className={containerClass}><div className="p-6">Carregando chamados...</div></div>;
  if (error) return <div className={containerClass}><div className="p-6 text-red-500">{error}</div></div>;

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
                  <option value="">Todos</option>
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
                  <option value="">Todos</option>
                  <option value="aberto">Aberto</option>
                  <option value="em_atendimento">Em Andamento</option>
                  <option value="fechado">Fechado</option>
                </select>

                <select
                  value={filtro.prioridade}
                  onChange={(e) => setFiltro({ ...filtro, prioridade: e.target.value })}
                  className={selectClass}
                >
                  <option value="">Todos</option> 
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              {/* Tabela de Chamados */}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                {chamadosFinal.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Nenhum chamado encontrado.</div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead className={tableHeaderClass}>
                      <tr>
                        <th className={tableHeaderCellClass}>Título</th>
                        <th className={tableHeaderCellClass}>Categoria</th>
                        <th className={tableHeaderCellClass}>Status</th>
                        <th className={tableHeaderCellClass}>Prioridade</th>
                        <th className={tableHeaderCellClass}>Data</th>
                        <th className={tableHeaderCellClass + " text-center"}>Ações</th>
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
                                : chamado.status === 'em_atendimento'
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
                            <div className="flex justify-start space-x-2">
                              <button className="p-1 hover:bg-gray-100 rounded" onClick={() => navigate(`/chamados/${chamado.id}`)}>
                                <FaEye className="text-gray-500 hover:text-gray-700" />
                              </button>
                              {auth.user?.isAdmin && (
                                <>
                                  <button className="p-1 hover:bg-gray-100 rounded" onClick={() => openEditModal(chamado)}>
                                    <FaEdit className="text-gray-500 hover:text-gray-700" />
                                  </button>
                                  <button className="p-1 hover:bg-gray-100 rounded" onClick={() => handleDeleteChamado(chamado.id)}>
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalEdit.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Editar Status do Chamado</h2>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
              value={editStatus}
              onChange={e => setEditStatus(e.target.value)}
            >
              <option value="aberto">Aberto</option>
              <option value="em_atendimento">Em Andamento</option>
              <option value="fechado">Concluído</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setModalEdit({open: false, chamado: null})} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
              <button onClick={handleEditChamado} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Salvar</button>
            </div>
          </div>
        </div>
      )}
      {modalResposta.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Responder Chamado</h2>
            <div className="mb-4">
              <div className="font-semibold mb-2">Título:</div>
              <div className="mb-2 text-gray-700">{modalResposta.chamado?.titulo}</div>
            </div>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 h-28"
              value={respostaTexto}
              onChange={e => setRespostaTexto(e.target.value)}
              placeholder="Digite sua resposta..."
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setModalResposta({open: false, chamado: null})} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
              <button onClick={handleEnviarResposta} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={!respostaTexto.trim()}>Enviar</button>
            </div>
          </div>
        </div>
      )}
      {modalDetalhes.open && modalDetalhes.chamado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto text-gray-800">
            <h2 className="text-2xl font-bold mb-2 text-black">Detalhes do Chamado</h2>
            <div className="mb-2"><b className="text-black">Título:</b> <span className="text-gray-800">{modalDetalhes.chamado.titulo}</span></div>
            <div className="mb-2"><b className="text-black">Descrição:</b> <span className="text-gray-800">{modalDetalhes.chamado.descricao}</span></div>
            <div className="mb-2"><b className="text-black">Status:</b> <span className="text-gray-800">{modalDetalhes.chamado.status}</span></div>
            <div className="mb-2"><b className="text-black">Prioridade:</b> <span className="text-gray-800">{modalDetalhes.chamado.prioridade}</span></div>
            <div className="mb-2"><b className="text-black">Categoria:</b> <span className="text-gray-800">{modalDetalhes.chamado.categoria}</span></div>
            <div className="mb-2"><b className="text-black">Data de Criação:</b> <span className="text-gray-800">{modalDetalhes.chamado.dataCriacao}</span></div>
            <div className="mb-4"><b className="text-black">Respostas:</b></div>
            <div className="space-y-3 mb-4">
              {(modalDetalhes.chamado.respostas && modalDetalhes.chamado.respostas.length > 0) ? (
                modalDetalhes.chamado.respostas.map((resp, idx) => (
                  <div key={idx} className="bg-gray-100 rounded p-3">
                    <div className="text-sm text-gray-700 mb-1"><b>{resp.autorNome}</b> <span className="text-xs text-gray-500">{new Date(resp.data).toLocaleString()}</span></div>
                    <div className="text-gray-800">{resp.mensagem}</div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Nenhuma resposta ainda.</div>
              )}
            </div>
            {modalDetalhes.chamado.status !== 'fechado' && (
              <div className="mt-4">
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 h-24 text-gray-800"
                  value={respostaDetalhe}
                  onChange={e => setRespostaDetalhe(e.target.value)}
                  placeholder="Digite sua resposta..."
                  disabled={enviandoResposta}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModalDetalhes({open: false, chamado: null})} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-black">Fechar</button>
                  <button onClick={handleEnviarRespostaDetalhe} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={!respostaDetalhe.trim() || enviandoResposta}>Enviar Resposta</button>
                </div>
              </div>
            )}
            {modalDetalhes.chamado.status === 'fechado' && (
              <div className="flex justify-end mt-4">
                <button onClick={() => setModalDetalhes({open: false, chamado: null})} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-black">Fechar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chamados; 