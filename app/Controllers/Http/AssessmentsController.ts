import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { paginationUtils } from 'App/Utils/paginationUtils';
import Assessment from "App/Models/Assessment";

export default class AssessmentController {

  //Create Assessment
  public async store({ request, response }: HttpContextContract) {
    try {
      const assessments = request.only([
        'student_id',
        'attempt_id',
        'obt_marks'
      ])
      const data = await Assessment.create(assessments);
      return response.send(data);
    } catch (error) {
      return response.status(400).send(error);
    }
  }

  //Get all Assessments
  public async index({ response }: HttpContextContract) {
    try {
      const assessments = await Assessment.query()
        .preload('student')
        .preload('attempt', (attemptQuery) => {
          attemptQuery.preload('subject');
        })
  
      const responseData = assessments.map((assessment: any) => {
        const { student, attempt} = assessment;
        return {
          studentName: student.name,
          username: student.username,
          batch: student.batch,
          testName: attempt.name,
          subject: attempt.subject.name,
          class: attempt.class,
          totalMarks: attempt.marks,
          obtMarks: assessment.obt_marks,
        };
      });
      return response.json({
        data: responseData,
      });
    } catch (error) {
      return response.status(400).send(error);
    }
  }

  //Update specific Assessment by id
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const data = await Assessment.findOrFail(params.id);
      const assessments = request.only([
        'student_id',
        'attempt_id',
        'obt_marks'
      ])
      const updatedResult = data.merge(assessments);
      await updatedResult.save();
      return response.send(updatedResult);
    } catch (error) {
      return response.status(400).send(error);
    }
  }

  //Delete specific Assessment by id
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const data = await Assessment.findOrFail(params.id);
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
      const query = Assessment.query()
      .preload('student')
      .preload('attempt', (attemptQuery) => {
        attemptQuery.preload('subject');
      });
      const paginationOptions = {
        page: page,
        pageSize: page_size,
        filter,
        sort,
      };
      const paginatedData = await paginationUtils(query, paginationOptions, response);
      const responseData = paginatedData?.paginatedData.toJSON().data.map((assessment) => {
        const { student, attempt} = assessment;
        return {
          studentName: student.name,
          username: student.username,
          batch: student.batch,
          testName: attempt.name,
          subject: attempt.subject.name,
          class: attempt.className,
          totalMarks: attempt.marks,
          obtMarks: assessment.obt_marks,
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