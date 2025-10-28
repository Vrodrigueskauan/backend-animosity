// src/server.js
import express from 'express';
import cors from 'cors';
import connection from './src/conexao.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import session from 'express-session';

import {
  GetUser,
  InsertUser,
  UpdateUserWithPhoto,
  DeleteUser,
  LoginUser,
  LoginGoogleUser,
  VerifyUser
} from '/src/components_api/UsuarioController.js';

import {
  InsertFeed,
  GetFeed,
  GetAllFeed
} from '/src/components_api/FeedbacksController.js';

import {
  GetAtualizacoes,
  InsertAtualizacao,
  DeleteAtualizacao,
  getVersoes
} from '/src/components_api/AtualizacoesController.js';

import {
  UpdateDownloads,
  getDownload
} from '/src/components_api/DownloadController.js';

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do upload de arquivos
const uploadDir = '/uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Apenas imagens são permitidas!'));
    }
    cb(null, true);
  }
});

// Sessão
app.use(session({
  secret: "chave_muito_segura_aqui",
  resave: false,
  saveUninitialized: false,
}));

// ROTAS DE USUÁRIO
app.get('/usuarios', (req, res) => GetUser( res));
app.get('/usuarios/verify', (req, res) => VerifyUser(req, res));
app.post('/usuarios', (req, res) => InsertUser(req, res));
app.put('/api/usuarios/:id', upload.single('foto'), (req, res) => UpdateUserWithPhoto(req, res));
app.delete('/usuarios/:id', (req, res) => DeleteUser(req, res));
app.post('/usuarios/login', (req, res) => LoginUser(req, res));
app.post('/usuarios/login/google', (req, res) => LoginGoogleUser(req, res));

// ROTAS DE FEEDBACK
app.post('/api/feedback', (req, res) => InsertFeed(req, res));
app.get('/api/feedback/:id_usuario', (req, res) => GetFeed(req, res));
app.get('/feedbacks', (req, res) => GetAllFeed(req, res));
app.delete('/api/feedback/:id_usuario', (req, res) => {
  const { id_usuario } = req.params;
  const { versao, mensagem } = req.query;
  if (!versao || !mensagem) return res.status(400).json({ erro: "Versão e mensagem são obrigatórias!" });

  const query = "DELETE FROM feedback WHERE id_usuario = ? AND versao = ? AND mensagem = ?";
  connection.query(query, [id_usuario, versao, mensagem], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao deletar feedback" });
    if (result.affectedRows === 0) return res.status(404).json({ erro: "Feedback não encontrado" });
    res.status(200).json({ mensagem: "Feedback deletado com sucesso" });
  });
});

// ROTAS DE ATUALIZAÇÕES
app.get('/api/atualizacoes', (req, res) => GetAtualizacoes(req, res));
app.post('/api/atualizacoes', (req, res) => InsertAtualizacao(req, res));
app.delete('/api/atualizacoes/:id', (req, res) => DeleteAtualizacao(req, res));
app.put('/api/atualizacoes/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, versao } = req.body;
  try {
    await connection.execute(
      'UPDATE atualizacoes SET titulo = ?, descricao = ?, versao = ? WHERE id = ?',
      [titulo, descricao, versao, id]
    );
    res.json({ message: 'Atualização alterada com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
});

app.get('/api/versoes', (req, res) => getVersoes(req, res));

// ROTAS DE DOWNLOAD
app.get('/api/downloads', (req, res) => getDownload(req, res));
app.put('/api/downloads', (req, res) => UpdateDownloads(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));