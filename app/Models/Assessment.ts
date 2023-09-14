import { DateTime } from 'luxon'
import { BaseModel,  column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Attempt from './Attempt'
import Student from './Student'
export default class Assessment extends BaseModel {

  //One to Many relationship between attempts and assessments table
  @belongsTo(() => Attempt)
  public attempt: BelongsTo<typeof Attempt>

  //One to Many relationship between students and assessments table
  @belongsTo(() => Student)
  public student: BelongsTo<typeof Student>

  @column({ isPrimary: true })
  public id: number

  @column()
  public studentId: number;

  @column()
  public attemptId: number;

  @column()
  public obt_marks: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
