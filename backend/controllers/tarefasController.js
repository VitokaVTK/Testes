const { sql, getPool } = require('../config/database');

async function listar(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT t.Id, t.ClienteId, c.Nome AS Cliente, t.Titulo, t.Descricao, t.Vencimento, t.Concluida
      FROM dbo.Tarefas t
      LEFT JOIN dbo.Clientes c ON c.Id=t.ClienteId
      ORDER BY t.Id DESC;
    `);
    res.json(result.recordset);
  } catch (error) { res.status(500).json({ erro: 'Erro ao listar tarefas.', detalhe: error.message }); }
}

async function criar(req, res) {
  try {
    const { clienteId, titulo, descricao, vencimento } = req.body;
    if (!titulo?.trim()) return res.status(400).json({ erro: 'Título é obrigatório.' });
    const pool = await getPool();
    const result = await pool.request()
      .input('ClienteId', sql.Int, clienteId ? Number(clienteId) : null)
      .input('Titulo', sql.NVarChar(200), titulo.trim())
      .input('Descricao', sql.NVarChar(sql.MAX), descricao?.trim() || null)
      .input('Vencimento', sql.Date, vencimento || null)
      .query(`
        INSERT INTO dbo.Tarefas (ClienteId,Titulo,Descricao,Vencimento)
        OUTPUT INSERTED.*
        VALUES (@ClienteId,@Titulo,@Descricao,@Vencimento);
      `);
    res.status(201).json(result.recordset[0]);
  } catch (error) { res.status(500).json({ erro: 'Erro ao criar tarefa.', detalhe: error.message }); }
}

async function concluir(req, res) {
  try {
    const id = Number(req.params.id);
    const pool = await getPool();
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .query(`
        UPDATE dbo.Tarefas SET Concluida = CASE WHEN Concluida=1 THEN 0 ELSE 1 END
        OUTPUT INSERTED.* WHERE Id=@Id;
      `);
    if (!result.recordset.length) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    res.json(result.recordset[0]);
  } catch (error) { res.status(500).json({ erro: 'Erro ao alterar tarefa.', detalhe: error.message }); }
}

module.exports = { listar, criar, concluir };
