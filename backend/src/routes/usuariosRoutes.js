const express = require('express')
const router = express.Router()

const { login } = require('../controllers/usuariosController')

// POST - Iniciar sesión
router.post('/login', login)

module.exports = router