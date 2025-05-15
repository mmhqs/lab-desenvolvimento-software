// src/pages/ConsultaUsuarios.tsx
import React from 'react';
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

// Mock de usuários
const usuariosMock: Usuario[] = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    cpf: '123.456.789-00',
    tipoUsuario: 'Aluno',
  },
  {
    id: 2,
    nome: 'Empresa ABC',
    email: 'contato@empresa.com',
    cnpj: '12.345.678/0001-99',
    tipoUsuario: 'Empresa',
  },
];

const ConsultaUsuario: React.FC = () => {
  const handleEditar = (usuario: Usuario) => {
    alert(`Editar usuário: ${usuario.nome}`);
  };

  const handleDeletar = (usuario: Usuario) => {
    const confirmar = window.confirm(`Deseja realmente deletar ${usuario.nome}?`);
    if (confirmar) {
      alert(`Usuário ${usuario.nome} deletado.`);
      // Aqui você faria a chamada de deleção na API
    }
  };

  return (
    <>
    <Header />
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Consulta de Usuários
      </Typography>

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
          {usuariosMock.map((usuario) => (
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
