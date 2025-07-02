import React, { useState } from 'react';
import { createChamadoResponse } from '../services';
import { FaSpinner, FaCheck, FaExclamationTriangle, FaPaperclip } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

// Props esperadas pelo componente: ID do chamado e função callback após envio
interface Props {
  chamadoId: number | string;
  onRespostaEnviada: () => void;
}

// Componente de formulário para adicionar resposta a um chamado
const FormularioResposta: React.FC<Props> = ({ chamadoId, onRespostaEnviada }) => {
  // Estado para armazenar o texto da resposta e os arquivos anexados
  const [resposta, setResposta] = useState<{ texto: string; anexos: File[] }>({ texto: '', anexos: [] });
  // Estado para controlar o status do envio (idle, loading, success, error)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  // Estado para mensagem de erro
  const [errorMessage, setErrorMessage] = useState('');
  // Verifica se o usuário está online
  const isOnline = navigator.onLine;
  // Obtém informações do usuário autenticado via Redux
  const auth = useSelector((state: RootState) => state.auth);

  // Manipula a seleção de arquivos anexos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResposta({
        ...resposta,
        anexos: [...resposta.anexos, ...Array.from(e.target.files)],
      });
    }
  };

  // Remove um anexo da lista pelo índice
  const removeAnexo = (index: number) => {
    setResposta({
      ...resposta,
      anexos: resposta.anexos.filter((_, i) => i !== index),
    });
  };

  // Manipula o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Impede envio se não houver usuário, se já estiver enviando ou se o texto estiver vazio
    if (!auth.user?.id || status === 'loading' || !resposta.texto.trim()) return;

    // Impede envio se estiver offline
    if (!isOnline) {
      setErrorMessage('Você está offline. Conecte-se para enviar.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Monta o FormData para envio dos dados e anexos
      const formData = new FormData();
      formData.append('chamado_id', chamadoId.toString());
      formData.append('mensagem', resposta.texto);
      resposta.anexos.forEach((file) => {
        formData.append('anexos[]', file);
      });

      // Chama o serviço para enviar a resposta ao backend
      await createChamadoResponse(formData);
      // Limpa o formulário e exibe mensagem de sucesso
      setResposta({ texto: '', anexos: [] });
      setStatus('success');
      onRespostaEnviada();
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      // Em caso de erro, exibe mensagem
      setErrorMessage('Erro ao enviar resposta.');
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 mt-6 bg-gray-100 rounded">
      <h3 className="text-lg font-semibold mb-3">Adicionar Resposta</h3>

      {/* Mensagem de erro */}
      {status === 'error' && (
        <div className="mb-3 p-3 bg-red-100 text-red-800 rounded flex items-center">
          <FaExclamationTriangle className="mr-2" />
          {errorMessage}
        </div>
      )}
      {/* Mensagem de sucesso */}
      {status === 'success' && (
        <div className="mb-3 p-3 bg-green-100 text-green-800 rounded flex items-center">
          <FaCheck className="mr-2" />
          Resposta enviada com sucesso!
        </div>
      )}

      {/* Campo de texto da resposta */}
      <textarea
        className="w-full border border-gray-300 rounded-lg px-4 py-2 h-28 mb-3"
        placeholder="Digite sua resposta..."
        value={resposta.texto}
        onChange={(e) => setResposta({ ...resposta, texto: e.target.value })}
        required
      />

      {/* Input de arquivos (anexos) */}
      <input type="file" id="anexos" multiple onChange={handleFileChange} className="hidden" />
      <label htmlFor="anexos" className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 mb-2">
        <FaPaperclip className="mr-2" />
        Selecionar Anexos
      </label>

      {/* Lista de anexos selecionados */}
      {resposta.anexos.length > 0 && (
        <div className="mb-3 space-y-1">
          {resposta.anexos.map((file, i) => (
            <div key={i} className="flex justify-between text-sm text-gray-600">
              {file.name}
              <button type="button" onClick={() => removeAnexo(i)} className="text-red-500">Remover</button>
            </div>
          ))}
        </div>
      )}

      {/* Botão de envio */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`px-6 py-2 text-white rounded ${
            status === 'loading' ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {status === 'loading' ? (
            <span className="flex items-center"><FaSpinner className="animate-spin mr-2" /> Enviando...</span>
          ) : (
            'Enviar Resposta'
          )}
        </button>
      </div>
    </form>
  );
};

export default FormularioResposta;
