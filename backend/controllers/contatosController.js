const { sql, getPool } = require('../config/database');

async function listar(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT c.Id, c.ClienteId, cl.Nome AS Cliente, c.Assunto, c.Descricao, c.DataContato
      FROM dbo.Contatos c
      INNER JOIN dbo.Clientes cl ON cl.Id=c.ClienteId
      ORDER BY c.Id DESC;
    `);
    res.json(result.recordset);
  } catch (error) { res.status(500).json({ erro: 'Erro ao listar contatos.', detalhe: error.message }); }
}

async function criar(req, res) {
  try {
    const { clienteId, assunto, descricao } = req.body;
    if (!clienteId || !assunto?.trim()) return res.status(400).json({ erro: 'Cliente e assunto são obrigatórios.' });
    const pool = await getPool();
    const result = await pool.request()
      .input('ClienteId', sql.Int, Number(clienteId))
      .input('Assunto', sql.NVarChar(200), assunto.trim())
      .input('Descricao', sql.NVarChar(sql.MAX), descricao?.trim() || null)
      .query(`
        INSERT INTO dbo.Contatos (ClienteId, Assunto, Descricao)
        OUTPUT INSERTED.*
        VALUES (@ClienteId,@Assunto,@Descricao);
      `);
    res.status(201).json(result.recordset[0]);
  } catch (error) { res.status(500).json({ erro: 'Erro ao registrar contato.', detalhe: error.message }); }
}

module.exports = { listar, criar };
