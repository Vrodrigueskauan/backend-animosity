import connection from '../conexao.js';

// Criar post
export const InsertPost = async (req, res) => {
  const { id_usuario } = req.params;
  const { conteudo } = req.body;

  if (!conteudo) return res.status(400).json({ error: "Conteúdo obrigatório" });

  try {
    const [result] = await connection.query(
      "INSERT INTO posts (usuario_id, conteudo) VALUES (?, ?)",
      [id_usuario, conteudo]
    );
    res.json({ id: result.insertId, usuario_id: id_usuario, conteudo, curtidas: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar posts (de todos ou de um usuário específico)
export const GetPosts = async (req, res) => {
  try {
    const [posts] = await connection.query(`
      SELECT p.id, p.conteudo, p.curtidas, p.criado_em, u.nome AS usuario
      FROM posts p
      JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.criado_em DESC
    `);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar post
export const UpdatePost = async (req, res) => {
  const { id_usuario } = req.params;
  const { id_post, conteudo } = req.body;

  try {
    const [rows] = await connection.query("SELECT * FROM posts WHERE id = ?", [id_post]);
    if (rows.length === 0) return res.status(404).json({ error: "Post não encontrado" });
    if (rows[0].usuario_id != id_usuario) return res.status(403).json({ error: "Não autorizado" });

    await connection.query("UPDATE posts SET conteudo = ? WHERE id = ?", [conteudo, id_post]);
    res.json({ message: "Post atualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deletar post
export const DeletePost = async (req, res) => {
  const { id_usuario } = req.params;
  const { id_post } = req.body;

  try {
    const [rows] = await connection.query("SELECT * FROM posts WHERE id = ?", [id_post]);
    if (rows.length === 0) return res.status(404).json({ error: "Post não encontrado" });
    if (rows[0].usuario_id != id_usuario) return res.status(403).json({ error: "Não autorizado" });

    await connection.query("DELETE FROM posts WHERE id = ?", [id_post]);
    res.json({ message: "Post deletado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Curtir post
export const LikePost = async (req, res) => {
  const { id_post } = req.body;
  try {
    await connection.query("UPDATE posts SET curtidas = curtidas + 1 WHERE id = ?", [id_post]);
    res.json({ message: "Post curtido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Comentar
export const CommentPost = async (req, res) => {
  const { id_post, id_usuario, conteudo } = req.body;
  try {
    const [result] = await connection.query(
      "INSERT INTO comentarios (post_id, usuario_id, conteudo) VALUES (?, ?, ?)",
      [id_post, id_usuario, conteudo]
    );
    res.json({ id: result.insertId, post_id: id_post, usuario_id: id_usuario, conteudo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar comentários
export const GetComments = async (req, res) => {
  const { id_post } = req.params;
  try {
    const [comments] = await connection.query(`
      SELECT c.id, c.conteudo, c.criado_em, u.nome AS usuario
      FROM comentarios c
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.criado_em ASC
    `, [id_post]);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
