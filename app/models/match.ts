import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Bet from './bet.js'

export default class Match extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare homeTeam: string

  @column()
  declare awayTeam: string

  @column()
  declare competition: string

  @column.dateTime()
  declare matchDate: DateTime

  @column()
  declare status: 'upcoming' | 'live' | 'finished' | 'cancelled'

  // Momios para diferentes tipos de apuestas
  @column()
  declare odds1: number // Gana equipo local

  @column()
  declare oddsX: number // Empate

  @column()
  declare odds2: number // Gana equipo visitante

  @column()
  declare odds1X: number // Doble oportunidad: 1 o X

  @column()
  declare odds12: number // Doble oportunidad: 1 o 2

  @column()
  declare oddsX2: number // Doble oportunidad: X o 2

  @column()
  declare oddsOver25: number // Más de 2.5 goles

  @column()
  declare oddsUnder25: number // Menos de 2.5 goles

  @column()
  declare oddsOver65Corners: number // Más de 6.5 corners

  @column()
  declare oddsUnder65Corners: number // Menos de 6.5 corners

  // Resultados (para cuando el partido termine)
  @column()
  declare homeScore: number | null

  @column()
  declare awayScore: number | null

  @column()
  declare totalCorners: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Bet)
  declare bets: HasMany<typeof Bet>
}
