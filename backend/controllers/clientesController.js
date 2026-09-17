const { sql, getPool } = require('../config/database');

async function listar(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT Id, Nome, Email, Telefone, Empresa, Status, DataCadastro
      FROM dbo.Clientes
      ORDER BY Id DESC;
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar clientes.', detalhe: error.message });
  }
}

async function criar(req, res) {
  try {
    const { nome, email, telefone, empresa, status } = req.body;
    if (!nome?.trim()) return res.status(400).json({ erro: 'Nome é obrigatório.' });

    const pool = await getPool();
    const result = await pool.request()
      .input('Nome', sql.NVarChar(150), nome.trim())
      .input('Email', sql.NVarChar(150), email?.trim() || null)
      .input('Telefone', sql.NVarChar(30), telefone?.trim() || null)
      .input('Empresa', sql.NVarChar(150), empresa?.trim() || null)
      .input('Status', sql.NVarChar(30), status || 'Ativo')
      .query(`
        INSERT INTO dbo.Clientes (Nome, Email, Telefone, Empresa, Status)
        OUTPUT INSERTED.*
        VALUES (@Nome, @Email, @Telefone, @Empresa, @Status);
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar cliente.', detalhe: error.message });
  }
}

async function atualizar(req, res) {
  try {
    const id = Number(req.params.id);
    const { nome, email, telefone, empresa, status } = req.body;
    if (!Number.isInteger(id)) return res.status(400).json({ erro: 'ID inválido.' });
    if (!nome?.trim()) return res.status(400).json({ erro: 'Nome é obrigatório.' });

    const pool = await getPool();
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .input('Nome', sql.NVarChar(150), nome.trim())
      .input('Email', sql.NVarChar(150), email?.trim() || null)
      .input('Telefone', sql.NVarChar(30), telefone?.trim() || null)
      .input('Empresa', sql.NVarChar(150), empresa?.trim() || null)
      .input('Status', sql.NVarChar(30), status || 'Ativo')
      .query(`
        UPDATE dbo.Clientes
        SET Nome=@Nome, Email=@Email, Telefone=@Telefone, Empresa=@Empresa, Status=@Status
        OUTPUT INSERTED.*
        WHERE Id=@Id;
      `);

    if (!result.recordset.length) return res.status(404).json({ erro: 'Cliente não encontrado.' });
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar cliente.', detalhe: error.message });
  }
}

async function remover(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ erro: 'ID inválido.' });

    const pool = await getPool();
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .query('DELETE FROM dbo.Clientes WHERE Id=@Id; SELECT @@ROWCOUNT AS afetados;');

    if (!result.recordset[0].afetados) return res.status(404).json({ erro: 'Cliente não encontrado.' });
    res.json({ mensagem: 'Cliente excluído com sucesso.' });
  } catch (error) {
    res.status(409).json({ erro: 'Não foi possível excluir o cliente. Remova os registros relacionados primeiro.', detalhe: error.message });
  }
}

module.exports = { listar, criar, atualizar, remover };
