import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import Header from '../components/Header';

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

const ExclusaoUsuario: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<Usuario>({
        id: 0,
        nome: '',
        email: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/usuario/${id}`);
                setUsuario(response.data);
            } catch (error) {
                setError('Erro ao carregar dados do usuário');
            }
        };
        fetchUsuario();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/usuario/${id}`);
            navigate('/usuario/consulta');
        } catch (error) {
            setError('Erro ao excluir usuário');
        }
    };

    return (
        <>
            <Header />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Excluir Usuário
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                <Card sx={{ mt: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Confirmação de Exclusão
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Tem certeza que deseja excluir o usuário {usuario.nome} ({usuario.email})?
                        </Typography>
                        <Typography variant="body2" color="error" paragraph>
                            Esta ação não pode ser desfeita!
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDelete}
                            >
                                Confirmar Exclusão
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/home')}
                            >
                                Cancelar
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
};

export default ExclusaoUsuario; 