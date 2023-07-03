import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateValidations, UpdateValidations } from 'App/validators/SubjectValidator'
import Subject from 'App/Models/Subject'

export default class SubjectsController {

    //Create subject
    public async store({ request, response }: HttpContextContract) {
        try {
            await request.validate({ schema: CreateValidations })
            const subject = request.only([
                'name',
                'course_code'
            ])
            const data = await Subject.create(subject)
            return response.send(data)
        }
        catch (error) {
            return response.send(error)
        }
    }

    //Get all subjects
    public async index({ response }: HttpContextContract) {
        try {
            const data = await Subject.all();
            return response.send(data);
        }
        catch (error) {
            return response.send(error)
        }
    }

    //Update specific student by id
    public async update({ params, request, response }: HttpContextContract) {
        try {
            await request.validate({ schema: UpdateValidations });
            const subject = await Subject.findOrFail(params.id);
            const data = request.only([
                'name',
                'course_code'
            ])
            const updatedSubject = subject.merge(data);
            await updatedSubject.save();
            return response.send(updatedSubject);
        } catch (error) {
            return response.send(error);
        }
    }

    //Delete specific subject by id
    public async destroy({ params, response }: HttpContextContract) {
        try {
            const data = await Subject.findOrFail(params.id);
            await data.delete();
            return response.send("Deleted successfully");
        }
        catch (error) {
            return response.send(error)
        }
    }

}
