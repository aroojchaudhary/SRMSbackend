import { rules, schema } from "@ioc:Adonis/Core/Validator";

//student_subjects validations
export const Createvalidations = schema.create({
  username: schema.string({}, [
    rules.required(),
    rules.regex(/^\d{4}-[A-Z]{4}-\d{4}$/), // Custom format for username (e.g., 2021-FAST-1101)
  ]),
  subject:schema.string({},[rules.required()])
});

export const Updatevalidations = schema.create({
  username: schema.string({}, [
    rules.required(),
    rules.regex(/^\d{4}-[A-Z]{4}-\d{4}$/), // Custom format for username (e.g., 2021-FAST-1101)
  ]),
  subject:schema.string({},[rules.required()])
});