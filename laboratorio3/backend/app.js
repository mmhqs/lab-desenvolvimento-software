
const path = require('path');
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET || 'cleito_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 } 
}));

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3306', 'http://localhost:3001', 'http://127.0.0.1:5173', 'http://127.0.0.1:3001'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Rotas!!

const aluno = require('./Routes/aluno');
app.use('/aluno', aluno);

const usuario = require('./Routes/usuario');
app.use('/usuario', usuario);

const empresa = require('./Routes/empresaParceira');
app.use('/empresa', empresa);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});