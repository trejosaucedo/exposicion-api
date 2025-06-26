import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('email').unique().notNullable()
      table.string('full_name').notNullable()
      table.string('password').notNullable()
      table.decimal('balance', 12, 2).defaultTo(1000.0)
      table.boolean('is_active').defaultTo(true)
      table.enum('role', ['user', 'admin']).defaultTo('user')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
