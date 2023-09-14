import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Admin from "App/Models/Admin";
import {
  Createvalidations,
  Updatevalidations,
} from "App/validators/AdminValidator";
export default class AdminController {

  //Create Admin
  public async store({ request, response }: HttpContextContract) {
    try {
      await request.validate({ schema: Createvalidations });
      const admin = request.only([
        'username',
        'password'
      ])
      const data = await Admin.create(admin);
      return response.send(data);
    } catch (error) {
      return response.status(400).send(error);
    }
  }

  //Get all Admins
  public async index({ response }: HttpContextContract) {
    try {
      const data = await Admin.all();
      return response.send(data);
    }
    catch (error) {
      return response.status(400).send(error);
    }
  }

  //Update specific Admin by id
  public async update({ params, request, response }: HttpContextContract) {
    try {
      await request.validate({ schema: Updatevalidations });
      const data = await Admin.findOrFail(params.id);
      const admin = request.only([
        'username',
        'password'
      ])
      const updatedUser = data.merge(admin);
      await updatedUser.save();
      return response.send(updatedUser);
    } catch (error) {
      return response.status(400).send(error);
    }
  }

  //Delete specific admin by id
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const data = await Admin.findOrFail(params.id);
      await data.delete();
      return response.send("Deleted successfully");
    }
    catch (error) {
      return response.status(400).send(error);
    }
  }
}