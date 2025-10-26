import connection from '../conexao.js';

export async function GetFeed(req, res) {
  const { id_usuario } = req.params;

  if (!id_usuario) {
    return res.status(400).json({ erro: "ID do usuário é obrigatório!" });
  }

  try {
    // Usando interface de Promise
    const [feedbacks] = await connection.promise().query(
      "SELECT * FROM feedback WHERE id_usuario = ?",
      [id_usuario]
    );

    res.status(200).json(feedbacks);
  } catch (err) {
    console.error('Erro ao buscar feedbacks:', err);
    res.status(500).json({ erro: 'Erro ao buscar feedbacks', detalhes: err.message });
  }
}


export async function InsertFeed(req, res) {
  console.log("Recebido no backend:", req.body); // Confirma os dados chegando

  const { mensagem, versao, estrelas, id_usuario } = req.body;

  // Checa se algum dado está faltando
  if (!mensagem || !versao || !estrelas || !id_usuario) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
  }

  // Insere no banco de dados
  connection.query(
    "INSERT INTO feedback (mensagem, versao, estrelas, id_usuario) VALUES (?, ?, ?, ?)",
    [mensagem, versao, estrelas, id_usuario],
    (err, result) => {
      if (err) {
        console.error("Erro ao inserir feedback:", err);
        return res.status(500).json({ erro: "Erro ao inserir feedback." });
      }

      // Retorna sucesso
      res.status(201).json({
        sucesso: true,
        mensagem: "Feedback registrado com sucesso!",
        feedbackId: result.insertId
      });
    }
  );
}


export async function UpdateFeed(req, res) {
  const { id } = req.params; // ID do feedback a ser atualizado
  const { mensagem, versao, estrelas } = req.body;

  connection.query(
    "UPDATE feedback SET mensagem = ?, versao = ?, estrelas = ? WHERE id = ?",
    [mensagem, versao, estrelas, id],
    (err, result) => {
      if (err) {
        console.error("Erro ao atualizar feedback:", err);
        return res.status(500).json({ erro: "Erro ao atualizar feedback" });
      }

      if (result.affectedRows === 0) {
        // Não encontrou feedback com esse id
        return res.status(404).json({ erro: "Feedback não encontrado" });
      }

      // Retorna mensagem de sucesso
      res.status(200).json({
        mensagem: "Feedback atualizado com sucesso",
        feedbackId: id,
        atualizacao: { mensagem, versao, estrelas }
      });
    }
  );
}


export async function DeleteFeed(req, res) {
  const { id } = req.params; // ID do feedback a ser deletado

  connection.query(
    "DELETE FROM feedback WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Erro ao deletar feedback:", err);
        return res.status(500).json({ erro: "Erro ao deletar feedback" });
      }

      if (result.affectedRows === 0) {
        // Não encontrou feedback com esse id
        return res.status(404).json({ erro: "Feedback não encontrado" });
      }

      // Retorna mensagem de sucesso
      res.status(200).json({
        mensagem: "Feedback deletado com sucesso",
        feedbackId: id
      });
    }
  );
}

export async function GetAllFeed(req, res) {
  try {
    const [feedbacks] = await connection.promise().query(
      "SELECT * FROM feedback"
    );
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error('Erro ao buscar feedbacks:', err);
    res.status(500).json({ erro: 'Erro ao buscar feedbacks', detalhes: err.message });
  }
}

