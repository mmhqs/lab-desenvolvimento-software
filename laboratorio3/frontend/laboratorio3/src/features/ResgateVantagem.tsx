import { useState } from "react";
import Header from "../components/Header";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface Vantagem {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  custo: number;
}

const vantagensDisponiveis: Vantagem[] = [
  {
    id: 1,
    titulo: "Desconto em Restaurante",
    descricao: "20% de desconto em refeições no Restaurante X",
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg2oGaj2aelLlGLu092jD8WCkGURuQ4cv9FA&s",
    custo: 50,
  },
  {
    id: 2,
    titulo: "Material Escolar",
    descricao: "Kit completo de material escolar para seu filho",
    imagem: "https://static.vecteezy.com/system/resources/previews/025/221/322/non_2x/cartoon-student-cute-school-ai-generate-png.png",
    custo: 100,
  },
  {
    id: 3,
    titulo: "Cinema grátis",
    descricao: "Ingresso para uma sessão de cinema",
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEu3t22Es3Bt1MmPhb39FEKRbNkU2bJJTRhw&s",
    custo: 30,
  },
];

const ResgateVantagem: React.FC = () => {
  const [saldo, setSaldo] = useState<number>(120);
  const [vantagemSelecionada, setVantagemSelecionada] =
    useState<Vantagem | null>(null);
  const [mensagem, setMensagem] = useState<string>("");
  const [modalAberto, setModalAberto] = useState<boolean>(false);

  const handleSelecionar = (vantagem: Vantagem) => {
    setVantagemSelecionada(vantagem);
    setModalAberto(true);
  };

  const handleResgatar = () => {
    if (vantagemSelecionada) {
      if (saldo >= vantagemSelecionada.custo) {
        setSaldo(saldo - vantagemSelecionada.custo);
        setMensagem("Resgate realizado com sucesso!");
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
          {vantagensDisponiveis.map((vantagem) => (
            <Card
              key={vantagem.id}
              onClick={() => handleSelecionar(vantagem)}
              style={{ cursor: "pointer" }}
            >
              <CardMedia
                component="img"
                height="140"
                image={vantagem.imagem}
                alt={vantagem.titulo}
              />
              <CardContent>
                <Typography variant="h6">{vantagem.titulo}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {vantagem.descricao}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Custo: {vantagem.custo} pontos
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
                  {vantagemSelecionada.titulo}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {vantagemSelecionada.descricao}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Custo: {vantagemSelecionada.custo} pontos
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleResgatar}
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
    </>
  );
};

export default ResgateVantagem;
