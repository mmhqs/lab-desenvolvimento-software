// src/pages/HistoricoTransacoes.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { Container, Typography, Paper, Box, Alert } from "@mui/material";
import Header from "../components/Header";
import { Send } from "react-feather";

interface Transacao {
  id: number;
  data: string;
  quantidade_moedas: number;
  mensagem: string;
  remetente_id: number;
  destinatario_id: number;
  remetente?: Usuario;
  destinatario?: Usuario;
}

type Usuario = {
  id: number;
  nome: string;
  // outros campos opcionais
};

const ExtratoProfessor = () => {
  const { perfil } = useAuth();
  const [saldo, setSaldo] = useState(0);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [erro, setErro] = useState("");

  const buscarSaldoAtual = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/professor/${perfil.cpf}`
      );
      console.log("Saldo atualizado:", response.data);
      setSaldo(response.data.saldo_moedas);
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
    }
  };

  useEffect(() => {
    buscarSaldoAtual();
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const responseTransacoes = await axios.get(
          `http://localhost:3001/transacao/remetente/${perfil.usuario_id}`
        );
        const transacoes = responseTransacoes.data;

        // 1. Coletar IDs únicos de usuários
        const idsUsuarios = [
          ...new Set(
            transacoes.flatMap((transacao: Transacao) => [
              transacao.remetente_id,
              transacao.destinatario_id,
            ])
          ),
        ];

        // 2. Buscar todos os usuários em paralelo
        const usuariosRespostas = await Promise.all(
          idsUsuarios.map((id) =>
            axios.get(`http://localhost:3001/usuario/${id}`).then((res) => ({
              id,
              ...res.data,
            }))
          )
        );

        // 3. Mapear usuários por ID
        const usuariosPorId: Record<number, Usuario> = {};
        usuariosRespostas.forEach((usuario) => {
          usuariosPorId[usuario.id] = usuario;
        });

        // 4. Enriquecer transações
const transacoesComUsuarios = transacoes.map((transacao: Transacao) => {
  const remetente = usuariosPorId[transacao.remetente_id];
  const destinatario = usuariosPorId[transacao.destinatario_id];

  return {
    ...transacao,
    remetente,
    destinatario,
    quantidade_moedas:-Math.abs(transacao.quantidade_moedas)
  };
});

        setTransacoes(transacoesComUsuarios);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    if (perfil?.cpf) {
      carregarDados();
    }
  }, [perfil]);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, mt: 10 }}>
          <Typography variant="h4" component="h1">
            Extrato de Moedas
          </Typography>
        </Box>

        {erro && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {erro}
          </Alert>
        )}
        {/* Saldo de moedas */}
        <Typography variant="h6" gutterBottom>
          Saldo atual
        </Typography>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {saldo} moedas
          </Typography>
        </Paper>

        {/* Lista de Transações */}
        <Typography variant="h6" gutterBottom>
          Transações Recentes
        </Typography>
        <Paper sx={{ p: 3, textAlign: "left" }}>
          {transacoes && transacoes.length > 0 ? (
            <Box component="ul" sx={{ listStyle: "none", pl: 0 }}>
              {transacoes
                .slice() // Cria uma cópia para evitar mutações no array original
                .sort(
                  (a, b) =>
                    new Date(b.data).getTime() - new Date(a.data).getTime()
                )
                .map((transacao) => (
                  <li key={transacao.id}>
                    <Box
                      sx={{
                        mb: 2,
                        p: 2,
                        border: "1px solid #ddd",
                        borderRadius: 2,
                      }}
                    >
                      {transacao.mensagem && (
                        <Typography
                          variant="body1"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "blue",
                          }}
                        >
                          <Send />
                          {transacao.mensagem}
                        </Typography>
                      )}
                      {transacao.destinatario && (
                        <Typography variant="body2" color="text.secondary">
                          Valor:{" "}
                          <strong>{transacao.quantidade_moedas} moedas</strong>
                          <br />
                          Para: <strong>{transacao.destinatario.nome}</strong>
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        Data: {new Date(transacao.data).toLocaleString()}
                      </Typography>
                    </Box>
                  </li>
                ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhuma transação encontrada.
            </Typography>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default ExtratoProfessor;
