import { rules, schema } from "@ioc:Adonis/Core/Validator";

//teacher validations
export const Createvalidations = schema.create({
  username: schema.string({}, [
    rules.unique({ table: "teachers", column: "username" }),
    rules.required(),
    rules.regex(/^\d{4}-[A-Z]{4}-\d{4}$/), // Custom format for username (e.g., 2021-FAST-1101)
  ]),
  password: schema.string({}, [
    rules.required(),
    rules.minLength(8),
    rules.regex(/[a-z]/),
    rules.regex(/[A-Z]/),
    rules.regex(/[0-9]/) ,
  ]),
  phone_number: schema.string({}, [
    rules.required(),
    rules.regex(/^\+\d{12}$/), // Custom format for phone number (e.g., +923171600808)
  ]),
  name: schema.string({}, [rules.required()]),
  gender: schema.string({}, [rules.required()]),
});

export const Updatevalidations = schema.create({
  username: schema.string({}, [
    rules.required(),
    rules.regex(/^\d{4}-[A-Z]{4}-\d{4}$/), // Custom format for username (e.g., 2021-FAST-1101)
  ]),
  phone_number: schema.string({}, [
    rules.required(),
    rules.regex(/^\+\d{12}$/), // Custom format for phone number (e.g., +923171600808)
  ]),
  name: schema.string({}, [rules.required()]),
  gender: schema.string({}, [rules.required()]),
});