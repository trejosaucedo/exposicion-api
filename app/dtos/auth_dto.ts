import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    fullName: vine.string().trim().minLength(2).maxLength(100),
    password: vine.string().minLength(8).maxLength(255),
    role: vine.enum(['user']).optional(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    password: vine.string().minLength(1),
  })
)

export interface RegisterDto {
  email: string
  fullName: string
  password: string
  role?: 'user'
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: number
    email: string
    fullName: string
    balance: number
    isActive: boolean
    role: 'user' | 'admin'
  }
  token: string
}

export interface UpdateUserDto {
  email?: string
  fullName?: string
}

export interface TokenPayload {
  userId: number
  email: string
  role: 'user' | 'admin'
}
