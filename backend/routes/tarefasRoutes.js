const router = require('express').Router();
const c = require('../controllers/tarefasController');
router.get('/', c.listar);
router.post('/', c.criar);
router.patch('/:id/concluir', c.concluir);
module.exports = router;
