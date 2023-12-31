import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'attempts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('subject_id').unsigned().references('id').inTable('subjects').onDelete('CASCADE').notNullable()
      table.string('name',255).unique().notNullable()
      table.string('class_name',255).notNullable()
      table.integer('marks').notNullable

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['id', 'name'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
