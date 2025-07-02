import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { createUser } from '../services';

/**
 * Interface que representa os dados do novo usuário a ser cadastrado.
 */
interface NovoUsuario {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmarPassword: string;
  cargo: string;
  setor: string;
  tipo: string;
}

/**
 * Página de Cadastro de Usuário
 * 
 * Permite ao administrador cadastrar um novo usuário no sistema.
 * Possui validação de senha, confirmação de senha, seleção de cargo, setor e tipo de usuário.
 * Exibe feedback visual para validação e utiliza toast para mensagens de sucesso/erro.
 */
const Cadastro = () => {
  const navigate = useNavigate();

  // Estado do formulário de cadastro
  const [form, setForm] = useState<NovoUsuario>({
    id: '',
    name: '',
    email: '',
    password: '',
    confirmarPassword: '',
    cargo: '',
    setor: '',
    tipo: 'user',
  });

  // Estado para mostrar/ocultar senha
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmarPassword, setShowConfirmarPassworda] = useState(false);

  /**
   * Manipula o envio do formulário de cadastro.
   * Valida se as senhas coincidem e chama o serviço de criação de usuário.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmarPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }
    const novoUsuario = {
      id: form.id,
      name: form.name,
      email: form.email,
      password: form.password,
      cargo: form.cargo,
      setor: form.setor,
      tipo: form.tipo,
    };
    try {
      await createUser(novoUsuario);
      toast.success('Usuário cadastrado com sucesso!');
      navigate('/usuarios');
    } catch (err) {
      toast.error('Erro ao cadastrar usuário!');
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-900 p-6">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Cadastrar Novo Usuário</h2>
          </div>

          {/* Formulário de cadastro */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Campo Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Campo Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Campo Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  {/* Botão para mostrar/ocultar senha */}
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Campo Confirmar Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmarPassword ? "text" : "password"}
                    value={form.confirmarPassword}
                    onChange={(e) => setForm({ ...form, confirmarPassword: e.target.value })}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  {/* Botão para mostrar/ocultar confirmação de senha */}
                  <button
                    type="button"
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowConfirmarPassworda((v) => !v)}
                    tabIndex={-1}
                  >
                    {showConfirmarPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {/* Ícone de validação de senha */}
                  {form.confirmarPassword && (
                    form.password === form.confirmarPassword ? (
                      <FaCheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500" />
                    ) : (
                      <FaTimesCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500" />
                    )
                  )}
                </div>
              </div>

              {/* Campo Cargo */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Cargo
                </label>
                <input
                  type="text"
                  value={form.cargo}
                  onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Campo Setor */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Setor
                </label>
                <input
                  type="text"
                  value={form.setor}
                  onChange={(e) => setForm({ ...form, setor: e.target.value })}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Seleção do tipo de usuário */}
            <div className="flex items-center">
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => navigate('/usuarios')}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;