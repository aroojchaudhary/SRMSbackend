import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users"

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.string("gender", 255).notNullable();
      table.string("username", 255).unique().notNullable();
      table.string("password", 255).notNullable();
      table.string("phone_number", 255).notNullable();
      table.string("role",255).notNullable();
      table.string("batch", 255);
      table.string("subject",255);
      table.string("class",255);
      
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });

      table.index(['id', 'username'])
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}