import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import HeaderDeslogado from "../components/HeaderDeslogado";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/home");
    } catch (error: any) {
      setError(error.response?.data?.error || "Erro ao fazer login");
    }
  };

  return (
    <>
      <HeaderDeslogado />
      <Box bgcolor="#f5f5f5">
        <Paper elevation={3} sx={{ padding: 4, width: 300 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Entrar
            </Button>
          </form>
        <Typography marginTop={10}>Ainda não tem conta? Faça o cadastro <a href="http://localhost:5173/cadastro">aqui</a></Typography>
        </Paper>

      </Box>
    </>
  );
};

export default Login;
