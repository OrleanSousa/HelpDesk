import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { FaUser, FaEnvelope, FaIdBadge, FaCalendar, FaTicketAlt, FaClock } from 'react-icons/fa';

const Perfil = () => {
  const auth = useSelector((state: RootState) => state.auth);

  // Dados simulados de estatísticas do usuário (substitua por dados reais da API)
  const estatisticas = {
    chamadosAbertos: 5,
    chamadosFechados: 12,
    ultimoAcesso: '2024-03-15 14:30',
    dataCadastro: '2023-12-01',
  };

  // Classes condicionais baseadas no tipo de usuário
  const containerClass = auth.user?.isAdmin
    ? "flex-1 min-h-screen bg-gray-900 p-6"
    : "flex-1 min-h-screen bg-gray-100 p-6";

  const cardClass = auth.user?.isAdmin
    ? "bg-gray-800 rounded-xl shadow-2xl overflow-hidden mb-6"
    : "bg-white rounded-xl shadow-2xl overflow-hidden mb-6";

  const textClass = auth.user?.isAdmin
    ? "text-gray-300"
    : "text-gray-600";

  const titleClass = auth.user?.isAdmin
    ? "text-white"
    : "text-gray-800";

  const cardInfoClass = auth.user?.isAdmin
    ? "bg-gray-700"
    : "bg-gray-50";

  return (
    <div className={containerClass}>
      <div className="w-full max-w-4xl mx-auto">
        {/* Card Principal do Perfil */}
        <div className={cardClass}>
          <div className="bg-blue-600 p-6">
            <h2 className="text-3xl font-bold text-center text-white">
              Meu Perfil
            </h2>
          </div>

          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-blue-600 overflow-hidden mb-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
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
      </div>
    </div>
  );
};

export default Perfil; 