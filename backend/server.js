const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { getPool } = require('./config/database');
const clientesRoutes = require('./routes/clientesRoutes');
const contatosRoutes = require('./routes/contatosRoutes');
const oportunidadesRoutes = require('./routes/oportunidadesRoutes');
const tarefasRoutes = require('./routes/tarefasRoutes');
const { obterResumo } = require('./services/dashboardService');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const frontendPath = path.join(__dirname, '../frontend');

app.use(cors());
app.use(express.json());
app.use(express.static(frontendPath));

app.get('/api/health', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request().query('SELECT 1 AS ok');
    res.json({ api: true, banco: true });
  } catch (error) {
    res.status(503).json({ api: true, banco: false, detalhe: error.message });
  }
});

app.get('/api/dashboard', async (req, res) => {
  try { res.json(await obterResumo()); }
  catch (error) { res.status(500).json({ erro: 'Erro ao carregar dashboard.', detalhe: error.message }); }
});

app.use('/api/clientes', clientesRoutes);
app.use('/api/contatos', contatosRoutes);
app.use('/api/oportunidades', oportunidadesRoutes);
app.use('/api/tarefas', tarefasRoutes);

app.listen(PORT,()=>console.log(`CRM: http://localhost:${PORT}`));
