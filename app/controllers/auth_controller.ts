import type { HttpContext } from '@adonisjs/core/http'
import { AuthService } from '#services/auth_service'
import { registerValidator, loginValidator } from '#dtos/auth_dto'

export default class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)
      const result = await this.authService.register(payload)

      return response.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
        data: null,
      })
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(loginValidator)
      const result = await this.authService.login(payload)

      return response.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      })
    } catch (error) {
      return response.status(401).json({
        success: false,
        message: error.message,
        data: null,
      })
    }
  }

  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const currentToken = auth.user?.currentAccessToken

      if (!currentToken) {
        throw new Error('No active session found')
      }

      await this.authService.logout(user, currentToken)

      return response.status(200).json({
        success: true,
        message: 'Logout successful',
        data: null,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
        data: null,
      })
    }
  }

  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const result = await this.authService.me(user.id)

      return response.status(200).json({
        success: true,
        message: 'User data retrieved successfully',
        data: result,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
        data: null,
      })
    }
  }
}
