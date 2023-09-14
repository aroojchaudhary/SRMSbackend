import { rules, schema } from "@ioc:Adonis/Core/Validator";

//Admin validations
export const Createvalidations = schema.create({
  username: schema.string({}, [
    rules.unique({ table: "students", column: "username" }),
    rules.required(),
  ]),
  password: schema.string({}, [
    rules.required(),
    rules.minLength(8),
    rules.regex(/[a-z]/),
    rules.regex(/[A-Z]/),
    rules.regex(/[0-9]/) 
  ]),
});

export const Updatevalidations = schema.create({
  username: schema.string({}, [
    rules.required(),
  ]),
  password: schema.string({}, [
    rules.required(),rules.minLength(8),
    rules.regex(/[a-z]/),
    rules.regex(/[A-Z]/),
    rules.regex(/[0-9]/),
  ]),
});