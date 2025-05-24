import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { addChamado } from '../features/chamadoSlice';

interface ChamadoForm {
  titulo: string;
  descricao: string;
  prioridade: string;
  categoria: string;
}

const NovoChamado = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState<ChamadoForm>({
    titulo: '',
    descricao: '',
    prioridade: 'media',
    categoria: '',
  });

  const categorias = [
    'Hardware',
    'Software',
    'Rede',
    'Impressora',
    'Email',
    'Acesso',
    'Outros',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.user) return;
    const novoChamado = {
      id: Date.now().toString(),
      titulo: form.titulo,
      descricao: form.descricao,
      status: 'aberto',
      prioridade: form.prioridade,
      categoria: form.categoria,
      dataCriacao: new Date().toISOString().slice(0, 10),
      usuarioId: auth.user.id,
    };
    dispatch(addChamado(novoChamado));
    setForm({ titulo: '', descricao: '', prioridade: 'media', categoria: '' });
  };

  // Classes condicionais baseadas no tipo de usuário
  const containerClass = auth.user?.isAdmin
    ? "flex-1 min-h-screen bg-gray-900 p-6 flex items-center justify-center"
    : "flex-1 min-h-screen bg-gray-50 p-6 flex items-center justify-center";

  const cardClass = auth.user?.isAdmin
    ? "w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
    : "w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden";

  const headerClass = auth.user?.isAdmin
    ? "bg-blue-600 p-6"
    : "bg-blue-500 p-6";

  const inputClass = auth.user?.isAdmin
    ? "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";

  const labelClass = auth.user?.isAdmin
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

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className={labelClass}>
              Título
            </label>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className={inputClass}
              required
              placeholder="Digite um título para o chamado"
            />
          </div>

          <div>
            <label className={labelClass}>
              Descrição
            </label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              className={`${inputClass} h-32 resize-none`}
              required
              placeholder="Descreva detalhadamente o problema"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Prioridade
              </label>
              <select
                value={form.prioridade}
                onChange={(e) => setForm({ ...form, prioridade: e.target.value })}
                className={inputClass}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Categoria
              </label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className={inputClass}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => setForm({ titulo: '', descricao: '', prioridade: 'media', categoria: '' })}
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