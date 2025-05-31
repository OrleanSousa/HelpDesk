import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  cargo: string;
  setor: string;
  isAdmin: boolean;
}

const EditarUsuario = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`http://localhost:3001/users/${id}`)
      .then(res => setUsuario(res.data))
      .catch(() => toast.error('Erro ao carregar usuário!'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!usuario) return;
    const { name, value, type, checked } = e.target;
    setUsuario({
      ...usuario,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    try {
      await axios.put(`http://localhost:3001/users/${usuario.id}`, usuario);
      toast.success('Usuário atualizado com sucesso!');
      navigate('/usuarios');
    } catch {
      toast.error('Erro ao atualizar usuário!');
    }
  };

  if (loading || !usuario) {
    return <div className="flex-1 flex items-center justify-center min-h-screen text-white">Carregando usuário...</div>;
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-900 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gray-900 p-6">
          <h2 className="text-3xl font-bold text-center text-white">Editar Usuário</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Nome</label>
            <input
              type="text"
              name="nome"
              value={usuario.nome}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={usuario.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Senha</label>
            <input
              type="password"
              name="senha"
              value={usuario.senha}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Cargo</label>
            <input
              type="text"
              name="cargo"
              value={usuario.cargo}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Setor</label>
            <input
              type="text"
              name="setor"
              value={usuario.setor}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAdmin"
              checked={usuario.isAdmin}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-300">Administrador</label>
          </div>
          <div className="flex justify-end gap-2 pt-6">
            <button
              type="button"
              onClick={() => navigate('/usuarios')}
              className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-semibold text-sm uppercase tracking-wider"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-sm uppercase tracking-wider"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarUsuario; 