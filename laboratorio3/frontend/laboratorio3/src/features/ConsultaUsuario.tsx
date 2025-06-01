// src/pages/ConsultaUsuarios.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@mui/material";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

type Empresa = {
  usuario_id: number;
  cnpj: string;
  vantagens: [];
};

type Aluno = {
  usuario_id: number;
  cpf: string;
  rg: string;
  endereco: string;
  saldo_moedas: number;
};

type UsuarioUnificado = {
  id: number;
  nome: string;
  email: string;
  tipo: "Aluno" | "Empresa" | "-";
  cpf?: string;
  cnpj?: string;
};

const ConsultaUsuario: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [erro, setErro] = useState("");
  const [usuariosUnificados, setUsuariosUnificados] = useState<
    UsuarioUnificado[]
  >([]);
const navigate = useNavigate();

  const carregarUsuarios = async () => {
    try {
      const resposta = await axios.get("http://localhost:3001/usuario");
      setUsuarios(resposta.data);
    } catch (erro) {
      setErro("Erro ao carregar usuários");
    }
  };

  const carregarEmpresas = async () => {
    try {
      const resposta = await axios.get("http://localhost:3001/empresa");
      setEmpresas(resposta.data);
    } catch (erro) {
      setErro("Erro ao carregar empresas");
    }
  };

  const carregarAlunos = async () => {
    try {
      const resposta = await axios.get("http://localhost:3001/aluno");
      setAlunos(resposta.data);
    } catch (erro) {
      setErro("Erro ao carregar alunos");
    }
  };

  const carregarTodosOsDados = async () => {
    await Promise.all([
      carregarUsuarios(),
      carregarEmpresas(),
      carregarAlunos(),
    ]);
  };

  useEffect(() => {
    carregarTodosOsDados();
  }, []);

  useEffect(() => {
    // Só monta se todos foram carregados
    if (usuarios.length && (alunos.length || empresas.length)) {
      const unificados: UsuarioUnificado[] = usuarios.map((usuario) => {
        const aluno = alunos.find((a) => a.usuario_id === usuario.id);
        const empresa = empresas.find((e) => e.usuario_id === usuario.id);

        if (aluno) {
          return {
            ...usuario,
            tipo: "Aluno" as const, // 🔑 importante!
            cpf: aluno.cpf,
          };
        } else if (empresa) {
          return {
            ...usuario,
            tipo: "Empresa" as const, // 🔑 importante!
            cnpj: empresa.cnpj,
          };
        } else {
          return {
            ...usuario,
            tipo: "-" as const,
          };
        }
      });

      setUsuariosUnificados(unificados);
    }
  }, [usuarios, alunos, empresas]);

  const handleEditar = (cnpj: string, usuarioId: number) => {};

  const handleDeletarEmpresa = async (cnpj: string, usuarioId: number) => {
    try {
      await axios.delete(`http://localhost:3001/empresa/${cnpj}`);
      await axios.delete(`http://localhost:3001/usuario/${usuarioId}`);
      await carregarTodosOsDados();
    } catch (error) {
      console.error("Erro ao deletar empresa:", error);
    }
  };

  const handleDeletarAluno = async (cpf: string, usuarioId: number) => {
    try {
      await axios.delete(`http://localhost:3001/empresa/${cpf}`);
      await axios.delete(`http://localhost:3001/usuario/${usuarioId}`);
      await carregarTodosOsDados();
    } catch (error) {
      console.error("Erro ao deletar aluno:", error);
    }
  };

  const handleDeletarUsuario = async (usuarioId: number) => {
    try {
      await axios.delete(`http://localhost:3001/usuario/${usuarioId}`);
      await carregarTodosOsDados();
    } catch (error) {
      console.error("Erro ao deletar aluno:", error);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Consulta de Usuários
        </Typography>

        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

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
            {usuariosUnificados.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.id}</TableCell>
                <TableCell>{usuario.nome}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.cpf || usuario.cnpj || "—"}</TableCell>
                <TableCell>{usuario.tipo}</TableCell>
                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    <Button variant="outlined" color="primary" onClick={() => navigate(`/usuario/edicao/${usuario.id}`)}>
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        if (
                          usuario.tipo === "Aluno" &&
                          usuario.cpf &&
                          usuario.id
                        ) {
                          handleDeletarAluno(usuario.cpf, usuario.id);
                        } else if (
                          usuario.tipo === "Empresa" &&
                          usuario.cnpj &&
                          usuario.id
                        ) {
                          handleDeletarEmpresa(usuario.cnpj, usuario.id);
                        } else {
                          handleDeletarUsuario(usuario.id);
                        }
                      }}
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
