import "./App.css";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import Homepage from "./features/Homepage";
import Cadastro from "./features/CadastroUsuario";
import Login from "./features/Login";
import CadastroVantagem from "./features/CadastroVantagem";
import ResgateVantagem from "./features/ResgateVantagem";
import ExtratoAluno from "./features/ExtratoAluno";
import ConsultaUsuario from "./features/ConsultaUsuario";
import EdicaoUsuario from "./features/EdicaoUsuario";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ExtratoProfessor from "./features/ExtratoProfessor";
import EnvioMoedas from "./features/EnvioMoedas";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vantagem"
            element={
              <ProtectedRoute>
                <CadastroVantagem />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vantagem/resgate"
            element={
              <ProtectedRoute>
                <ResgateVantagem />
              </ProtectedRoute>
            }
          />

          <Route
            path="/extrato-aluno"
            element={
              <ProtectedRoute>
                <ExtratoAluno />
              </ProtectedRoute>
            }
          />

          <Route
            path="/professor/extrato"
            element={
              <ProtectedRoute>
                <ExtratoProfessor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/professor/envio-moedas"
            element={
              <ProtectedRoute>
                <EnvioMoedas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/usuario/consulta"
            element={
              <ProtectedRoute>
                <ConsultaUsuario />
              </ProtectedRoute>
            }
          />

          <Route
            path="/usuario/edicao/:id"
            element={
              <ProtectedRoute>
                <EdicaoUsuario />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
