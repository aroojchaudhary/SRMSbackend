import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { paginationUtils } from 'App/Utils/paginationUtils';
import Attempt from "App/Models/Attempt";
import {
  Createvalidations,
  Updatevalidations,
} from "App/validators/AttemptValidator"
export default class AttemptController {

  //Create Attempt
  public async store({ request, response }: HttpContextContract) {
    try {
      await request.validate({ schema: Createvalidations });
      const attempt = request.only([
        'name',
        'class_name',
        'marks',
        'subject_id'
      ])
      const data = await Attempt.create(attempt);
      return response.send(data);
    } catch (error) {
      return response.status(400).send(error);
    }
  }

  //Get all Attempts
  public async index({ response }: HttpContextContract) {
    try {
      const attempts = await Attempt.query()
        .preload('subject')
      const responseData = attempts.map((attempt: any) => {
        return {
          id: attempt.id,
          subject: attempt.subject.name,
          name: attempt.name,
          class: attempt.className,
          marks: attempt.marks,
          createdAt: attempt.createdAt,
          updatedAt: attempt.updatedAt
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

  //Update specific Teacher by id
  public async update({ params, request, response }: HttpContextContract) {
    try {
      await request.validate({ schema: Updatevalidations });
      const data = await Attempt.findOrFail(params.id);
      const attempt = request.only([
        'name_name',
        'class',
        'marks',
        'subject_id'
      ])
      const updatedUser = data.merge(attempt);
      await updatedUser.save();
      return response.send(updatedUser);
    } catch (error) {
      return response.status(400).send(error);
    }
  }

  //Delete specific Teacher by id
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const data = await Attempt.findOrFail(params.id);
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
      const query = Attempt.query().preload('subject');
      const paginationOptions = {
        page: page,
        pageSize: page_size,
        filter,
        sort,
      };
      const paginatedData = await paginationUtils(query, paginationOptions, response);
      const responseData = paginatedData?.paginatedData.toJSON().data.map((attempt) => {
        return {
          id: attempt.id,
          name: attempt.name,
          class_name:attempt.className,
          total_marks:attempt.marks,
          subject: attempt.subject.name,
          createdAt: attempt.createdAt,
          updatedAt: attempt.updatedAt,
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
}