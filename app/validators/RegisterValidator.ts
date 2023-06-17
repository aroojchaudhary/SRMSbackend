import {rules, schema} from '@ioc:Adonis/Core/Validator'

export const validations = schema.create({
    email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string({}, [rules.confirmed()]),
    username: schema.string({}, [rules.unique({ table: 'users', column: 'username' })]),
  })