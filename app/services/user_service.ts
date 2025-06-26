import { UserRepository } from '#repositories/user_repository'
import { UpdateUserDto, UserResponse } from '#dtos/user_dto'

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async getProfile(userId: number): Promise<UserResponse> {
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
      createdAt: user.createdAt.toISO()!,
      updatedAt: user.updatedAt.toISO()!,
    }
  }

  async updateProfile(userId: number, data: UpdateUserDto): Promise<UserResponse> {
    const user = await this.userRepository.updateUser(userId, data)
    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      balance: user.balance,
      isActive: user.isActive,
      createdAt: user.createdAt.toISO()!,
      updatedAt: user.updatedAt.toISO()!,
    }
  }

  async getBalance(userId: number): Promise<number> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    return user.balance
  }

  async addBalance(userId: number, amount: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const newBalance = Number(user.balance) + Number(amount)
    const updatedUser = await this.userRepository.updateBalance(userId, newBalance)

    if (!updatedUser) {
      throw new Error('Failed to update balance')
    }

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      balance: updatedUser.balance,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt.toISO()!,
      updatedAt: updatedUser.updatedAt.toISO()!,
    }
  }

  async deductBalance(userId: number, amount: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    if (user.balance < amount) {
      throw new Error('Insufficient balance')
    }

    const newBalance = user.balance - amount
    const updatedUser = await this.userRepository.updateBalance(userId, newBalance)

    if (!updatedUser) {
      throw new Error('Failed to update balance')
    }

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      balance: updatedUser.balance,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt.toISO()!,
      updatedAt: updatedUser.updatedAt.toISO()!,
    }
  }

  // Métodos para administradores
  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll()
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      balance: user.balance,
      isActive: user.isActive,
      createdAt: user.createdAt.toISO()!,
      updatedAt: user.updatedAt.toISO()!,
    }))
  }

  async getUserById(userId: number): Promise<UserResponse> {
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
      createdAt: user.createdAt.toISO()!,
      updatedAt: user.updatedAt.toISO()!,
    }
  }

  async updateUserById(userId: number, data: UpdateUserDto): Promise<UserResponse> {
    const user = await this.userRepository.updateUser(userId, data)
    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      balance: user.balance,
      isActive: user.isActive,
      createdAt: user.createdAt.toISO()!,
      updatedAt: user.updatedAt.toISO()!,
    }
  }

  async toggleUserStatus(userId: number): Promise<UserResponse> {
    const user = await this.userRepository.toggleUserStatus(userId)
    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      balance: user.balance,
      isActive: user.isActive,
      createdAt: user.createdAt.toISO()!,
      updatedAt: user.updatedAt.toISO()!,
    }
  }

  async updateUserBalance(userId: number, newBalance: number): Promise<UserResponse> {
    const user = await this.userRepository.updateBalance(userId, newBalance)
    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      balance: user.balance,
      isActive: user.isActive,
      createdAt: user.createdAt.toISO()!,
      updatedAt: user.updatedAt.toISO()!,
    }
  }

  async deleteUser(userId: number): Promise<void> {
    const deleted = await this.userRepository.delete(userId)
    if (!deleted) {
      throw new Error('User not found')
    }
  }
}
