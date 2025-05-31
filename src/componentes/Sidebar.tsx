import { Link } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import {  FaTicketAlt, FaPlus, FaUser, FaUsers, FaChartBar } from 'react-icons/fa';
import { RiLogoutBoxFill } from "react-icons/ri";
import { logout } from '../store/slices/authSlice';

const Sidebar = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const menuItems = auth.user?.isAdmin 
    ? [
        { to: "/dashboard", icon: <FaChartBar />, text: "Dashboard" },
        { to: "/usuarios", icon: <FaUsers />, text: "Usuários" },
        { to: "/chamados", icon: <FaTicketAlt />, text: "Chamados" },
      ]
    : [
        { to: "/chamados", icon: <FaTicketAlt />, text: "Meus Chamados" },
        { to: "/novo-chamado", icon: <FaPlus />, text: "Novo Chamado" },
      ];

  const nomePerfil = auth.user?.nome || 'Usuário';
  const fotoPerfil = auth.user?.foto || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div className="w-64 h-screen flex flex-col justify-between bg-gray-900 text-[#646cff] shrink-0 border-r border-gray-800 font-bold">
      <div className="flex flex-col">
        {/* Header/Profile Section */}
        <div className="p-6 text-center border-b border-gray-800">
          <div className="inline-block">
            <img
              src={fotoPerfil}
              alt="User"
              className="w-20 h-20 rounded-full mb-3 border-2 border-gray-700 p-1 object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold text-white font-bold">{nomePerfil}</h2>
          <p className="text-sm text-white">{auth.user?.cargo}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 justify-center">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.to}
                  className="flex items-center gap-3 px-4 py-3 text-[#646cff] rounded-lg hover:bg-gray-800 hover:text-white transition-all"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer com Meu Perfil e Logout lado a lado */}
      <div className="p-4 border-t border-gray-800 flex gap-2 items-center">
        <Link
          to="/perfil"
          className="flex-1 flex items-center gap-3 px-4 py-3 text-[#646cff] rounded-lg hover:bg-gray-800 hover:text-white transition-all justify-center"
        >
          <FaUser className="text-lg" />
          Meu Perfil
        </Link>
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center justify-center w-8 h-8 text-[#646cff] rounded-lg hover:bg-[#646cf0] hover:text-white transition-all"
          title="Sair"
        >
          <RiLogoutBoxFill className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;