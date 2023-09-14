import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Student from "App/Models/Student";
import { paginationUtils } from 'App/Utils/paginationUtils';
import csv from 'csv-parser';
import fs from 'fs';
import {
  Createvalidations,
  Updatevalidations,
} from "App/validators/StudentValidator";
export default class StudentController {

  //Create Student
  public async store({ request, response }: HttpContextContract) {
    try {
      const student = await request.validate({ schema: Createvalidations });
      // const student = request.only([
      //   'name',
      //   'gender',
      //   'username',
      //   'password',
      //   'phone_number',
      //   'batch',
      //   'class_name'
      // ])
      const data = await Student.create(student);
      return response.send(data);
    } catch (error) {
      return response.status(400).send(error);
    }
  }

  //Get all students
  public async index({ response }: HttpContextContract) {
    try {
      const data = await Student.all();
      return response.send(data);
    }
    catch (error) {
      return response.status(400).send(error);
    }
  }

  // //Get specific Student by id
  // public async show({ params, response }: HttpContextContract) {
  //   try {
  //     const data = await Student.findOrFail(params.id);
  //     return response.ok(data);
  //   }
  //   catch (error) {
  //     return response.status(400).send(error);
  //   }
  // }

  //Update specific Student by id
  public async update({ params, request, response }: HttpContextContract) {
    try {
      await request.validate({ schema: Updatevalidations });
      const data = await Student.findOrFail(params.id);
      const student = request.only([
        'name',
        'gender',
        'username',
        'phone_number',
        'batch',
        'class_name'
      ])
      const updatedUser = data.merge(student);
      await updatedUser.save();
      return response.send(updatedUser);
    } catch (error) {
      return response.status(400).send(error);
    }
  }

  //Delete specific Student by id
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const data = await Student.findOrFail(params.id);
      await data.delete();
      return response.send("Deleted successfully");
    }
    catch (error) {
      return response.status(400).send(error);
    }
  }

  //pagination functionality
  public async pagination({ request, response }: HttpContextContract) {
    try {
      const { page, page_size, filter, sort } = request.body();
      const query = Student.query();
      const paginationOptions = {
        page: page,
        pageSize: page_size,
        filter,
        sort,
      };
      const paginatedData = await paginationUtils(query, paginationOptions, response);
      console.log("-->",paginatedData);
      return response.json(paginatedData);
    } catch (error) {
      response.status(400).send(error)
    }
  }

  //  CSV Import functionality
  public async bulkUpdates({ request, response }: HttpContextContract) {
    try {
      const file = request.file('file', {
        extnames: ['csv'],
        size: '5mb',
      });
      if (!file) {
        return response.status(400).send({ error: 'No CSV file provided' });
      }
      const students: any[] = [];
      await new Promise<void>((resolve, reject) => {
        if (!file?.tmpPath) {
          reject(new Error('File path is undefined'));
          return;
        }
        const stream = fs.createReadStream(file.tmpPath);
        stream
          .pipe(csv())
          .on('data', ({ name, gender, username, password, phone_number, batch, class_name }) => {
            students.push({ name, gender, username, password, phone_number, batch, class_name });
          })
          .on('error', (error) => {
            reject(new Error('An error occurred while processing the CSV data: ' + error));
          })
          .on('end', () => {
            resolve();
          });
      });
      // Delete the temporary CSV file after processing
      if (file.tmpPath) {
        fs.unlinkSync(file.tmpPath);
      }
      const createdTeachers = await Student.createMany(students);
      return response.send({ message: 'Students imported successfully', data: createdTeachers });
    }
    catch (error) {
      console.error(error);
      return response.status(400).send(error);
    }
  }
}