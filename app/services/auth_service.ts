import { UserRepository } from '#repositories/user_repository'
import { RegisterDto, LoginDto, AuthResponse } from '#dtos/auth_dto'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export class AuthService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('Email already exists')
    }

    const user = await this.userRepository.createUser(data)

    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: '7 days',
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        balance: user.balance,
        isActive: user.isActive,
      },
      token: token.value!.release(),
    }
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(data.email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Verificar contraseña
    const isValidPassword = await hash.verify(user.password, data.password)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      throw new Error('Account is inactive')
    }

    // Generar token
    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: '7 days',
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        balance: user.balance,
        isActive: user.isActive,
      },
      token: token.value!.release(),
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.user!
    const token = auth.user!.currentAccessToken

    await User.accessTokens.delete(user, token.identifier)

    return response.ok({ message: 'Logged out successfully' })
  }

  async me(userId: number): Promise<AuthResponse['user']> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      balance: user.balance,
      isActive: user.isActive,
    }
  }
}
