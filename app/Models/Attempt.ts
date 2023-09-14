import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Assessment from './Assessment';
import Subject from './Subject';

export default class Attempt extends BaseModel {

  //One to Many relationship between attempts and assessments table
  @hasMany(() => Assessment, {
    foreignKey: "attemptId",
  })
  public assessments: HasMany<typeof Assessment>;

  //One to Many relationship between attempts and subjects table
  @belongsTo(() => Subject)
  public subject: BelongsTo<typeof Subject>

  @column({ isPrimary: true })
  public id: number

  @column()
  public subjectId: number;

  @column()
  public name:string;

  @column()
  public className:string;

  @column()
  public marks:number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
