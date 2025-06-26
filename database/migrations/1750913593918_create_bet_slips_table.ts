import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bet_slips'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table.decimal('total_stake', 12, 2).notNullable()
      table.decimal('total_odds', 8, 2).notNullable()
      table.decimal('potential_payout', 12, 2).notNullable()
      table.enum('status', ['pending', 'won', 'lost', 'cancelled']).defaultTo('pending')
      table.enum('bet_slip_type', ['single', 'multiple']).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
