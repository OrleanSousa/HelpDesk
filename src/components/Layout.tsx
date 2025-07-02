import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

/**
 * Componente Layout
 *
 * Este componente define a estrutura principal da aplicação.
 * Ele exibe a Sidebar (menu lateral) fixa e, ao lado, o conteúdo da página atual.
 * O conteúdo da página é renderizado pelo <Outlet />, que representa a rota filha ativa.
 *
 * Uso:
 * - Envolva as rotas protegidas ou principais com o Layout para garantir navegação consistente.
 * - O Layout garante que todas as páginas tenham o menu lateral e o conteúdo centralizado.
 */
const Layout = () => {
  return (
    <div className="min-h-screen flex ">
      {/* Menu lateral de navegação */}
      <Sidebar />
      {/* Área principal onde as páginas são renderizadas */}
      <div className="flex-1 ">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;