import './App.css'
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import Homepage from './features/Homepage';
import Cadastro from './features/Cadastro';
import Login from './features/Login';
import CadastroVantagem from './features/CadastroVantagem';
import ResgateVantagem from './features/ResgateVantagem';
import ExtratoAluno from './features/ExtratoAluno';
import ConsultaUsuario from './features/ConsultaUsuario';
import EdicaoUsuario from './features/EdicaoUsuario';
import ExclusaoUsuario from './features/ExclusaoUsuario';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          
          <Route path="/home" element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          } />
          
          <Route path="/vantagem" element={
            <ProtectedRoute>
              <CadastroVantagem />
            </ProtectedRoute>
          } />
          
          <Route path="/vantagem/resgate" element={
            <ProtectedRoute>
              <ResgateVantagem />
            </ProtectedRoute>
          } />
          
          <Route path="/extrato" element={
            <ProtectedRoute>
              <ExtratoAluno />
            </ProtectedRoute>
          } />
          
          <Route path="/usuario/consulta" element={
            <ProtectedRoute>
              <ConsultaUsuario />
            </ProtectedRoute>
          } />
          
          <Route path="/usuario/edicao/:id" element={
            <ProtectedRoute>
              <EdicaoUsuario />
            </ProtectedRoute>
          } />
          
          <Route path="/usuario/exclusao/:id" element={
            <ProtectedRoute>
              <ExclusaoUsuario />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;