import User from '#models/user'
import { RegisterDto, UpdateUserDto } from '#dtos/auth_dto'

export class UserRepository {
  async findAll(): Promise<User[]> {
    return User.all()
  }

  async findById(id: number): Promise<User | null> {
    return User.find(id)
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findBy('email', email)
  }

  async createUser(data: RegisterDto): Promise<User> {
    return User.create({
      email: data.email,
      fullName: data.fullName,
      password: data.password,
      balance: 1000.0,
      isActive: true,
    })
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User | null> {
    const user = await this.findById(id)
    if (!user) return null

    if (data.email && data.email !== user.email) {
      const existingUser = await this.findByEmail(data.email)
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email already exists')
      }
    }

    user.merge(data)
    await user.save()
    return user
  }

  async updateBalance(id: number, newBalance: number): Promise<User | null> {
    const user = await this.findById(id)
    if (!user) return null

    user.balance = newBalance
    await user.save()
    return user
  }

  async toggleUserStatus(id: number): Promise<User | null> {
    const user = await this.findById(id)
    if (!user) return null

    user.isActive = !user.isActive
    await user.save()
    return user
  }

  async delete(id: number): Promise<boolean> {
    const user = await this.findById(id)
    if (!user) return false

    await user.delete()
    return true
  }
}
