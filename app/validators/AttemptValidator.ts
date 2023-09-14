import { rules, schema } from "@ioc:Adonis/Core/Validator";

//attempts validations
export const Createvalidations = schema.create({
  name: schema.string({}, [
    rules.unique({ table: "attempts", column: "name" }),
    rules.required(),
    rules.regex(/^\d+-[a-zA-Z]+-\w+$/), // Custom format for name (e.g., 12-name-T1)
  ]),
  class_name: schema.string({}, [rules.required()]),
  marks: schema.number([rules.required()])
});

export const Updatevalidations = schema.create({
  name: schema.string({}, [
    rules.required(),
    rules.regex(/^\d+-[a-zA-Z]+-\w+$/), // Custom format for name (e.g., 12-name-T1)
  ]),
  class_name: schema.string({}, [rules.required()]),
  marks: schema.number([rules.required()])
});