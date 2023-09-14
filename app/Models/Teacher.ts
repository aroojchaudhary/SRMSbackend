import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import Subject from "./Subject";
import {
  BaseModel,
  beforeSave,
  column,
  belongsTo,
  BelongsTo
} from "@ioc:Adonis/Lucid/Orm";

export default class Teacher extends BaseModel {

  //One to One relationship between teachers and subjects table
  @belongsTo(() => Subject)
  public subject: BelongsTo<typeof Subject>

  @column({ isPrimary: true })
  public id: number;

  @column()
  public subjectId: number;
  
  @column()
  public name: string;

  @column()
  public gender: string;

  @column()
  public username: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public phoneNumber: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(teachers: Teacher) {
    if (teachers.$dirty.password) {
      teachers.password = await Hash.make(teachers.password);
    }
  }
}