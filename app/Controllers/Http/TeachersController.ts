import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from '@ioc:Adonis/Lucid/Database';
import { paginationUtils } from 'App/Utils/paginationUtils';
import csv from 'csv-parser';
import fs from 'fs';
import Teacher from "App/Models/Teacher";
import {
  Createvalidations,
  Updatevalidations,
} from "App/validators/TeacherValidator"
export default class TeacherController {

  //Create Teacher
  public async store({ request, response }: HttpContextContract) {
    try {
      await request.validate({ schema: Createvalidations });
      const teacher = request.only([
        'name',
        'gender',
        'username',
        'password',
        'phone_number',
        'subject_id'
      ])
      const data = await Teacher.create(teacher);
      return response.send(data);
    } catch (error) {
      return response.status(400).send(error);
    }
  }

  //Get all Teachers
  public async index({ response }: HttpContextContract) {
    try {
      const teachers = await Teacher.query()
        .preload('subject')
      const responseData = teachers.map((teacher: any) => {
        return {
          id: teacher.id,
          name: teacher.name,
          gender: teacher.gender,
          phone_number: teacher.phoneNumber,
          username: teacher.username,
          subject: teacher.subject.name,
          createdAt: teacher.createdAt,
          updatedAt: teacher.updatedAt
        };
      });
      return response.json({
        data: responseData
      });
    }
    catch (error) {
      return response.status(400).send(error);
    }
  }

  // //Get specific Teacher by id
  // public async show({ params, response }: HttpContextContract) {
  //   try {
  //     const data = await Teacher.findOrFail(params.id);
  //     return response.ok(data);
  //   }
  //   catch (error) {
  //     return response.status(400).send(error);
  //   }
  // }

  //Update specific Teacher by id
  public async update({ params, request, response }: HttpContextContract) {
    try {
      await request.validate({ schema: Updatevalidations });
      const data = await Teacher.findOrFail(params.id);
      const teacher = request.only([
        'name',
        'gender',
        'username',
        'phone_number',
        'subject_id'
      ])
      const updatedUser = data.merge(teacher);
      await updatedUser.save();
      return response.send(updatedUser);
    } catch (error) {
      return response.status(400).send(error);;
    }
  }

  //Delete specific Teacher by id
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const data = await Teacher.findOrFail(params.id);
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
      const { page, page_size, sort, filter } = request.body();
      const query = Teacher.query().preload('subject');
      const paginationOptions = {
        page: page,
        pageSize: page_size,
        filter,
        sort,
      };
      const paginatedData = await paginationUtils(query, paginationOptions, response);
      const responseData = paginatedData?.paginatedData.toJSON().data.map((teacher) => {
        return {
          id: teacher.id,
          name: teacher.name,
          gender: teacher.gender,
          phone_number: teacher.phoneNumber,
          username: teacher.username,
          subject: teacher.subject.name,
          createdAt: teacher.createdAt,
          updatedAt: teacher.updatedAt,
        };
      });
      const paginationMeta = {
        // @ts-ignore
        total: paginatedData?.paginatedData.totalNumber,
        per_page: paginatedData?.paginatedData.perPage,
        current_page: paginatedData?.paginatedData.currentPage,
        last_page: paginatedData?.paginatedData.lastPage,
        first_page: paginatedData?.paginatedData.firstPage,
      };
      const responseObj = {
        total: paginatedData?.total,
        paginatedData: {
          meta: paginationMeta,
          data: responseData,
        },
      };
      return response.json(responseObj);
    } catch (error) {
      console.error(error);
      return response.status(400).send(error);
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
      const teachers: any[] = [];
      await new Promise<void>((resolve, reject) => {
        if (!file?.tmpPath) {
          reject(new Error('File path is undefined'));
          return;
        }
        const stream = fs.createReadStream(file.tmpPath);
        stream.pipe(csv())
          .on('data', async ({ name, gender, username, password, phone_number, subject }) => {
            const subject_data = await Database.query().select('id').from('subjects').where('name', subject).first();
            const subject_id = subject_data.id;
            console.log("--->>", subject_id);
            teachers.push({ name, gender, username, password, phone_number, subject_id });
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
      const createdTeachers = await Teacher.createMany(teachers);
      return response.send({ message: 'Teachers imported successfully', data: createdTeachers });
    }
    catch (error) {
      console.error(error);
      return response.status(400).send(error);
    }
  }
}