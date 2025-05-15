import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Header from "../components/Header";
import { useState } from "react";

const CadastroVantagem = () => {
  const empresasParceiras = [
    { id: "empresa1", nome: "Empresa Alpha" },
    { id: "empresa2", nome: "Empresa Beta" },
    { id: "empresa3", nome: "Empresa Gama" },
  ];

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [custo, setCusto] = useState<number | "">("");
  const [empresa, setEmpresa] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dados = {
      nome,
      descricao,
      custo,
      empresa,
    };

    console.log("Vantagem cadastrada:", dados);
    // Aqui você pode integrar com seu backend
  };

  return (
    <>
      <Header />;
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#f5f5f5"
      >
        <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Cadastrar Vantagem
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nome"
              fullWidth
              margin="normal"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <TextField
              label="Descrição"
              fullWidth
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
              select
              label="Empresa Parceira"
              fullWidth
              margin="normal"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
            >
              {empresasParceiras.map((empresa) => (
                <MenuItem key={empresa.id} value={empresa.id}>
                  {empresa.nome}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Cadastrar
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default CadastroVantagem;
