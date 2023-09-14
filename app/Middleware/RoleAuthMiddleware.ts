import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class RoleAuthMiddleware {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>, roles: string) {
    try {
      const role = request.header('X-Role');
      if (!role || roles!=role) {
        return response.unauthorized({ error: 'Invalid role' });
      }
      await next();
    } catch (error) {
      return response.unauthorized({ error: 'Unauthorized' });
    }
  }
}
