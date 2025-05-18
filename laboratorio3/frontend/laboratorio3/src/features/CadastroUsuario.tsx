import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

interface UsuarioResponse {
  id: 7;
  nome: "Gisleine";
  email: "gisleine@email.com";
  senha: "12345";
}

const CadastroUsuario = () => {
  const [tipoUsuario, setTipoUsuario] = useState("aluno");
  const [alertOpen, setAlertOpen] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    rg: "",
    endereco: "",
    cnpj: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let dadosUsuario: any = {
      nome: form.nome,
      email: form.email,
      senha: form.senha,
    };

    console.log("Dados de cadastro:", dadosUsuario);

    let dadosAluno: any;
    let dadosEmpresa: any;

    try {
      const responseUsuario = await axios.post<UsuarioResponse>(
        `http://localhost:3001/usuario`,
        dadosUsuario
      );
      const usuarioId = responseUsuario.data.id;

      dadosAluno = {
        cpf: form.cpf,
        usuario_id: usuarioId,
        rg: form.rg,
        endereco: form.endereco,
        saldo_moedas: 0,
      };

      dadosEmpresa = {
        usuario_id: usuarioId,
        cnpj: form.cnpj,
      };
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }

    if (tipoUsuario == "aluno") {
      try {
        const responseAluno = await axios.post(
          `http://localhost:3001/aluno`,
          dadosAluno
        );
        setAlertOpen(true); // Mostra o alerta

        setForm({
          nome: "",
          email: "",
          senha: "",
          cpf: "",
          rg: "",
          endereco: "",
          cnpj: "",
        });
      } catch (error) {
        console.error("Erro ao cadastrar aluno:", error);
      }
    } else {
      try {
        const responseEmpresa = await axios.post(
          `http://localhost:3001/empresa`,
          dadosEmpresa
        );
        setAlertOpen(true); // Mostra o alerta

        setForm({
          nome: "",
          email: "",
          senha: "",
          cpf: "",
          rg: "",
          endereco: "",
          cnpj: "",
        });
      } catch (error) {
        console.error("Erro ao cadastrar empresa:", error);
      }
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#f5f5f5"
      >
        <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Cadastro de Usuário
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel id="tipo-label">Tipo de Usuário</InputLabel>
            <Select
              labelId="tipo-label"
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
              label="Tipo de Usuário"
            >
              <MenuItem value="aluno">Aluno</MenuItem>
              <MenuItem value="empresa">Empresa</MenuItem>
            </Select>
          </FormControl>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Nome"
              fullWidth
              margin="normal"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <TextField
              label="Senha"
              type="password"
              fullWidth
              margin="normal"
              value={form.senha}
              onChange={(e) => handleChange("senha", e.target.value)}
            />

            {tipoUsuario === "aluno" && (
              <>
                <TextField
                  label="CPF"
                  fullWidth
                  margin="normal"
                  value={form.cpf}
                  onChange={(e) => handleChange("cpf", e.target.value)}
                />
                <TextField
                  label="RG"
                  fullWidth
                  margin="normal"
                  value={form.rg}
                  onChange={(e) => handleChange("rg", e.target.value)}
                />
                <TextField
                  label="Endereço"
                  fullWidth
                  margin="normal"
                  value={form.endereco}
                  onChange={(e) => handleChange("endereco", e.target.value)}
                />
              </>
            )}

            {tipoUsuario === "empresa" && (
              <TextField
                label="CNPJ"
                fullWidth
                margin="normal"
                value={form.cnpj}
                onChange={(e) => handleChange("cnpj", e.target.value)}
              />
            )}

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Cadastrar
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
          Usuário cadastrado com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CadastroUsuario;
