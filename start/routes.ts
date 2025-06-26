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

// Rutas públicas de partidos y apuestas
router
  .group(() => {
    router.get('/matches', '#controllers/betting_controller.getMatches')
    router.get('/matches/upcoming', '#controllers/betting_controller.getUpcomingMatches')
    router.get('/matches/:id', '#controllers/betting_controller.getMatch')
  })
  .prefix('/api')

// Rutas protegidas de apuestas
router
  .group(() => {
    router.post('/bet-slips', '#controllers/betting_controller.createBetSlip')
    router.get('/bet-slips', '#controllers/betting_controller.getUserBetSlips')
    router.get('/bet-slips/:id', '#controllers/betting_controller.getBetSlip')
  })
  .prefix('/api')
  .use(middleware.auth())

// Rutas de administración
router
  .group(() => {
    // Gestión de usuarios
    router.get('/users', '#controllers/user_controller.getAllUsers')
    router.get('/users/:id', '#controllers/user_controller.getUserById')
    router.put('/users/:id', '#controllers/user_controller.updateUserById')
    router.put('/users/:id/balance', '#controllers/user_controller.updateUserBalance')
    router.put('/users/:id/toggle-status', '#controllers/user_controller.toggleUserStatus')
    router.delete('/users/:id', '#controllers/user_controller.deleteUser')

    // Gestión de partidos
    router.post('/matches', '#controllers/betting_controller.createMatch')
    router.put('/matches/:id/finish', '#controllers/betting_controller.finishMatch')
  })
  .prefix('/api/admin')
  .use([middleware.auth(), middleware.admin()])

// Ruta de prueba
router.get('/api/health', async () => {
  return {
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  }
})
