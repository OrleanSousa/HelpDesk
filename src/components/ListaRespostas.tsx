import React from 'react';

/**
 * Interface que representa uma resposta de chamado.
 * Inclui informações do usuário, mensagem, data e anexos.
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
 * Props esperadas pelo componente ListaRespostas.
 * Recebe um array de respostas para exibir.
 */
interface Props {
  respostas: Resposta[];
}

/**
 * Componente ListaRespostas
 *
 * Exibe uma lista de respostas de um chamado, mostrando o nome do usuário,
 * a mensagem, a data e os anexos enviados (se houver).
 *
 * - Se não houver respostas, exibe uma mensagem informativa.
 * - Para cada resposta, mostra o nome do usuário (ou ID), data formatada,
 *   mensagem e links para download dos anexos.
 */
const ListaRespostas: React.FC<Props> = ({ respostas }) => {
  // Se não há respostas, mostra mensagem padrão
  if (!respostas.length) {
    return <div className="text-gray-500">Nenhuma resposta ainda.</div>;
  }

  return (
    <div className="space-y-2">
      {respostas.map((resp) => (
        <div key={resp.id} className="bg-gray-50 rounded-lg p-2">
          <div className="flex justify-between items-center mb-2">
            {/* Nome do usuário ou ID */}
            <span className="font-semibold">{resp.usuario_nome || `Usuário #${resp.user_id}`}</span>
            {/* Data da resposta formatada */}
            <span className="text-sm text-gray-500">{new Date(resp.created_at).toLocaleString()}</span>
          </div>
          {/* Mensagem da resposta */}
          <p className="text-gray-700 whitespace-pre-line mb-3">{resp.mensagem}</p>
          {/* Lista de anexos, se houver */}
          {resp.anexos && resp.anexos.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-500 mb-1">Anexos:</p>
              <div className="flex flex-wrap gap-2">
                {resp.anexos.map((anexo) => (
                  <a
                    key={anexo.id}
                    href={anexo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-blue-600 hover:bg-gray-50"
                  >
                    📎 {anexo.nome}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListaRespostas;
