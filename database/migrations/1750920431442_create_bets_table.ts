import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('bet_slip_id')
        .unsigned()
        .references('id')
        .inTable('bet_slips')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('match_id')
        .unsigned()
        .references('id')
        .inTable('matches')
        .onDelete('CASCADE')
        .notNullable()

      table.string('bet_type').notNullable() // '1', 'X', '2', '1X', '12', 'X2', 'over_2_5', 'under_2_5', 'over_6_5_corners', 'under_6_5_corners'
      table.decimal('odds', 8, 2).notNullable() // Momios para esta apuesta específica
      table.enum('result', ['pending', 'won', 'lost', 'cancelled']).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
