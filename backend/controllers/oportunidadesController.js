const { sql, getPool } = require('../config/database');

async function listar(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT o.Id, o.ClienteId, c.Nome AS Cliente, o.Titulo, o.Valor, o.Etapa, o.DataCriacao
      FROM dbo.Oportunidades o
      INNER JOIN dbo.Clientes c ON c.Id=o.ClienteId
      ORDER BY o.Id DESC;
    `);
    res.json(result.recordset);
  } catch (error) { res.status(500).json({ erro: 'Erro ao listar oportunidades.', detalhe: error.message }); }
}

async function criar(req, res) {
  try {
    const { clienteId, titulo, valor, etapa } = req.body;
    if (!clienteId || !titulo?.trim()) return res.status(400).json({ erro: 'Cliente e título são obrigatórios.' });
    const pool = await getPool();
    const result = await pool.request()
      .input('ClienteId', sql.Int, Number(clienteId))
      .input('Titulo', sql.NVarChar(200), titulo.trim())
      .input('Valor', sql.Decimal(12,2), Number(valor || 0))
      .input('Etapa', sql.NVarChar(50), etapa || 'Novo')
      .query(`
        INSERT INTO dbo.Oportunidades (ClienteId,Titulo,Valor,Etapa)
        OUTPUT INSERTED.*
        VALUES (@ClienteId,@Titulo,@Valor,@Etapa);
      `);
    res.status(201).json(result.recordset[0]);
  } catch (error) { res.status(500).json({ erro: 'Erro ao criar oportunidade.', detalhe: error.message }); }
}

module.exports = { listar, criar };
