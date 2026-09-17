const { getPool } = require('../config/database');

async function obterResumo() {
  const pool = await getPool();
  const clientes = await pool.request().query('SELECT COUNT(*) AS total FROM dbo.Clientes;');
  const oportunidades = await pool.request().query('SELECT COUNT(*) AS total, COALESCE(SUM(Valor),0) AS valor FROM dbo.Oportunidades;');
  const tarefas = await pool.request().query('SELECT COUNT(*) AS total FROM dbo.Tarefas WHERE Concluida=0;');
  return {
    clientes: clientes.recordset[0].total,
    oportunidades: oportunidades.recordset[0].total,
    valorOportunidades: oportunidades.recordset[0].valor,
    tarefasPendentes: tarefas.recordset[0].total
  };
}

module.exports = { obterResumo };
