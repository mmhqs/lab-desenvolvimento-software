import { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  Snackbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

interface Vantagem {
  id: number;
  descricao: string;
  foto: string;
  custo_moedas: number;
}

interface Aluno {
  id: number;
  usuario_id: number;
  cpf: string;
  rg: string;
  endereco: string;
  saldo_moedas: number;
}

const ResgateVantagem: React.FC = () => {
  const { user } = useAuth();
  const [alunoAtual, setAlunoAtual] = useState<Aluno | null>(null);
  const [saldo, setSaldo] = useState<number>(0);
  const [vantagemSelecionada, setVantagemSelecionada] =
    useState<Vantagem | null>(null);
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [mensagem, setMensagem] = useState<string>("");
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleSelecionar = (vantagem: Vantagem) => {
    setVantagemSelecionada(vantagem);
    setModalAberto(true);
  };

  /* Buscando as vantagens existentes */
  useEffect(() => {
    const buscarVantagens = async () => {
      try {
        const response = await axios.get<Vantagem[]>(
          "http://localhost:3001/empresa/vantagens/todas"
        );
        setVantagens(response.data);
      } catch (error) {
        console.error("Erro ao buscar vantagens:", error);
      }
    };

    buscarVantagens();
  }, []);

  /* Buscando o aluno logado */
  useEffect(() => {
    const buscarAlunos = async () => {
      try {
        const response = await axios.get<Aluno[]>(
          "http://localhost:3001/aluno"
        );

        const alunoEncontrado = response.data.find(
          (aluno) => aluno.usuario_id === user?.id
        );

        if (alunoEncontrado) {
          setAlunoAtual(alunoEncontrado);
        } else {
          console.warn("Nenhum aluno encontrado com o usuário_id fornecido.");
        }
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };

    buscarAlunos();
  }, []);

  /* Carregando saldo do aluno */
  useEffect(() => {
    if (alunoAtual?.saldo_moedas !== undefined) {
      setSaldo(alunoAtual.saldo_moedas);
    }
  }, [alunoAtual]);

  const cpf = alunoAtual?.cpf;

  const handleResgatar = async (idVantagem: number) => {
    if (vantagemSelecionada) {
      if (saldo >= vantagemSelecionada.custo_moedas) {
        setSaldo(saldo - vantagemSelecionada.custo_moedas);

        let dados = { id_vantagem: idVantagem };

        try {
          const response = await axios.post(
            `http://localhost:3001/aluno/resgatar-vantagem/${cpf}`,
            dados
          );
          setAlertOpen(true);
        } catch (error) {
          console.error("Erro ao resgatar vantagem:", error);
        }
      } else {
        setMensagem("Saldo insuficiente para resgatar esta vantagem.");
      }
      setModalAberto(false);
    }
  };
  return (
    <>
      <Header />

      <div style={{ padding: "24px" }}>
        <Typography variant="h4" marginTop={5}>
          Resgate de Vantagens
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Saldo disponível: <strong>{saldo}</strong> pontos
        </Typography>
        <div
          style={{
            display: "flex",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {vantagens.map((vantagem) => (
            <Card
              key={vantagem.id}
              onClick={() => handleSelecionar(vantagem)}
              style={{ cursor: "pointer", width: "20%" }}
            >
              <CardMedia
                component="img"
                height="140"
                image={vantagem.foto}
                alt={vantagem.descricao}
              />
              <CardContent>
                <Typography variant="h6">{vantagem.descricao}</Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="textSecondary"
                >
                  Custo: {vantagem.custo_moedas} pontos
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={modalAberto} onClose={() => setModalAberto(false)}>
          <DialogTitle>Deseja resgatar esta vantagem?</DialogTitle>
          <DialogContent>
            {vantagemSelecionada && (
              <div style={{ marginTop: "16px" }}>
                <Typography variant="h6">
                  {vantagemSelecionada.descricao}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Custo: {vantagemSelecionada.custo_moedas} pontos
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleResgatar(vantagemSelecionada.id)}
                  style={{ marginTop: "16px" }}
                >
                  Confirmar Resgate
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {mensagem && (
          <Typography variant="h6" align="center" style={{ marginTop: "24px" }}>
            {mensagem}
          </Typography>
        )}
      </div>
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
          Resgate concluído com sucesso! Confira seu novo saldo.
        </Alert>
      </Snackbar>
    </>
  );
};

export default ResgateVantagem;
