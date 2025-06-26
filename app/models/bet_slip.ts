import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Bet from './bet.js'
import User from './user.js'

export default class BetSlip extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'total_stake' })
  declare totalStake: number

  @column({ columnName: 'total_odds' })
  declare totalOdds: number

  @column({ columnName: 'potential_payout' })
  declare potentialPayout: number

  @column()
  declare status: 'pending' | 'won' | 'lost' | 'cancelled'

  @column({ columnName: 'bet_slip_type' })
  declare type: 'single' | 'multiple'

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Bet)
  declare bets: HasMany<typeof Bet>
}
