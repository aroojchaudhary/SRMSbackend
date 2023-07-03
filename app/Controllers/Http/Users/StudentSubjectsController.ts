import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import { Createvalidations,Updatevalidations } from 'App/validators/studentSubjectsValidator';

export default class StudentSubjectsController {

    //create student_subjects
    public async store({ request, response }: HttpContextContract) {
        try {
            await request.validate({ schema: Createvalidations })
            const { username, subject } = request.only(['username', 'subject']);
            const Id = await Database.table('student_subjects').insert({ username,subject, });
            const data = await Database.from('student_subjects').where('id', Id[0]).first();
            return response.send(data);
        }
        catch (error) {
            return response.send(error)
        }

    }

    //Get all student_subjects
    public async index({ response }: HttpContextContract) {
        const data = await Database.query().select('*').from('student_subjects');
        return response.send(data);
    }

    // //Update specific student_subjects by id
    public async update({ params, request, response }: HttpContextContract) {
        try{
            await request.validate({ schema: Updatevalidations })
            const { username, subject } = request.only(['username', 'subject']);
            await Database.from('student_subjects').where('id', params.id).update({ username, subject });
            const data = await Database.query().select('*').from('student_subjects').where('id', params.id).first();
        return response.send(data);
        }
        catch(error){
            return response.send(error)
        }
    }

    //Delete specific student_subjects by id
    public async destroy({ params, response }: HttpContextContract) {
        try {
            await Database.from('student_subjects').where('id', params.id).delete();
            return response.send("Delete Successfully")
        }
        catch (error) {
            return response.send(error)
        }
    }
}
