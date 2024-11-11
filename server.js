// server.js
const express = require('express');
const cors = require('cors');  // Permite controle de CORS
const morgan = require('morgan');  // Log de requisições HTTP
const helmet = require('helmet');  // Aumenta a segurança da aplicação
const dotenv = require('dotenv');  // Para usar variáveis de ambiente
const bodyParser = require('body-parser');  // Processa dados do corpo da requisição

// Configuração do dotenv
dotenv.config();

// Configuração do servidor Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Dados em memória para simular um banco de dados
let items = [];

// Rotas CRUD

// CREATE - Cria um novo item
app.post('/items', (req, res) => {
    const { name, description } = req.body;
    const newItem = { id: items.length + 1, name, description };
    items.push(newItem);
    res.status(201).json(newItem);
});

// READ - Obtém todos os itens
app.get('/items', (req, res) => {
    res.json(items);
});

// READ - Obtém um item pelo ID
app.get('/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ error: 'Item não encontrado' });
    res.json(item);
});

// UPDATE - Atualiza um item pelo ID
app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const item = items.find(i => i.id === parseInt(id));
    if (!item) return res.status(404).json({ error: 'Item não encontrado' });

    item.name = name || item.name;
    item.description = description || item.description;
    res.json(item);
});

// DELETE - Deleta um item pelo ID
app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    const itemIndex = items.findIndex(i => i.id === parseInt(id));
    if (itemIndex === -1) return res.status(404).json({ error: 'Item não encontrado' });

    items.splice(itemIndex, 1);
    res.status(204).send();
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
