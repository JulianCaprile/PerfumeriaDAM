
const express = require('express')
const router = express.Router()

const {
  obtenerProductos,
  obtenerProductoPorId,
  agregarProducto,
  modificarProducto,
  eliminarProducto
} = require('../controllers/productosController')

const {
  verificarToken,
  verificarAdmin
} = require('../middlewares/authMiddleware')

// Rutas públicas
router.get('/productos', obtenerProductos)
router.get('/productos/:id', obtenerProductoPorId)

// Rutas exclusivas del administrador
router.post('/productos', verificarToken, verificarAdmin, agregarProducto)

router.put('/productos/:id', verificarToken, verificarAdmin, modificarProducto)

router.delete('/productos/:id', verificarToken, verificarAdmin, eliminarProducto)

module.exports = router
