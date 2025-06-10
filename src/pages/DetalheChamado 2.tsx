import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChamado, updateChamado } from '../services';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { toast } from 'react-toastify';

interface Resposta {
  autorId: string;
  autorNome: string;
  mensagem: string;
  data: string;
}

interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  categoria: string;
  dataCriacao: string;
  usuarioId: string;
  respostas?: Resposta[];
}

const DetalheChamado = () => {
  const { id } = useParams<{ id: string }>();
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [resposta, setResposta] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!id) return;
    getChamado(id)
      .then(res => setChamado(res.data))
      .catch(() => toast.error('Erro ao carregar chamado!'));
  }, [id]);

  const handleEnviarResposta = async () => {
    if (!chamado || !auth.user) return;
    setEnviando(true);
    const novaResposta: Resposta = {
      autorId: String(auth.user.id),
      autorNome: auth.user.name,
      mensagem: resposta,
      data: new Date().toISOString(),
    };
    const chamadoAtualizado = {
      ...chamado,
      respostas: [...(chamado.respostas || []), novaResposta],
    };
    try {
      await updateChamado(chamado.id, chamadoAtualizado);
      setChamado(chamadoAtualizado);
      setResposta('');
      toast.success('Resposta enviada com sucesso!');
    } catch {
      toast.error('Erro ao enviar resposta!');
    } finally {
      setEnviando(false);
    }
  };

  if (!chamado) {
    return <div className="flex-1 flex items-center justify-center min-h-screen">Carregando chamado...</div>;
  }

  // Classes condicionais baseadas no tipo de usuário
  const containerClass = auth.user?.tipo === 'admin'
    ? "flex-1 min-h-screen bg-gray-900 p-6 flex items-center justify-center"
    : "flex-1 min-h-screen bg-gray-100 p-6 flex items-center justify-center";

  const cardClass = auth.user?.tipo === 'admin'
    ? "w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
    : "w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden";

  const headerClass = auth.user?.tipo === 'admin'
    ? "bg-gray-900 p-6"
    : "bg-blue-500 p-6";

  const labelClass = auth.user?.tipo === 'admin'
    ? "text-gray-300"
    : "text-gray-800";

  const respostaBgClass = auth.user?.tipo === 'admin'
    ? "bg-gray-700 text-white"
    : "bg-gray-100 text-gray-800";

  const textareaClass = auth.user?.tipo === 'admin'
    ? "w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 h-24 text-white bg-gray-700"
    : "w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 h-24 text-gray-800";

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <div className={headerClass}>
          <h2 className="text-3xl font-bold text-center text-white">Detalhes do Chamado</h2>
        </div>
        <div className="p-8 space-y-4">
          <div className={labelClass}><b>Título:</b> {chamado.titulo}</div>
          <div className={labelClass}><b>Descrição:</b> {chamado.descricao}</div>
          <div className={labelClass}><b>Status:</b> {chamado.status}</div>
          <div className={labelClass}><b>Prioridade:</b> {chamado.prioridade}</div>
          <div className={labelClass}><b>Categoria:</b> {chamado.categoria}</div>
          <div className={labelClass}><b>Data de Criação:</b> {chamado.dataCriacao}</div>
          <div className={labelClass}>
            <b>Respostas:</b>
            <div className="space-y-3 mt-2">
              {(chamado.respostas && chamado.respostas.length > 0) ? (
                chamado.respostas.map((resp, idx) => (
                  <div key={idx} className={`${respostaBgClass} rounded p-3`}>
                    <div className="text-sm mb-1"><b>{resp.autorNome}</b> <span className="text-xs text-gray-400">{new Date(resp.data).toLocaleString()}</span></div>
                    <div>{resp.mensagem}</div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Nenhuma resposta ainda.</div>
              )}
            </div>
          </div>
          {chamado.status !== 'fechado' && (
            <div className="mt-4">
              <textarea
                className={textareaClass}
                value={resposta}
                onChange={e => setResposta(e.target.value)}
                placeholder="Digite sua resposta..."
                disabled={enviando}
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-black">Voltar</button>
                <button onClick={handleEnviarResposta} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={!resposta.trim() || enviando}>Enviar Resposta</button>
              </div>
            </div>
          )}
          {chamado.status === 'fechado' && (
            <div className="flex justify-end mt-4">
              <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-black">Voltar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalheChamado; 