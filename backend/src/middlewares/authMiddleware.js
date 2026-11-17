
const supabase = require('../config/database')

// Verificar que el usuario haya iniciado sesión
const verificarToken = async (req, res, next) => {
  try {
    const autorizacion = req.headers.authorization

    if (!autorizacion || !autorizacion.startsWith('Bearer ')) {
      return res.status(401).json({
        mensaje: 'Debés iniciar sesión'
      })
    }

    const token = autorizacion.split(' ')[1]

    // Comprobar el token con Supabase Auth
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return res.status(401).json({
        mensaje: 'Token inválido o vencido'
      })
    }

    // Obtener el rol desde nuestra base de datos
    const { data: usuario, error: errorUsuario } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol')
      .eq('id', data.user.id)
      .single()

    if (errorUsuario || !usuario) {
      return res.status(403).json({
        mensaje: 'Usuario sin permisos'
      })
    }

    req.usuario = usuario

    next()

  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      mensaje: 'Error al verificar usuario'
    })
  }
}

// Verificar que sea administrador
const verificarAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== 'admin') {
    return res.status(403).json({
      mensaje: 'Acceso exclusivo para administradores'
    })
  }

  next()
}

module.exports = {
  verificarToken,
  verificarAdmin
}
