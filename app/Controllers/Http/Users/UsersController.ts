import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import * as _ from 'lodash';
import {
  Createvalidations,
  Updatevalidations,
} from "App/validators/UserValidator";
export default class UserController {

  //Create User
  public async store({ request, response }: HttpContextContract) {
    try {
      await request.validate({ schema: Createvalidations });
      const user=request.only([
        'name',
        'gender',
        'username',
        'password',
        'phone_number',
        'role',
        'batch',
        'subject',
        'class'
      ])
      const data = await User.create(user);
      return response.send(data);
    } catch (error) {
      return response.send(error);
    }
  }

  //Get all Users
  public async index({ response }: HttpContextContract) {
    try{
      const data = await User.all();
      const filteredData = _.pickBy(data, _.identity);
      return response.send(filteredData);
    }
    catch(error){
      return response.send(error)
    }
  }

  //Get specific User by id
  public async show({ params, response }: HttpContextContract) {
    try{
      const data = await User.findOrFail(params.id);
      return response.ok(data);
    }
    catch(error){
      return response.send(error)
    }
  }

  //Update specific User by id
  public async update({ params, request, response }: HttpContextContract) {
    try {
      await request.validate({ schema: Updatevalidations });
      const data = await User.findOrFail(params.id);
      const user=request.only([
        'name',
        'gender',
        'username',
        'password',
        'phone_number',
        'role',
        'batch',
        'subject',
        'class'
      ])
      const updatedUser = data.merge(user);
      await updatedUser.save();
      return response.send(updatedUser);
    } catch (error) {
      return response.send(error);
    }
  }

  //Delete specific User by id
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const data = await User.findOrFail(params.id);
      await data.delete();
      return response.send("Deleted successfully");
    }
    catch (error) {
      return response.send(error)
    }
  }

  //   login functionallity
  public async login({ request, response, auth }: HttpContextContract) {
    const password = await request.input('password')
    const username = await request.input('username')
    try {
      const token = await auth.use('api').attempt(username, password, {
        expiresIn: '360 hours',
      })
      const user=await User.query().where('username',username).first();
      return response.send({
        token: token.toJSON(),
        role: user?.role, // Include the user role in the response
      });
  
    } catch {
      return response
        .status(400)
        .send({ error: { message: 'User with provided credentials could not be found' } })
    }
  }

  //   logout functionality
  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.status(200)
  }
}