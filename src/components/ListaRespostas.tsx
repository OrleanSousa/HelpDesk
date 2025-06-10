import React from 'react';

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

interface Props {
  respostas: Resposta[];
}

const ListaRespostas: React.FC<Props> = ({ respostas }) => {
  if (!respostas.length) {
    return <div className="text-gray-500">Nenhuma resposta ainda.</div>;
  }

  return (
    <div className="space-y-4">
      {respostas.map((resp) => (
        <div key={resp.id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">{resp.usuario_nome || `Usuário #${resp.user_id}`}</span>
            <span className="text-sm text-gray-500">{new Date(resp.created_at).toLocaleString()}</span>
          </div>
          <p className="text-gray-700 whitespace-pre-line mb-3">{resp.mensagem}</p>
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
