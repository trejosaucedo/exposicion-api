import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasMany } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import hash from '@adonisjs/core/services/hash'
import BetSlip from './bet_slip.js'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare fullName: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare balance: number

  @column()
  declare isActive: boolean

  @column()
  declare role: 'user' | 'admin'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => BetSlip)
  declare betSlips: HasMany<typeof BetSlip>

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '7 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  get isAdmin(): boolean {
    return this.role === 'admin'
  }

  get isUser(): boolean {
    return this.role === 'user'
  }
}
