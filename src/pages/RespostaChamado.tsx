import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useParams } from 'react-router-dom';

interface Resposta {
  texto: string;
  anexos: File[];
}

const RespostaChamado = () => {
  const { id } = useParams<{ id: string }>();
  const auth = useSelector((state: RootState) => state.auth);
  const [resposta, setResposta] = useState<Resposta>({
    texto: '',
    anexos: [],
  });

  // Mock do chamado (substituir por dados reais do backend)
  const chamado = {
    id,
    titulo: 'Problema com impressora',
    descricao: 'A impressora não está respondendo aos comandos de impressão.',
    status: 'em_atendimento',
    prioridade: 'media',
    categoria: 'Impressora',
    usuario: {
      nome: 'João Silva',
      setor: 'Financeiro',
    },
    dataCriacao: '2024-03-20T10:00:00',
    respostas: [
      {
        id: 1,
        texto: 'Por favor, verifique se a impressora está ligada e conectada à rede.',
        usuario: 'Suporte TI',
        data: '2024-03-20T10:30:00',
      },
    ],
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResposta({
        ...resposta,
        anexos: [...resposta.anexos, ...Array.from(e.target.files)],
      });
    }
  };

  const removeAnexo = (index: number) => {
    setResposta({
      ...resposta,
      anexos: resposta.anexos.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar a lógica de envio da resposta
    console.log('Nova resposta:', {
      chamadoId: id,
      usuarioId: auth.user?.id,
      ...resposta,
    });
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen overflow-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        {/* Cabeçalho do chamado */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{chamado.titulo}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              chamado.status === 'aberto' ? 'bg-blue-100 text-blue-800' :
              chamado.status === 'em_atendimento' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {chamado.status === 'aberto' ? 'Aberto' :
               chamado.status === 'em_atendimento' ? 'Em Atendimento' :
               'Resolvido'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><span className="font-semibold">Solicitante:</span> {chamado.usuario.nome}</p>
              <p><span className="font-semibold">Setor:</span> {chamado.usuario.setor}</p>
            </div>
            <div>
              <p><span className="font-semibold">Categoria:</span> {chamado.categoria}</p>
              <p><span className="font-semibold">Data:</span> {new Date(chamado.dataCriacao).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-gray-700">{chamado.descricao}</p>
          </div>
        </div>

        {/* Lista de respostas */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Histórico de Respostas</h3>
          <div className="space-y-4">
            {chamado.respostas.map((resp) => (
              <div key={resp.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{resp.usuario}</span>
                  <span className="text-sm text-gray-500">{new Date(resp.data).toLocaleString()}</span>
                </div>
                <p className="text-gray-700">{resp.texto}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulário de resposta */}
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-lg font-semibold mb-4">Adicionar Resposta</h3>
          
          <div className="mb-4">
            <textarea
              value={resposta.texto}
              onChange={(e) => setResposta({ ...resposta, texto: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua resposta..."
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anexos
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              className="hidden"
              id="anexos"
            />
            <label
              htmlFor="anexos"
              className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition"
            >
              Selecionar Arquivos
            </label>
            
            {resposta.anexos.length > 0 && (
              <div className="mt-2 space-y-2">
                {resposta.anexos.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAnexo(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Enviar Resposta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RespostaChamado; 