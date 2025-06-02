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
import HeaderDeslogado from "../components/HeaderDeslogado";

interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

interface DadosUsuario {
  nome: string;
  email: string;
  senha: string;
}

interface DadosAluno {
  cpf: string;
  usuario_id: number;
  rg: string;
  endereco: string;
  saldo_moedas: number;
}

interface DadosEmpresa {
  usuario_id: number;
  cnpj: string;
}

interface DadosProfessor {
  usuario_id: number;
  cpf: string;
  departamento: string;
  saldo_moedas: number;
}

const CadastroUsuario = () => {
  const [tipoUsuario, setTipoUsuario] = useState("aluno");
  const [alertOpen, setAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    rg: "",
    endereco: "",
    cnpj: "",
    departamento: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleCpfChange = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    // Limita a 11 dígitos
    const formattedCpf = numbers.slice(0, 11);
    handleChange("cpf", formattedCpf);
  };

  const handleRgChange = (value: string) => {
    // Permite letras e números, limita a 10 caracteres
    const formattedRg = value.slice(0, 10);
    handleChange("rg", formattedRg);
  };

  const handleCnpjChange = (value: string) => {
    // Permite letras e números, limita a 15 caracteres
    const formattedCnpj = value.slice(0, 15);
    handleChange("cnpj", formattedCnpj);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dadosUsuario: DadosUsuario = {
      nome: form.nome,
      email: form.email,
      senha: form.senha,
    };

    try {
      const responseUsuario = await axios.post<UsuarioResponse>(
        `http://localhost:3001/usuario`,
        dadosUsuario
      );
      const usuarioId = responseUsuario.data.id;

      if (tipoUsuario === "aluno") {
        const dadosAluno: DadosAluno = {
          cpf: form.cpf,
          usuario_id: usuarioId,
          rg: form.rg,
          endereco: form.endereco,
          saldo_moedas: 0,
        };

        await axios.post(`http://localhost:3001/aluno`, dadosAluno);
      } else if (tipoUsuario === "empresa") {
        const dadosEmpresa: DadosEmpresa = {
          usuario_id: usuarioId,
          cnpj: form.cnpj,
        };

        await axios.post(`http://localhost:3001/empresa`, dadosEmpresa);
      } else if (tipoUsuario === "professor") {
        const dadosProfessor: DadosProfessor = {
          usuario_id: usuarioId,
          cpf: form.cpf,
          departamento: form.departamento,
          saldo_moedas: 0
        };

        await axios.post(`http://localhost:3001/professor`, dadosProfessor);
      }

      setAlertOpen(true);
      setForm({
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        rg: "",
        endereco: "",
        cnpj: "",
        departamento: "",
      });
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setErrorMessage("Já existe um usuário cadastrado com este CPF.");
        } else if (error.response?.status === 400) {
          setErrorMessage(error.response.data.error || "Erro ao cadastrar usuário.");
        } else {
          setErrorMessage("Erro ao cadastrar usuário. Por favor, tente novamente.");
        }
      } else {
        setErrorMessage("Erro ao cadastrar usuário. Por favor, tente novamente.");
      }
      setErrorOpen(true);
    }
  };

  return (
    <>
      <HeaderDeslogado />
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
              <MenuItem value="professor">Professor</MenuItem>
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
                  onChange={(e) => handleCpfChange(e.target.value)}
                  inputProps={{ maxLength: 11 }}
                  helperText="Digite apenas números (máximo 11 dígitos)"
                />
                <TextField
                  label="RG"
                  fullWidth
                  margin="normal"
                  value={form.rg}
                  onChange={(e) => handleRgChange(e.target.value)}
                  inputProps={{ maxLength: 10 }}
                  helperText="Digite até 10 caracteres (letras ou números)"
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
                onChange={(e) => handleCnpjChange(e.target.value)}
                inputProps={{ maxLength: 15 }}
                helperText="Digite até 15 caracteres (letras ou números)"
              />
            )}

            {tipoUsuario === "professor" && (
              <>
                <TextField
                  label="CPF"
                  fullWidth
                  margin="normal"
                  value={form.cpf}
                  onChange={(e) => handleCpfChange(e.target.value)}
                  inputProps={{ maxLength: 11 }}
                  helperText="Digite apenas números (máximo 11 dígitos)"
                />
                <TextField
                  label="Departamento"
                  fullWidth
                  margin="normal"
                  value={form.departamento}
                  onChange={(e) => handleChange("departamento", e.target.value)}
                />
              </>
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
      <Snackbar
        open={errorOpen}
        autoHideDuration={4000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CadastroUsuario;
