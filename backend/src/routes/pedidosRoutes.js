const express = require('express')
const router = express.Router()

const {
  crearPedido,
  obtenerPedidos
} = require('../controllers/pedidosController')

const {
  verificarToken,
  verificarAdmin
} = require('../middlewares/authMiddleware')

// Cliente: realizar pedido
router.post('/pedidos', verificarToken, crearPedido)

// Administrador: consultar pedidos
router.get('/pedidos', verificarToken, verificarAdmin, obtenerPedidos)

module.exports = router