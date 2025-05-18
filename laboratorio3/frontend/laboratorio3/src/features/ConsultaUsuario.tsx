// src/pages/ConsultaUsuarios.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
  Alert,
} from '@mui/material';
import Header from '../components/Header';

type TipoUsuario = 'Aluno' | 'Empresa';

type Usuario = {
  id: number;
  nome: string;
  email: string;
  cpf?: string;
  cnpj?: string;
  tipoUsuario: TipoUsuario;
};

const ConsultaUsuario: React.FC = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const resposta = await axios.get('http://localhost:3001/usuario');
        setUsuarios(resposta.data);
      } catch (erro) {
        setErro('Erro ao carregar usuários');
      }
    };
    carregarUsuarios();
  }, []);

  const handleEditar = (usuario: Usuario) => {
    navigate(`/usuario/edicao/${usuario.id}`);
  };

  const handleDeletar = (usuario: Usuario) => {
    navigate(`/usuario/exclusao/${usuario.id}`);
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Consulta de Usuários
        </Typography>

        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>CPF/CNPJ</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.id}</TableCell>
                <TableCell>{usuario.nome}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.cpf || usuario.cnpj}</TableCell>
                <TableCell>{usuario.tipoUsuario}</TableCell>
                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditar(usuario)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeletar(usuario)}
                    >
                      Deletar
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </>
  );
};

export default ConsultaUsuario;
