import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'matches'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('home_team').notNullable()
      table.string('away_team').notNullable()
      table.string('competition').notNullable()
      table.timestamp('match_date').notNullable()
      table.enum('status', ['upcoming', 'live', 'finished', 'cancelled']).defaultTo('upcoming')

      // Momios para ganador
      table.decimal('odds_1', 8, 2).notNullable() // Gana local
      table.decimal('odds_x', 8, 2).notNullable() // Empate
      table.decimal('odds_2', 8, 2).notNullable() // Gana visitante

      // Momios para doble oportunidad
      table.decimal('odds_1x', 8, 2).notNullable() // Local o empate
      table.decimal('odds_12', 8, 2).notNullable() // Local o visitante
      table.decimal('odds_x2', 8, 2).notNullable() // Empate o visitante

      // Momios para total de goles
      table.decimal('odds_over_25', 8, 2).notNullable() // Más de 2.5 goles
      table.decimal('odds_under_25', 8, 2).notNullable() // Menos de 2.5 goles

      // Momios para corners
      table.decimal('odds_over_65_corners', 8, 2).notNullable() // Más de 6.5 corners
      table.decimal('odds_under_65_corners', 8, 2).notNullable() // Menos de 6.5 corners

      // Resultados (null hasta que termine el partido)
      table.integer('home_score').nullable()
      table.integer('away_score').nullable()
      table.integer('total_corners').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
