import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// Rutas públicas de autenticación
router
  .group(() => {
    router.post('/register', '#controllers/auth_controller.register')
    router.post('/login', '#controllers/auth_controller.login')
  })
  .prefix('/api/auth')

// Rutas protegidas de autenticación
router
  .group(() => {
    router.post('/logout', '#controllers/auth_controller.logout')
    router.get('/me', '#controllers/auth_controller.me')
  })
  .prefix('/api/auth')
  .use(middleware.auth())

// Ruta de prueba
router.get('/api/health', async () => {
  return {
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  }
})
