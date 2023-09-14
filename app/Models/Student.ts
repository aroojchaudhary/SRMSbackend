import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  BaseModel,
  beforeSave,
  HasMany,
  column,
  hasMany,
  manyToMany,
  ManyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Subject from "./Subject";
import Assessment from "./Assessment";

export default class Student extends BaseModel {

  //Many to Many relationship between students and subjects table
  @manyToMany(() => Subject, {
    localKey:'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'subject_id',
    pivotTable: 'student_subjects',
    pivotTimestamps: true
  })
  public subjects: ManyToMany<typeof Subject>

  //One to Many relationship between students and assessments table
  @hasMany(() => Assessment, {
    foreignKey: "studentId",
  })
  public assessments: HasMany<typeof Assessment>;

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
  public phoneNumber: string;

  @column()
  public batch: string;

  @column()
  public className:string
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(students: Student) {
    if (students.$dirty.password) {
      students.password = await Hash.make(students.password);
    }
  }
}