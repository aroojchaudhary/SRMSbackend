import { DateTime } from 'luxon'
import { BaseModel, 
  // HasMany, 
  column, 
  // hasMany 
} from '@ioc:Adonis/Lucid/Orm'
// import Attempt from './Attempt'
// import Subject from './Subject'

export default class Assessment extends BaseModel {

  // @hasMany(()=>Attempt,{
  //   foreignKey:'assessmentId'
  // })
  // public attempts:HasMany<typeof Attempt>

  // @hasMany(()=>Subject, {
  //   foreignKey:'assessmentId'
  // })
  // public subjects:HasMany <typeof Subject>

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
