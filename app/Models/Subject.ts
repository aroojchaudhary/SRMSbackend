import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany} from '@ioc:Adonis/Lucid/Orm'
import Student from './User'

export default class Subject extends BaseModel {

  //Many to Many relationship between students and subjects table
  @manyToMany(() => Student, {
    pivotTable: 'student_subjects',
    pivotColumns: ['username', 'subject'],
    pivotTimestamps: true,
    pivotForeignKey: 'subject_id',
    pivotRelatedForeignKey: 'student_id',
  })
  public students: ManyToMany<typeof Student>

  @column({ isPrimary: true })
  public id: number

  @column ()
  public name: string

  @column()
  public course_code: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
