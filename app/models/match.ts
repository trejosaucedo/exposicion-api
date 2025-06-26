import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Bet from './bet.js'

export default class Match extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'home_team' })
  declare homeTeam: string

  @column({ columnName: 'away_team' })
  declare awayTeam: string

  @column()
  declare competition: string

  @column.dateTime({ columnName: 'match_date' })
  declare matchDate: DateTime

  @column()
  declare status: 'upcoming' | 'live' | 'finished' | 'cancelled'

  // Momios para diferentes tipos de apuestas
  @column({ columnName: 'odds_1' })
  declare odds1: number // Gana equipo local

  @column({ columnName: 'odds_x' })
  declare oddsX: number // Empate

  @column({ columnName: 'odds_2' })
  declare odds2: number // Gana equipo visitante

  @column({ columnName: 'odds_1x' })
  declare odds1X: number // Doble oportunidad: 1 o X

  @column({ columnName: 'odds_12' })
  declare odds12: number // Doble oportunidad: 1 o 2

  @column({ columnName: 'odds_x2' })
  declare oddsX2: number // Doble oportunidad: X o 2

  @column({ columnName: 'odds_over_25' })
  declare oddsOver25: number // Más de 2.5 goles

  @column({ columnName: 'odds_under_25' })
  declare oddsUnder25: number // Menos de 2.5 goles

  @column({ columnName: 'odds_over_65_corners' })
  declare oddsOver65Corners: number // Más de 6.5 corners

  @column({ columnName: 'odds_under_65_corners' })
  declare oddsUnder65Corners: number // Menos de 6.5 corners

  // Resultados (para cuando el partido termine)
  @column({ columnName: 'home_score' })
  declare homeScore: number | null

  @column({ columnName: 'away_score' })
  declare awayScore: number | null

  @column({ columnName: 'total_corners' })
  declare totalCorners: number | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @hasMany(() => Bet)
  declare bets: HasMany<typeof Bet>
}
