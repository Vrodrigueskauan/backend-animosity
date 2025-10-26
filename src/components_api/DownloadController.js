import connection from '../conexao.js';



export async function UpdateDownloads(req, res) {
    try{
        const { jogo} = req.body;
        connection.query(
            "UPDATE download SET jogo = ?", [jogo], (err, resultado) => {
               console.log(err);
                if (err) {
                  console.error("Erro ao atualizar downloads:", err);
                  return res.status(500).json({ erro: "Erro ao atualizar downloads." });
                }else {
                    res.status(200).json({ mensagem: "Downloads atualizado com sucesso"})
                    console.log(resultado);
                }
            }
                )
                }catch (error) {
        console.error("Erro no UpdateDownloads:", error);
        res.status(500).json({ erro: "Erro interno do servidor." });
    }

            
    }


    export async function getDownload(req, res){
        const {jogo} = req.query;
        connection.query("SELECT jogo FROM download", (err, resultado) => {
        if (err) {
          console.error("Erro ao buscar download:", err);
          return res.status(500).json({ erro: "Erro ao buscar download." });
        }
            if (resultado.length === 0) {
      return res.status(404).json({ erro: "Nenhum jogo encontrado." });
    }
        
        
        res.status(200).json(resultado[0].jogo);
        
        
        }
    )
}