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

// Rutas de usuario (protegidas)
router
  .group(() => {
    router.get('/profile', '#controllers/user_controller.getProfile')
    router.put('/profile', '#controllers/user_controller.updateProfile')
    router.get('/balance', '#controllers/user_controller.getBalance')
    router.post('/balance/add', '#controllers/user_controller.addBalance')
    router.post('/balance/deduct', '#controllers/user_controller.deductBalance')
  })
  .prefix('/api/user')
  .use(middleware.auth())

// Rutas de administración
router
  .group(() => {
    router.get('/users', '#controllers/user_controller.getAllUsers')
    router.get('/users/:id', '#controllers/user_controller.getUserById')
    router.put('/users/:id', '#controllers/user_controller.updateUserById')
    router.put('/users/:id/balance', '#controllers/user_controller.updateUserBalance')
    router.put('/users/:id/toggle-status', '#controllers/user_controller.toggleUserStatus')
    router.delete('/users/:id', '#controllers/user_controller.deleteUser')
  })
  .prefix('/api/admin')
// .use([middleware.auth(), middleware.admin()]) descomentar cuando haga logica para admins

// Ruta de prueba
router.get('/api/health', async () => {
  return {
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  }
})
