import './App.css'
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Homepage from './features/Homepage';
import Cadastro from './features/Cadastro';
import Login from './features/Login';
import CadastroVantagem from './features/CadastroVantagem';
import ResgateVantagem from './features/ResgateVantagem';
import ExtratoAluno from './features/ExtratoAluno';
import ConsultaUsuario from './features/ConsultaUsuario';
import EdicaoUsuario from './features/EdicaoUsuario';
import ExclusaoUsuario from './features/ExclusaoUsuario';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Homepage />} />
        <Route path="/cadastro" element={<Cadastro />} />
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