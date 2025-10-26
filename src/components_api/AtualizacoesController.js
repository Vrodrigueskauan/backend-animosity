import connection from '../conexao.js';

// Listar todas as atualizações
export async function GetAtualizacoes(req, res) {
  try {
    const [rows] = await connection.promise().query(
      "SELECT * FROM atualizacoes ORDER BY id DESC"
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar atualizações:", err);
    res.status(500).json({ erro: "Erro ao buscar atualizações" });
  }
}

// Inserir nova atualização
export async function InsertAtualizacao(req, res) {
  const { titulo, descricao, versao } = req.body;

  if (!titulo || !descricao || !versao) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
  }

  try {
    const [result] = await connection.promise().query(
      "INSERT INTO atualizacoes (titulo, descricao, versao) VALUES (?, ?, ?)",
      [titulo, descricao, versao]
    );

    res.status(201).json({
      sucesso: true,
      mensagem: "Atualização criada com sucesso!",
      atualizacaoId: result.insertId
    });
  } catch (err) {
    console.error("Erro ao inserir atualização:", err);
    res.status(500).json({ erro: "Erro ao criar atualização" });
  }
}

// Deletar atualização
export async function DeleteAtualizacao(req, res) {
  const { id } = req.params;

  try {
    const [result] = await connection.promise().query(
      "DELETE FROM atualizacoes WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Atualização não encontrada" });
    }

    res.status(200).json({ sucesso: true, mensagem: "Atualização deletada!" });
  } catch (err) {
    console.error("Erro ao deletar atualização:", err);
    res.status(500).json({ erro: "Erro ao deletar atualização" });
  }
}


export const getVersoes = async (req, res) => {
  try {
    const [rows] = await connection.promise().query("SELECT DISTINCT versao FROM atualizacoes ORDER BY versao DESC");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar versões:", error);
    res.status(500).json({ error: "Erro ao buscar versões" });
  }
};
