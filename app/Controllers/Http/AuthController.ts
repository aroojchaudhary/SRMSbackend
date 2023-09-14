import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
export default class AuthController {

  //   login functionality
  public async login({ request, response, auth }: HttpContextContract) {
    const username = await request.input('username')
    const password = await request.input('password')
    const role = await request.input('role')
    try {
      let token;
      if (role === 'student') {
        token = await auth.use('student_api').attempt(username, password, {
          expiresIn: '24 hours',
          role: role
        });
      } else if (role === 'teacher') {
        console.log("--->>", username, password, role);
        token = await auth.use('teacher_api').attempt(username, password, {
          expiresIn: '24 hours',
          role: role
        });
      } else if (role === 'admin') {
        token = await auth.use('admin_api').attempt(username, password, {
          expiresIn: '24 hours',
          role: role
        });
      } else {
        return response.badRequest({ error: { message: 'Invalid role' } });
      }
      return response.send({
        token: token.token,
        type: token.type,
        expires_at: token.expiresAt,
        role: token.meta.role, // Include the meta data in the response
      });
    }
    catch (error) {
      return response.status(400).send(error);
    }
  }

  //   logout functionality
  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.logout()
      return response.send("Logout Successfully")
    }
    catch (error) {

      return response.status(400).send(error);
    }
  }
}
