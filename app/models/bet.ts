import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Match from './match.js'
import BetSlip from './bet_slip.js'

export default class Bet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare betSlipId: number

  @column()
  declare matchId: number

  @column()
  declare betType: string // '1', 'X', '2', '1X', '12', 'X2', 'over_2_5', 'under_2_5', 'over_6_5_corners', 'under_6_5_corners'

  @column()
  declare odds: number // Momios para esta apuesta específica

  @column()
  declare result: 'pending' | 'won' | 'lost' | 'cancelled' | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Match)
  declare match: BelongsTo<typeof Match>

  @belongsTo(() => BetSlip)
  declare betSlip: BelongsTo<typeof BetSlip>
}
