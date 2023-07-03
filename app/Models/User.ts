import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  BaseModel,
  beforeSave,
  // HasMany,
  column,
  // hasMany,
  manyToMany,
  ManyToMany,
} from "@ioc:Adonis/Lucid/Orm";
// import Attempt from "./Attempt";
import Subject from "./Subject";

export default class User extends BaseModel {

  //Many to Many relationship between students and subjects table
  @manyToMany(() => Subject, {
    pivotTable: 'student_subjects',
    pivotColumns: ['username', 'subject'],
    pivotTimestamps: true,
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'subject_id',
  })
  public subjects: ManyToMany<typeof Subject>

  //One to Many relationship between students and attempts table
  // @hasMany(() => Attempt, {
  //   foreignKey: "studentId",
  // })
  // public attempts: HasMany<typeof Attempt>;

  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public gender: string;

  @column()
  public username: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public phone_number: string;

  @column()
  public role:string;

  @column()
  public batch: string;

  @column()
  public subject:string

  @column()
  public class:string
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(users: User) {
    if (users.$dirty.password) {
      users.password = await Hash.make(users.password);
    }
  }
}