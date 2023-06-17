import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { validations } from 'App/validators/RegisterValidator'
export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const data = await request.validate({schema: validations})
    const user = await User.create(data)
    return response.send(user)
  }

  //   login function
  public async login({ request, response, auth }: HttpContextContract) {
    const password = await request.input('password')
    const email = await request.input('email')

    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '24hours',
      })
      return response.send(token.toJSON())
    } catch {
      return response
        .status(400)
        .send({ error: { message: 'User with provided credentials could not be found' } })
    }
  }

  //   logout function
  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.status(200)
  }
}
