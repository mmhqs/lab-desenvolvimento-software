import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Aluno {
  id: number;
  nome: string;
  saldo_moedas: number;
}

const EnvioMoedas = () => {
  const navigate = useNavigate();
  const { user, perfil } = useAuth();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [quantidadeMoedas, setQuantidadeMoedas] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Verifica se o usuário é um professor
    if (!user || !perfil.departamento) {
      navigate("/home");
      return;
    }

    // Busca a lista de alunos
    const fetchAlunos = async () => {
      try {
        const response = await axios.get("http://localhost:3001/aluno");
        setAlunos(response.data);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        setErrorMessage("Erro ao carregar lista de alunos");
        setErrorAlert(true);
      }
    };

    fetchAlunos();
  }, [user, perfil, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAluno || !quantidadeMoedas || !justificativa) {
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
      // Atualiza o saldo do aluno
      await axios.patch(`http://localhost:3001/aluno/${selectedAluno.id}`, {
        saldo_moedas: selectedAluno.saldo_moedas + quantidade,
      });

      // Atualiza o saldo do professor
      await axios.patch(`http://localhost:3001/professor/${perfil.id}`, {
        saldo_moedas: perfil.saldo_moedas - quantidade,
      });

      // Registra a transação
      await axios.post("http://localhost:3001/transacao", {
        professor_id: perfil.id,
        aluno_id: selectedAluno.id,
        quantidade: quantidade,
        justificativa: justificativa,
      });

      setAlertOpen(true);
      setSelectedAluno(null);
      setQuantidadeMoedas("");
      setJustificativa("");

      // Atualiza a lista de alunos
      const response = await axios.get("http://localhost:3001/aluno");
      setAlunos(response.data);
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
            Envio de Moedas
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              select
              label="Aluno"
              fullWidth
              margin="normal"
              value={selectedAluno?.id || ""}
              onChange={(e) => {
                const aluno = alunos.find((a) => a.id === Number(e.target.value));
                setSelectedAluno(aluno || null);
              }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Selecione um aluno</option>
              {alunos.map((aluno) => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome} (Saldo: {aluno.saldo_moedas} moedas)
                </option>
              ))}
            </TextField>

            <TextField
              label="Quantidade de Moedas"
              type="number"
              fullWidth
              margin="normal"
              value={quantidadeMoedas}
              onChange={(e) => setQuantidadeMoedas(e.target.value)}
              inputProps={{ min: 1 }}
            />

            <TextField
              label="Justificativa"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Enviar Moedas
            </Button>
          </form>
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