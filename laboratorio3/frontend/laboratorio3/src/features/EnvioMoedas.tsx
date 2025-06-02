import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";

interface Aluno {
  usuario_id: number;
  nome: string;
  email: string;
  saldo_moedas: number;
  // outros campos...
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  // outros campos se necessário
}

const EnvioMoedas = () => {
  const { perfil } = useAuth();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [quantidadeMoedas, setQuantidadeMoedas] = useState("");
  const [motivo, setMotivo] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saldoAtual, setSaldoAtual] = useState(0);

  // Busca o saldo

  const buscarSaldoAtual = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/professor/${perfil.cpf}`
      );
      console.log("Saldo atualizado:", response.data);
      setSaldoAtual(response.data.saldo_moedas);
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
    }
  };

  useEffect(() => {
    buscarSaldoAtual();
  });

  // Busca a lista de alunos
  const fetchAlunos = async () => {
    try {
      const responseAluno = await axios.get("http://localhost:3001/aluno");
      const responseUsuario = await axios.get("http://localhost:3001/usuario");

      const alunos = responseAluno.data;
      const usuarios = responseUsuario.data;

      // 1. Criar um mapa de usuários por id
      const usuariosPorId = usuarios.reduce(
        (map: Record<number, Usuario>, usuario: Usuario) => {
          map[usuario.id] = usuario;
          return map;
        },
        {} as Record<number, Usuario>
      );

      // 2. Enriquecer os alunos com os dados do usuário
      const alunosComNome: Aluno[] = alunos.map((aluno: any) => ({
        ...aluno,
        nome: usuariosPorId[aluno.usuario_id]?.nome || "Desconhecido",
        email: usuariosPorId[aluno.usuario_id]?.email || "",
      }));

      setAlunos(alunosComNome);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      setErrorMessage("Erro ao carregar lista de alunos");
      setErrorAlert(true);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  useEffect(() => {
    console.log("Aluno selecionado:", selectedAluno);
    console.log("Alunos:", alunos);
  }, [selectedAluno, alunos]);

  // Limpa o formulário
  const limparFormulario = () => {
    setSelectedAluno(null);
    setQuantidadeMoedas("");
    setMotivo("");
  };

  const enviarMoedas = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAluno || !quantidadeMoedas || !motivo) {
      setErrorMessage("Por favor, preencha todos os campos");
      setErrorAlert(true);
      return;
    }

    const quantidade = parseInt(quantidadeMoedas);
    if (isNaN(quantidade) || quantidade <= 0) {
      setErrorMessage("Quantidade de moedas inválida");
      setErrorAlert(true);
      return;
    }

    try {
      // Registra a transação
      console.log("perfil.id: ", perfil.usuario_id);
      console.log("selectedAluno.usuario_id: ", selectedAluno.usuario_id);
      console.log("quantidade: ", quantidade);
      console.log("motivo: ", motivo);
      await axios.post("http://localhost:3001/professor/enviar-moedas", {
        professor_id: perfil.usuario_id,
        aluno_id: selectedAluno.usuario_id,
        quantidade: quantidade,
        motivo: motivo,
      });

      setAlertOpen(true);
      setSelectedAluno(null);
      setQuantidadeMoedas("");
      setMotivo("");
    } catch (error) {
      console.error("Erro ao enviar moedas:", error);
      setErrorMessage("Erro ao enviar moedas");
      setErrorAlert(true);
    }
  };

  return (
    <>
      <Header />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f5f5f5"
        pt={8}
      >
        <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Envio de moedas
          </Typography>

          {/* Saldo de moedas */}
          <Paper sx={{ p: 3, mb: 4, backgroundColor: "#2e2e2e" }}>
            <Typography variant="h6" gutterBottom color="white">
              Saldo atual:
            </Typography>
            <Typography variant="h6" gutterBottom color="white">
              <strong>{saldoAtual} moedas</strong>
            </Typography>
          </Paper>

          <form onSubmit={enviarMoedas}>
            <TextField
              select
              label="Aluno"
              fullWidth
              margin="normal"
              value={selectedAluno ? String(selectedAluno.usuario_id) : ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                const alunoSelecionado = alunos.find(
                  (aluno) => aluno.usuario_id === id
                );
                setSelectedAluno(alunoSelecionado ?? null);
              }}
            >
              <MenuItem value="" disabled>
                Selecione um aluno
              </MenuItem>
              {alunos.map((aluno) => (
                <MenuItem
                  key={aluno.usuario_id}
                  value={String(aluno.usuario_id)}
                >
                  {aluno.nome}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Quantidade de moedas"
              type="number"
              fullWidth
              margin="normal"
              value={quantidadeMoedas}
              onChange={(e) => {
                const valor = Number(e.target.value);
                if (valor >= 1 || e.target.value === "") {
                  setQuantidadeMoedas(e.target.value);
                }
              }}
              inputProps={{ min: 1 }}
            />

            <TextField
              label="Motivo do envio"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Enviar moedas
            </Button>
          </form>
          <Button
            type="submit"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={limparFormulario}
          >
            Limpar formulário
          </Button>
        </Paper>
      </Box>

      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Moedas enviadas com sucesso!
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorAlert}
        autoHideDuration={4000}
        onClose={() => setErrorAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorAlert(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EnvioMoedas;
