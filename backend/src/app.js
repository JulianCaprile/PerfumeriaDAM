const express = require('express')
const cors = require('cors')
require('dotenv').config()

// Importar rutas
const productosRoutes = require('./routes/productosRoutes')
const usuariosRoutes = require('./routes/usuariosRoutes')
const pedidosRoutes = require('./routes/pedidosRoutes')

const app = express()

app.use(cors())
app.use(express.json())

// Registrar rutas
app.use('/api', productosRoutes)
app.use('/api', usuariosRoutes)
console.log('Tipo de pedidosRoutes:', typeof pedidosRoutes)
app.use('/api', pedidosRoutes)

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Backend de Perfumería funcionando'
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`)
})