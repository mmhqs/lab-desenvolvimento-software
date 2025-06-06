import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import Header from "../components/Header";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const CadastroVantagem = () => {
  const [descricao, setDescricao] = useState("");
  const [custo, setCusto] = useState<number | "">("");
  const [foto, setFoto] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);
  const { perfil } = useAuth();

  const cnpj = perfil.cnpj;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descricao || !custo || !foto || !cnpj) {
      setErrorMessage("Por favor, preencha todos os campos");
      setErrorAlert(true);
      return;
    }

    const dados = {
      descricao,
      custo_moedas: custo,
      foto,
    };

    try {
      await axios.post(
        `http://localhost:3001/empresa/vantagens/${cnpj}`,
        dados
      );
      setAlertOpen(true); // Mostra o alerta
      // Limpa os campos do formulário
      setDescricao("");
      setCusto("");
      setFoto("");
    } catch (error) {
      console.error("Erro ao cadastrar vantagem:", error);
    }
  };

  return (
    <>
      <Header />;
      <Box
        display="flex"
        flexDirection="column" // <-- empilha os filhos
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100%"
        bgcolor="#f5f5f5"
        px={2}
      >
        <Typography variant="h5" align="center" color="gray">
          Cadastrar Vantagem
        </Typography>
        <Box width="100%">
          <form onSubmit={handleSubmit}>
            <TextField
              label="Descrição"
              fullWidth
              required
              margin="normal"
              multiline
              minRows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
            <TextField
              label="Custo em moedas"
              type="number"
              fullWidth
              required
              margin="normal"
              value={custo}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (!isNaN(value) && value >= 0) {
                  setCusto(value);
                }
              }}
            />
            <TextField
              label="Link da foto"
              fullWidth
              required
              margin="normal"
              minRows={3}
              value={foto}
              onChange={(e) => setFoto(e.target.value)}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Cadastrar
            </Button>
          </form>
        </Box>
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
          Vantagem cadastrada com sucesso!
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

export default CadastroVantagem;
