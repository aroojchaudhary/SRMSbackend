import { DateTime } from 'luxon'
import Hash from "@ioc:Adonis/Core/Hash";
import { BaseModel, column, beforeSave } from '@ioc:Adonis/Lucid/Orm'

export default class Admin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string;

  @column({ serializeAs: null })
  public password: string;
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(admins: Admin) {
    if (admins.$dirty.password) {
      admins.password = await Hash.make(admins.password);
    }
  }
}
