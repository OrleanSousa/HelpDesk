import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { FaEnvelope, FaIdBadge, FaCalendar, FaTicketAlt, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { updateProfile } from '../store/slices/authSlice';

const Perfil = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [novoNome, setNovoNome] = useState(auth.user?.nome || '');
  const [novaFoto, setNovaFoto] = useState<string | null>(auth.user?.foto || null);

  const [chamados, setChamados] = useState<any[]>([]);

  // Carregar chamados do usuário logado
  useEffect(() => {
    if (!auth.user) return;
    axios.get('http://localhost:3001/chamados')
      .then(res => {
        const filtrados = res.data.filter((c: any) => String(c.usuarioId) === String(auth.user?.id));
        setChamados(filtrados);
      })
      .catch(() => {});
  }, [auth.user]);

  const chamadosAbertos = chamados.filter((c: any) => c.status === 'aberto' || c.status === 'em_atendimento').length;
  const chamadosFechados = chamados.filter((c: any) => c.status === 'fechado').length;

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNovaFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvar = async () => {
    if (novoNome.trim() && auth.user) {
      await axios.patch(`http://localhost:3001/users/${auth.user.id}`, {
        nome: novoNome,
        foto: novaFoto || undefined,
      });

      dispatch(updateProfile({
        nome: novoNome,
        foto: novaFoto || undefined,
      }));

      setModalOpen(false);
    }
  };

  const estatisticas = {
    chamadosAbertos,
    chamadosFechados,
    ultimoAcesso: '2024-03-15 14:30', // Simulado
    dataCadastro: '2023-12-01',        // Simulado
  };

  const containerClass = auth.user?.isAdmin
    ? "flex-1 min-h-screen bg-gray-900 p-6"
    : "flex-1 min-h-screen bg-gray-100 p-6";

  const cardClass = auth.user?.isAdmin
    ? "bg-gray-800 rounded-xl shadow-2xl overflow-hidden mb-6"
    : "bg-white rounded-xl shadow-2xl overflow-hidden mb-6";

  const textClass = auth.user?.isAdmin ? "text-gray-300" : "text-gray-600";
  const titleClass = auth.user?.isAdmin ? "text-white" : "text-gray-800";
  const cardInfoClass = auth.user?.isAdmin ? "bg-gray-700" : "bg-gray-50";

  return (
    <div className={containerClass}>
      <div className="w-full max-w-4xl mx-auto">
        {/* Card Principal do Perfil */}
        <div className={cardClass}>
          <div className="bg-blue-600 p-6 relative flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white w-full text-center">Meu Perfil</h2>
            <button
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-100 transition absolute right-6"
              onClick={() => {
                setNovoNome(auth.user?.nome || '');
                setNovaFoto(auth.user?.foto || null);
                setModalOpen(true);
              }}
            >
              Editar Perfil
            </button>
          </div>

          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-blue-600 overflow-hidden mb-4">
                <img
                  src={auth.user?.foto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="Foto do Perfil"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className={`text-2xl font-bold ${titleClass}`}>{auth.user?.nome}</h3>
              <p className={textClass}>{auth.user?.cargo}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className={`flex items-center space-x-3 p-4 ${cardInfoClass} rounded-lg`}>
                  <FaEnvelope className="text-blue-500 text-xl" />
                  <div>
                    <p className={`text-sm ${textClass}`}>Email</p>
                    <p className={`font-medium ${titleClass}`}>{auth.user?.email}</p>
                  </div>
                </div>

                <div className={`flex items-center space-x-3 p-4 ${cardInfoClass} rounded-lg`}>
                  <FaIdBadge className="text-blue-500 text-xl" />
                  <div>
                    <p className={`text-sm ${textClass}`}>ID do Usuário</p>
                    <p className={`font-medium ${titleClass}`}>{auth.user?.id}</p>
                  </div>
                </div>

                <div className={`flex items-center space-x-3 p-4 ${cardInfoClass} rounded-lg`}>
                  <FaCalendar className="text-blue-500 text-xl" />
                  <div>
                    <p className={`text-sm ${textClass}`}>Data de Cadastro</p>
                    <p className={`font-medium ${titleClass}`}>{estatisticas.dataCadastro}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className={`flex items-center space-x-3 p-4 ${cardInfoClass} rounded-lg`}>
                  <FaTicketAlt className="text-green-500 text-xl" />
                  <div>
                    <p className={`text-sm ${textClass}`}>Chamados Abertos</p>
                    <p className={`font-medium ${titleClass}`}>{estatisticas.chamadosAbertos}</p>
                  </div>
                </div>

                <div className={`flex items-center space-x-3 p-4 ${cardInfoClass} rounded-lg`}>
                  <FaTicketAlt className="text-blue-500 text-xl" />
                  <div>
                    <p className={`text-sm ${textClass}`}>Chamados Fechados</p>
                    <p className={`font-medium ${titleClass}`}>{estatisticas.chamadosFechados}</p>
                  </div>
                </div>

                <div className={`flex items-center space-x-3 p-4 ${cardInfoClass} rounded-lg`}>
                  <FaClock className="text-blue-500 text-xl" />
                  <div>
                    <p className={`text-sm ${textClass}`}>Último Acesso</p>
                    <p className={`font-medium ${titleClass}`}>{estatisticas.ultimoAcesso}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de edição */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
              <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>

              <label className="block mb-2 font-semibold">Nome</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                value={novoNome}
                onChange={e => setNovoNome(e.target.value)}
              />

              <label className="block mb-2 font-semibold">Foto do Perfil</label>
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
                  onChange={handleFotoChange}
                />
                {novaFoto && (
                  <img src={novaFoto} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" />
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSalvar}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;
