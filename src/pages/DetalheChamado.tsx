
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChamado, getChamadoResponses } from '../services';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import ListaRespostas from '../components/ListaRespostas';
import FormularioResposta from '../components/FormularioResposta';

interface Resposta {
  id: number;
  user_id: string;
  usuario_nome?: string;
  mensagem: string;
  created_at: string;
  anexos?: Array<{
    id: number;
    nome: string;
    url: string;
  }>;
}

interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  categoria: string;
  dataCriacao: string;
  usuario: {
    nome: string;
    setor: string;
  };
}

const DetalheChamado = () => {
  const { id } = useParams<{ id: string }>();
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChamado = async () => {
    if (!id) return;
    try {
      const response = await getChamado(id);
      setChamado(response.data);
    } catch {
      // erro tratado silenciosamente ou por toast externo
    } finally {
      setLoading(false);
    }
  };

  const fetchRespostas = async () => {
    if (!id) return;
    try {
      const response = await getChamadoResponses(id);
      setRespostas(response.data);
    } catch {
      setRespostas([]);
    }
  };

  useEffect(() => {
    fetchChamado();
    fetchRespostas();
  }, [id]);

  if (loading || !chamado) {
    return <div className="flex-1 flex items-center justify-center min-h-screen">Carregando chamado...</div>;
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-100 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{chamado.titulo}</h2>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                chamado.prioridade === 'alta' ? 'bg-red-100 text-red-800' :
                chamado.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {chamado.prioridade}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                chamado.status === 'aberto' ? 'bg-blue-100 text-blue-800' :
                chamado.status === 'em_atendimento' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {chamado.status}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><span className="font-semibold">Solicitante:</span> {chamado.usuario?.nome ?? 'N/A'}</p>
<p><span className="font-semibold">Setor:</span> {chamado.usuario?.setor ?? 'N/A'}</p>
            </div>
            <div>
              <p><span className="font-semibold">Categoria:</span> {chamado.categoria}</p>
              <p><span className="font-semibold">Data:</span> {new Date(chamado.dataCriacao).toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-700 whitespace-pre-line">{chamado.descricao}</p>
          </div>
        </div>

        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Histórico de Respostas</h3>
          <ListaRespostas respostas={respostas} />
        </div>

        {chamado.status !== 'fechado' && (
          <FormularioResposta chamadoId={chamado.id} onRespostaEnviada={fetchRespostas} />
        )}

        <div className="flex justify-end p-6">
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-black">Voltar</button>
        </div>
      </div>
    </div>
  );
};

export default DetalheChamado;
