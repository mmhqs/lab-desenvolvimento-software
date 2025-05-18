// src/pages/HistoricoTransacoes.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
    Container, 
    Typography, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Box,
    Button,
    Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Header from '../components/Header';

interface Transacao {
    id: number;
    data: string;
    quantidadeMoedas: number;
    mensagem: string;
    remetente: string;
    destinatario: string;
}

const ExtratoAluno = () => {
    const navigate = useNavigate();
    const { perfil } = useAuth();
    const [saldo, setSaldo] = useState(0);
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [erro, setErro] = useState('');

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const responseSaldo = await axios.get(`http://localhost:3001/aluno/${perfil.cpf}/saldo`);
                setSaldo(responseSaldo.data.saldo_moedas);

                const responseTransacoes = await axios.get(`http://localhost:3001/aluno/${perfil.cpf}/transacoes`);
                setTransacoes(responseTransacoes.data);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };

        if (perfil?.cpf) {
            carregarDados();
        }
    }, [perfil]);

    const formatarData = (dataString: string) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/home')}
                        sx={{ mr: 2 }}
                    >
                        Voltar
                    </Button>
                    <Typography variant="h4" component="h1">
                        Extrato de Moedas
                    </Typography>
                </Box>

                {erro && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {erro}
                    </Alert>
                )}

                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Saldo Atual: {saldo} moedas
                    </Typography>
                </Paper>

                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Histórico de Transações
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Data</TableCell>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell align="right">Quantidade</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transacoes.map((transacao) => (
                                    <TableRow key={transacao.id}>
                                        <TableCell>{formatarData(transacao.data)}</TableCell>
                                        <TableCell>{transacao.mensagem}</TableCell>
                                        <TableCell 
                                            align="right"
                                            sx={{ 
                                                color: transacao.destinatario === perfil.cpf ? 'success.main' : 'error.main',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {transacao.destinatario === perfil.cpf ? '+' : '-'}
                                            {transacao.quantidadeMoedas}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>
        </>
    );
};

export default ExtratoAluno;
