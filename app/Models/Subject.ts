import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne, hasMany, HasMany, belongsTo, BelongsTo} from '@ioc:Adonis/Lucid/Orm'
import Teacher from './Teacher'
import Attempt from './Attempt'
import Student from './Student'

export default class Subject extends BaseModel {

  //Many to Many relationship between students and subjects table
  @belongsTo(() => Student)
  public stuednt: BelongsTo<typeof Student>

  //One to One relationship between teachers and subjects table
  @hasOne(() => Teacher, {
    foreignKey: 'subjectId',
    localKey: 'id'
  })
  public teacher: HasOne<typeof Teacher>

  //One to Many relationship between attempts and subjects table
  @hasMany(()=>Attempt, {
      foreignKey:'subjectId'
    })
    public attempts:HasMany <typeof Attempt>

  @column({ isPrimary: true })
  public id: number

  @column ()
  public name: string

  @column()
  public courseCode: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
