import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { toast } from 'react-toastify';
import { createChamado } from '../services';

/**
 * Interface para o formulário de criação de chamado.
 */
interface ChamadoForm {
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  assunto: string;
}

/**
 * Página de criação de novo chamado.
 * Permite ao usuário ou administrador abrir um novo chamado no sistema.
 * O layout e as cores se adaptam conforme o tipo de usuário.
 */
const NovoChamado = () => {
  // Obtém informações do usuário autenticado
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // Estado do formulário do chamado
  const [form, setForm] = useState<ChamadoForm>({
    titulo: '',
    descricao: '',
    status: 'ABERTO',
    prioridade: 'baixo',
    assunto: '',
  });

  /**
   * Manipula o envio do formulário de novo chamado.
   * Valida os campos obrigatórios e envia para a API.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.user) {
      toast.error('Usuário não autenticado!');
      return;
    }
    if (!form.titulo || !form.descricao || !form.assunto) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    const novoChamado = {
      titulo: form.titulo,
      descricao: form.descricao,
      prioridade: form.prioridade,
      assunto: form.assunto,
      status: form.status,
      user_id: auth.user.id,
      data_abertura: new Date().toISOString().slice(0, 10),
    };

    try {
      await createChamado(novoChamado);
      setForm({
        titulo: '',
        descricao: '',
        status: '',
        prioridade: '',
        assunto: '',
      });
      toast.success('Chamado criado com sucesso!');
      navigate('/chamados');
    } catch (err: any) {
      if (err.response) {
        toast.error('Erro do servidor ao criar chamado!');
      } else if (err.request) {
        toast.error('Não foi possível conectar ao servidor!');
      } else {
        toast.error('Erro desconhecido ao criar chamado!');
      }
    }
  };

  // Classes de estilo dinâmicas conforme o tipo de usuário
  const containerClass = auth.user?.tipo === 'admin'
    ? "flex-1 min-h-screen bg-gray-900 p-6 flex items-center justify-center"
    : "flex-1 min-h-screen bg-gray-50 p-6 flex items-center justify-center";

  const cardClass = auth.user?.tipo === 'admin'
    ? "w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
    : "w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden";

  const headerClass = auth.user?.tipo === 'admin'
    ? "bg-blue-600 p-6"
    : "bg-blue-500 p-6";

  const inputClass = auth.user?.tipo === 'admin'
    ? "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";

  const labelClass = auth.user?.tipo === 'admin'
    ? "block text-sm font-semibold text-gray-300 mb-2"
    : "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <div className={headerClass}>
          <h2 className="text-3xl font-bold text-center text-white">
            Novo Chamado
          </h2>
        </div>

        {/* Formulário de criação de chamado */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className={labelClass}>Título</label>
            <input
              id='Titulo'
              type="text"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className={inputClass}
              required
              placeholder="Digite um título para o chamado"
            />
          </div>

          <div>
            <label className={labelClass}>Descrição</label>
            <textarea
              id='Descricao'
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              className={`${inputClass} h-32 resize-none`}
              required
              placeholder="Descreva detalhadamente o problema"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Prioridade</label>
              <select
                id='Prioridade'
                value={form.prioridade}
                onChange={(e) => setForm({ ...form, prioridade: e.target.value })}
                className={inputClass}
              >
                <option value="baixo">Baixa</option>
                <option value="medio">Média</option>
                <option value="alto">Alta</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Categoria</label>
              <select
                id='assunto'
                value={form.assunto}
                onChange={e => setForm({ ...form, assunto: e.target.value })}
                className={inputClass}
                required
              >
                <option value="">Selecione</option>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="rede">Rede</option>
                <option value="impressora">Impressora</option>
                <option value="email">Email</option>
                <option value="acesso">Acesso</option>
                <option value="outros">Outros</option>
              </select>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() =>
                setForm({
                  titulo: '',
                  descricao: '',
                  prioridade: '',
                  status: '',
                  assunto: '',
                })
              }
              className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105 hover:shadow-lg font-semibold text-sm uppercase tracking-wider"
            >
              Limpar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 hover:shadow-lg font-semibold text-sm uppercase tracking-wider"
            >
              Criar Chamado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoChamado;
