import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import Header from '../components/Header';

type Usuario = {
  id: number;
  nome: string;
  email: string;
  senha: string;
};

const EdicaoUsuario: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<Usuario>({
        id: 0,
        nome: '',
        email: '',
        senha: ''
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/usuario/${id}`, usuario);
            navigate('/usuario/consulta');
        } catch (error) {
            setError('Erro ao atualizar usuário');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUsuario(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <Header />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Editar Usuário
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Nome"
                        name="nome"
                        value={usuario.nome}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={usuario.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Senha"
                        name="senha"
                        type="password"
                        value={usuario.senha}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Salvar
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/home')}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default EdicaoUsuario; 