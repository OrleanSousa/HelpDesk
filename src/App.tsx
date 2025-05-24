import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chamados from './pages/Chamados';
import NovoChamado from './pages/NovoChamado';
import Usuarios from './pages/Usuarios';
import Cadastro from './pages/Cadastro';
import Perfil from './pages/Perfil';

const App = () => {
  const auth = useAuth();

  // Função para verificar se o usuário está autenticado
  const RequireAuth = ({ children }: { children: JSX.Element }) => {
    if (!auth.isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  // Função para redirecionar admin e usuário normal para páginas diferentes
  const HomeRedirect = () => {
    if (!auth.isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return auth.user?.isAdmin ? <Navigate to="/dashboard" /> : <Navigate to="/chamados" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          auth.isAuthenticated ? <Navigate to="/" /> : <Login />
        } />
        <Route path="/" element={<HomeRedirect />} />
        
        <Route path="/" element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }>
          {/* Rotas protegidas */}
          <Route path="dashboard" element={
            <RequireAuth>
              {auth.user?.isAdmin ? <Dashboard /> : <Navigate to="/chamados" />}
            </RequireAuth>
          } />
          <Route path="chamados" element={
            <RequireAuth>
              <Chamados />
            </RequireAuth>
          } />
          <Route path="novo-chamado" element={
            <RequireAuth>
              <NovoChamado />
            </RequireAuth>
          } />
          <Route path="usuarios" element={
            <RequireAuth>
              {auth.user?.isAdmin ? <Usuarios /> : <Navigate to="/chamados" />}
            </RequireAuth>
          } />
          <Route path="cadastro" element={
            <RequireAuth>
              {auth.user?.isAdmin ? <Cadastro /> : <Navigate to="/chamados" />}
            </RequireAuth>
          } />
          <Route path="perfil" element={
            <RequireAuth>
              <Perfil />
            </RequireAuth>
          } />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;