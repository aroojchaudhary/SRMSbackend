// import { schema } from '@ioc:Adonis/Core/Validator';
import { rules, schema } from '@ioc:Adonis/Core/Validator';

//subject validations
export const CreateValidations=schema.create({
    name: schema.string({},[rules.required(),rules.unique({ table: "subjects", column: "name" })]),
    course_code: schema.string({},[rules.required(),rules.unique({ table: "subjects", column: "course_code" })])
});

export const UpdateValidations=schema.create({
    name: schema.string({},[rules.required()]),
    course_code: schema.string({},[rules.required()])
});