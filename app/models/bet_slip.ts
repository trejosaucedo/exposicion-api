import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Bet from './bet.js'

export default class BetSlip extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare totalStake: number // Cantidad apostada

  @column()
  declare totalOdds: number // Momios totales (multiplicación de todos los momios)

  @column()
  declare potentialWin: number // Ganancia potencial

  @column()
  declare status: 'pending' | 'won' | 'lost' | 'cancelled'

  @column()
  declare type: 'single' | 'parlay' // Apuesta única o múltiple

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Bet)
  declare bets: HasMany<typeof Bet>
}

