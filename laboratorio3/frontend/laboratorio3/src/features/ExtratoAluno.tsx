// src/pages/HistoricoTransacoes.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  Divider,
} from '@mui/material';
import Header from '../components/Header';

type Transacao = {
  id: number;
  data: string; // ou Date
  quantidadeMoedas: number;
  mensagem: string;
  remetente: number;
  destinatario: number;
};

// Simulando o ID do aluno logado
const alunoId = 1;

// Mock de transações
const transacoesMock: Transacao[] = [
  {
    id: 1,
    data: '2025-05-01T10:00:00Z',
    quantidadeMoedas: 50,
    mensagem: 'Recompensa por atividade',
    remetente: 2,
    destinatario: 1,
  },
  {
    id: 2,
    data: '2025-05-03T14:30:00Z',
    quantidadeMoedas: 20,
    mensagem: 'Compra de adesivo',
    remetente: 1,
    destinatario: 3,
  },
];

const ExtratoAluno: React.FC = () => {
  return (
    <>
    <Header />
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Histórico de Transações
      </Typography>

      {transacoesMock.map((transacao) => {
        const isRecebida = transacao.destinatario === alunoId;
        const cor = isRecebida ? 'green' : 'red';
        const sinal = isRecebida ? '+' : '-';

        return (
          <Card key={transacao.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ color: cor }}>
                  {sinal}
                  {transacao.quantidadeMoedas} moedas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(transacao.data).toLocaleString('pt-BR')}
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ mt: 1 }}>
                {transacao.mensagem}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Typography variant="caption" color="text.secondary">
                {isRecebida
                  ? `De: Usuário ${transacao.remetente}`
                  : `Para: Usuário ${transacao.destinatario}`}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Container>
    </>
  );
};

export default ExtratoAluno;
