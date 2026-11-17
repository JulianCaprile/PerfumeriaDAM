
const supabase = require('../config/database')

// GET - Obtener todos los productos
const obtenerProductos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')

    if (error) throw error

    res.json(data)

  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      mensaje: 'Error al obtener productos'
    })
  }
}

// GET - Obtener producto por ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      })
    }

    res.json(data)

  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      mensaje: 'Error al obtener producto'
    })
  }
}

// POST - Agregar producto
const agregarProducto = async (req, res) => {
  try {
    const {
      nombre,
      marca,
      categoria,
      precio,
      stock,
      descripcion,
      imagen_url
    } = req.body

    // Validaciones básicas
    if (
      !nombre ||
      typeof precio !== 'number' ||
      !Number.isFinite(precio) ||
      precio <= 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return res.status(400).json({
        mensaje: 'Nombre, precio o stock inválidos'
      })
    }

    const { data, error } = await supabase
      .from('productos')
      .insert([{
        nombre,
        marca,
        categoria,
        precio,
        stock,
        descripcion,
        imagen_url
      }])
      .select()
      .single()

    if (error) throw error

    res.status(201).json({
      mensaje: 'Producto agregado correctamente',
      producto: data
    })

  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      mensaje: 'Error al agregar producto'
    })
  }
}

// PUT - Modificar producto
const modificarProducto = async (req, res) => {
  try {
    const { id } = req.params

    const {
      nombre,
      marca,
      categoria,
      precio,
      stock,
      descripcion,
      imagen_url
    } = req.body

    // Validaciones básicas
    if (
      !nombre ||
      typeof precio !== 'number' ||
      !Number.isFinite(precio) ||
      precio <= 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return res.status(400).json({
        mensaje: 'Nombre, precio o stock inválidos'
      })
    }

    const { data, error } = await supabase
      .from('productos')
      .update({
        nombre,
        marca,
        categoria,
        precio,
        stock,
        descripcion,
        imagen_url
      })
      .eq('id', id)
      .select()
      .maybeSingle()

    if (error) throw error

    if (!data) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      })
    }

    res.json({
      mensaje: 'Producto modificado correctamente',
      producto: data
    })

  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      mensaje: 'Error al modificar producto'
    })
  }
}

// DELETE - Eliminar producto
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle()

    if (error) {
      if (error.code === '23503') {
        return res.status(409).json({
          mensaje: 'No se puede eliminar un producto que pertenece a un pedido'
        })
      }

      throw error
    }

    if (!data) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      })
    }

    res.json({
      mensaje: 'Producto eliminado correctamente'
    })

  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      mensaje: 'Error al eliminar producto'
    })
  }
}

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  agregarProducto,
  modificarProducto,
  eliminarProducto
}
