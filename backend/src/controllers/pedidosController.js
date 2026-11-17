
const supabase = require('../config/database')

// POST - Crear un pedido
const crearPedido = async (req, res) => {
  try {
    const { productos } = req.body

    // Comprobar que el carrito tenga productos
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        mensaje: 'El carrito está vacío'
      })
    }

    // Obtener el cliente autenticado
    const usuario_id = req.usuario.id

    let total = 0
    const detalles = []

    // Consultar los productos y calcular el total
    for (const item of productos) {

      if (
        !Number.isInteger(item.producto_id) ||
        !Number.isInteger(item.cantidad) ||
        item.cantidad <= 0
      ) {
        return res.status(400).json({
          mensaje: 'Producto o cantidad inválida'
        })
      }

      const { data: producto, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', item.producto_id)
        .single()

      if (error || !producto) {
        return res.status(404).json({
          mensaje: 'Producto no encontrado'
        })
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          mensaje: `Stock insuficiente para ${producto.nombre}`
        })
      }

      const subtotal = Number(producto.precio) * item.cantidad

      total += subtotal

      detalles.push({
        producto_id: producto.id,
        cantidad: item.cantidad,
        precio_unitario: producto.precio
      })
    }

    // Guardar el pedido
    const { data: pedido, error: errorPedido } = await supabase
      .from('pedidos')
      .insert([{
        usuario_id,
        total,
        estado: 'pendiente'
      }])
      .select()
      .single()

    if (errorPedido) throw errorPedido

    // Guardar los productos del pedido
    const detalleConPedido = detalles.map(item => ({
      ...item,
      pedido_id: pedido.id
    }))

    const { error: errorDetalle } = await supabase
      .from('detalle_pedidos')
      .insert(detalleConPedido)

    if (errorDetalle) {
      // Evitar dejar un pedido incompleto
      const { error: errorLimpieza } = await supabase
        .from('pedidos')
        .delete()
        .eq('id', pedido.id)

      if (errorLimpieza) {
        console.error('No se pudo limpiar el pedido:', errorLimpieza.message)
      }

      throw errorDetalle
    }

    res.status(201).json({
      mensaje: 'Pedido realizado correctamente',
      pedido
    })

  } catch (error) {
    console.error('Error al crear pedido:', error.message)

    res.status(500).json({
      mensaje: 'Error al realizar el pedido'
    })
  }
}

// GET - Consultar pedidos (administrador)
const obtenerPedidos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        id,
        fecha,
        total,
        estado,
        usuarios(nombre, email),
        detalle_pedidos(
          cantidad,
          precio_unitario,
          productos(nombre, marca)
        )
      `)
      .order('fecha', { ascending: false })

    if (error) throw error

    res.json(data)

  } catch (error) {
    console.error('Error al obtener pedidos:', error.message)

    res.status(500).json({
      mensaje: 'Error al obtener pedidos'
    })
  }
}

module.exports = {
  crearPedido,
  obtenerPedidos
}
