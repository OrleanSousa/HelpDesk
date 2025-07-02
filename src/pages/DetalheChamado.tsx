import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChamado, getChamadoResponses } from '../services';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import ListaRespostas from '../components/ListaRespostas';
import FormularioResposta from '../components/FormularioResposta';

/**
 * Interface para resposta do chamado.
 */
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

/**
 * Interface para chamado.
 */
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
  // Obtém o ID do chamado da URL
  const { id } = useParams<{ id: string }>();
  // Obtém informações do usuário autenticado
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  // Estado para armazenar os dados do chamado
  const [chamado, setChamado] = useState<Chamado | null>(null);
  // Estado para armazenar as respostas do chamado
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  // Estado de carregamento
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados do chamado
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

  // Função para buscar as respostas do chamado
  const fetchRespostas = async () => {
    if (!id) return;
    try {
      const response = await getChamadoResponses(id);
      setRespostas(response.data);
    } catch {
      setRespostas([]);
    }
  };

  // Busca os dados do chamado e respostas ao montar ou quando o ID mudar
  useEffect(() => {
    fetchChamado();
    fetchRespostas();
    // eslint-disable-next-line
  }, [id]);

  // Exibe tela de carregamento enquanto busca os dados
  if (loading || !chamado) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
          <span className="text-white text-lg font-semibold">Carregando chamado...</span>
        </div>
      </div>
    );
  }

  // Define classes de cor conforme o tipo de usuário (admin ou usuário comum)
  const isAdmin = auth.user?.tipo === 'admin';

  // Paleta de cores e estilos do projeto para admin e usuário
  const bgMain = isAdmin
    ? "bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800"
    : "bg-gradient-to-br from-blue-100 via-white to-gray-100";
  const cardBg = isAdmin ? "bg-gray-800/90" : "bg-white/90";
  const cardShadow = "shadow-2xl";
  const borderColor = isAdmin ? "border-gray-700" : "border-gray-200";
  const titleColor = isAdmin ? "text-white" : "text-blue-900";
  const labelColor = isAdmin ? "text-gray-300" : "text-gray-600";
  const valueColor = isAdmin ? "text-gray-200" : "text-gray-800";
  const descColor = isAdmin ? "text-gray-200" : "text-gray-700";
  const prioridadeColors = {
    alta: isAdmin
      ? "bg-red-700 text-red-100"
      : "bg-red-100 text-red-800 border border-red-200",
    media: isAdmin
      ? "bg-yellow-700 text-yellow-100"
      : "bg-yellow-100 text-yellow-800 border border-yellow-200",
    baixa: isAdmin
      ? "bg-green-700 text-green-100"
      : "bg-green-100 text-green-800 border border-green-200"
  };
  const statusColors = {
    aberto: isAdmin
      ? "bg-blue-700 text-blue-100"
      : "bg-blue-100 text-blue-800 border border-blue-200",
    em_atendimento: isAdmin
      ? "bg-yellow-700 text-yellow-100"
      : "bg-yellow-100 text-yellow-800 border border-yellow-200",
    resolvido: isAdmin
      ? "bg-green-700 text-green-100"
      : "bg-green-100 text-green-800 border border-green-200",
    fechado: isAdmin
      ? "bg-gray-700 text-gray-100"
      : "bg-gray-200 text-gray-800 border border-gray-300"
  };
  const btnBack = isAdmin
    ? "px-5 py-2 bg-blue-700 rounded-lg hover:bg-blue-600 text-white font-semibold shadow transition"
    : "px-5 py-2 bg-blue-100 rounded-lg hover:bg-blue-200 text-blue-900 font-semibold shadow transition";

  return (
    <div className={`flex-1 min-h-screen ${bgMain} p-4 md:p-6 overflow-auto`}>
      <div
        className={`max-w-2xl md:max-w-3xl mx-auto ${cardBg} rounded-xl ${cardShadow} border ${borderColor} backdrop-blur-md`}
      >
        {/* Header do chamado */}
        <div className={`p-4 md:p-6 border-b ${borderColor} flex flex-col md:flex-row md:items-center md:justify-between gap-3`}>
          <div>
            <h2 className={`text-xl md:text-2xl font-bold mb-2 ${titleColor}`}>{chamado.titulo}</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {/* Badge de prioridade */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${prioridadeColors[chamado.prioridade as keyof typeof prioridadeColors] || prioridadeColors.baixa}`}
              >
                Prioridade: {chamado.prioridade}
              </span>
              {/* Badge de status */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[chamado.status as keyof typeof statusColors] || statusColors.aberto}`}
              >
                Status: {chamado.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {/* Botão de voltar */}
            <button
              onClick={() => navigate(-1)}
              className={btnBack + " text-sm px-3 py-1"}
              title="Voltar"
            >
              ← Voltar
            </button>
            {/* Data de criação */}
            <span className={`text-xs ${labelColor}`}>
              Criado em: <span className={valueColor}>{new Date(chamado.dataCriacao).toLocaleString()}</span>
            </span>
          </div>
        </div>

        {/* Informações do chamado */}
        <div className={`p-4 md:p-6 border-b ${borderColor} grid grid-cols-1 md:grid-cols-2 gap-4`}>
          <div>
            <p>
              <span className={`font-semibold ${labelColor}`}>Solicitante:</span>{" "}
              <span className={valueColor}>{chamado.usuario?.nome ?? 'N/A'}</span>
            </p>
            <p>
              <span className={`font-semibold ${labelColor}`}>Setor:</span>{" "}
              <span className={valueColor}>{chamado.usuario?.setor ?? 'N/A'}</span>
            </p>
            <p>
              <span className={`font-semibold ${labelColor}`}>Categoria:</span>{" "}
              <span className={valueColor}>{chamado.categoria}</span>
            </p>
          </div>
          <div>
            <p>
              <span className={`font-semibold ${labelColor}`}>Descrição:</span>
              <span className={`block mt-1 ${descColor} whitespace-pre-line bg-gray-900/10 rounded-lg p-2 text-sm`}>
                {chamado.descricao}
              </span>
            </p>
          </div>
        </div>

        {/* Histórico de Respostas */}
        <div className={`p-4 md:p-2 border-b ${borderColor}`}>
          <h3 className={`text-base md:text-lg font-semibold mb-3 ${titleColor}`}>Histórico de Respostas</h3>
          {/* Lista de respostas do chamado */}
          <ListaRespostas respostas={respostas} />
        </div>

        {/* Formulário de resposta (se não estiver fechado) */}
        {chamado.status !== 'fechado' && (
          <div className="p-4 md:p-6">
            <FormularioResposta chamadoId={chamado.id} onRespostaEnviada={fetchRespostas} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalheChamado;