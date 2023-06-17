import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Attempt from './Attempt'

export default class Student extends BaseModel {

  @hasMany(()=>Attempt,{
    foreignKey: 'studentId'
  })
  public attempts: HasMany<typeof Attempt>

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
