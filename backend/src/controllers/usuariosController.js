
const { createClient } = require('@supabase/supabase-js')
const supabase = require('../config/database')

// Cliente para autenticar usuarios
const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
)

// POST - Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        mensaje: 'Ingresá email y contraseña'
      })
    }

    // Validar credenciales con Supabase Auth
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password
    })

    if (error || !data.user || !data.session) {
      return res.status(401).json({
        mensaje: 'Email o contraseña incorrectos'
      })
    }

    // Buscar nombre y rol en nuestra tabla
    const { data: usuario, error: errorUsuario } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol')
      .eq('id', data.user.id)
      .single()

    if (errorUsuario || !usuario) {
      return res.status(404).json({
        mensaje: 'Usuario sin perfil registrado'
      })
    }

    res.json({
      mensaje: 'Inicio de sesión correcto',
      usuario,
      access_token: data.session.access_token
    })

  } catch (error) {
    console.error('Error en login:', error.message)

    res.status(500).json({
      mensaje: 'Error al iniciar sesión'
    })
  }
}

module.exports = {
  login
}
