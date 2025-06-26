import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/user_service'
import { updateUserValidator } from '#dtos/user_dto'
import { balanceValidator, updateBalanceValidator } from '#dtos/betting_dto'

export default class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async getProfile({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const result = await this.userService.getProfile(user.id)

      return response.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
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

  async updateProfile({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(updateUserValidator)
      const result = await this.userService.updateProfile(user.id, payload)

      return response.status(200).json({
        success: true,
        message: 'Profile updated successfully',
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

  async getBalance({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const balance = await this.userService.getBalance(user.id)

      return response.status(200).json({
        success: true,
        message: 'Balance retrieved successfully',
        data: { balance },
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
        data: null,
      })
    }
  }

  async addBalance({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(balanceValidator)
      const result = await this.userService.addBalance(user.id, payload.amount)

      return response.status(200).json({
        success: true,
        message: 'Balance updated successfully',
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

  async deductBalance({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(balanceValidator)
      const result = await this.userService.deductBalance(user.id, payload.amount)

      return response.status(200).json({
        success: true,
        message: 'Balance updated successfully',
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

  // Métodos para administradores
  async getAllUsers({ response }: HttpContext) {
    try {
      const result = await this.userService.getAllUsers()

      return response.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
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

  async getUserById({ params, response }: HttpContext) {
    try {
      const userId = params.id
      const result = await this.userService.getUserById(userId)

      return response.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: result,
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: error.message,
        data: null,
      })
    }
  }

  async updateUserById({ params, request, response }: HttpContext) {
    try {
      const userId = params.id
      const payload = await request.validateUsing(updateUserValidator)
      const result = await this.userService.updateUserById(userId, payload)

      return response.status(200).json({
        success: true,
        message: 'User updated successfully',
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

  async toggleUserStatus({ params, response }: HttpContext) {
    try {
      const userId = params.id
      const result = await this.userService.toggleUserStatus(userId)

      return response.status(200).json({
        success: true,
        message: 'User status updated successfully',
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

  async updateUserBalance({ params, request, response }: HttpContext) {
    try {
      const userId = params.id
      const payload = await request.validateUsing(updateBalanceValidator)
      const result = await this.userService.updateUserBalance(userId, payload.balance)

      return response.status(200).json({
        success: true,
        message: 'User balance updated successfully',
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

  async deleteUser({ params, response }: HttpContext) {
    try {
      const userId = params.id
      await this.userService.deleteUser(userId)

      return response.status(200).json({
        success: true,
        message: 'User deleted successfully',
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
}
