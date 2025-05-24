import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../componentes/Sidebar';



const Layout = () => {
  return (
    <div className="min-h-screen flex ">
      <Sidebar />
      <div className="flex-1 ">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout; 