import './App.css'
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import Homepage from './features/Homepage';
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
import CadastroUsuario from './features/CadastroUsuario';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Homepage />} />
        <Route path="/cadastro" element={<CadastroUsuario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vantagem" element={<CadastroVantagem />} />
        <Route path="/vantagem/resgate" element={<ResgateVantagem />} />
        <Route path="/extrato" element={<ExtratoAluno />} />
        <Route path="/usuario/consulta" element={<ConsultaUsuario />} />
        <Route path="/usuario/edicao/:id" element={<EdicaoUsuario />} />
        <Route path="/usuario/exclusao/:id" element={<ExclusaoUsuario />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;