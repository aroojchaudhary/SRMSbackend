import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'assessments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('student_id').unsigned().references('id').inTable('students').onDelete('CASCADE').notNullable()
      table.integer('attempt_id').unsigned().references('id').inTable('attempts').onDelete('CASCADE').notNullable()
      table.unique(['student_id', 'attempt_id'])
      table.integer('obt_marks').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
