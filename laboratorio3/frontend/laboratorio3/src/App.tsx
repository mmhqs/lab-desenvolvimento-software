import './App.css'
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Homepage from './features/Homepage';
import Cadastro from './features/Cadastro';
import Login from './features/Login';
import CadastroVantagem from './features/CadastroVantagem';
import ResgateVantagem from './features/ResgateVantagem';
import ExtratoAluno from './features/ExtratoAluno';

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
      </Routes>
    </BrowserRouter>
  );
};

export default App;