import vine from '@vinejs/vine'

export const updateUserValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().optional(),
    fullName: vine.string().trim().minLength(2).maxLength(100).optional(),
  })
)

export interface UpdateUserDto {
  email?: string
  fullName?: string
}

export interface UserResponse {
  id: number
  email: string
  fullName: string
  balance: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
