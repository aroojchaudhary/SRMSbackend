import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';

export default class StudentSubjectsController {

    //create student_subjects
    public async store({ request, response }: HttpContextContract) {
        try {
            const { student_id, subject_id } = request.only(['student_id', 'subject_id']);
            const Id = await Database.table('student_subjects').insert({ student_id, subject_id });
            const data = await Database.from('student_subjects').where('id', Id[0]).first();
            return response.send(data);
        }
        catch (error) {
            return response.status(400).send(error);
        }
    }

    //Get all student_subjects
    public async index({ response }: HttpContextContract) {
        try {
            const studentSubjects = await Database.from('student_subjects')
                .select('students.username', 'subjects.name as subjectName')
                .join('students', 'students.id', 'student_subjects.student_id')
                .join('subjects', 'subjects.id', 'student_subjects.subject_id');
            return response.send(studentSubjects)
        }
        catch (error) {
            return response.status(400).send(error);
        }

    }

    // //Update specific student_subjects by id
    public async update({ params, request, response }: HttpContextContract) {
        try {
            const { student_id, subject_id } = request.only(['student_id', 'subject_id']);
            await Database.from('student_subjects').where('id', params.id).update({ student_id, subject_id });
            const data = await Database.query().select('*').from('student_subjects').where('id', params.id).first();
            return response.send(data);
        }
        catch (error) {
            return response.status(400).send(error);
        }
    }

    //Delete specific student_subjects by id
    public async destroy({ params, response }: HttpContextContract) {
        try {
            await Database.from('student_subjects').where('id', params.id).delete();
            return response.send("Delete Successfully")
        }
        catch (error) {
            return response.status(400).send(error);
        }
    }

    //pagination functionality
    public async pagination({ request, response }: HttpContextContract) {
        try {
            interface RequestBody {
                page: number;
                page_size: number;
                sort: {
                    column: string;
                    order: string;
                };
                filter: Array<{
                    columns: Array<string | null>;
                    operation: string;
                    value: string;
                }>;
            }
            const { page, page_size, sort = { column: '', order: '' }, filter = [{ columns: [], operation: "", value: "" }] } = request.body as unknown as RequestBody;
            // Construct the base query
            const baseQuery = Database.from('student_subjects')
                .select('students.username', 'subjects.name as subjectName')
                .count('* as total') // Include the count aggregation
                .innerJoin('students', 'students.id', 'student_subjects.student_id')
                .innerJoin('subjects', 'subjects.id', 'student_subjects.subject_id')
                .groupBy('students.username', 'subjects.name');
            // Apply sorting
            if (sort.column && (sort.order === "asc" || sort.order === "desc")) {
                baseQuery.orderBy(sort.column, sort.order);
            }
            // Apply filtering
            if (filter[0].value !== '') {
                const columnName = 'subjects.name'; // Assuming the column name for subject name
                baseQuery.where(columnName, 'like', `%${filter[0].value}%`);
            }
            // Get total count before applying pagination
            const totalCount = await baseQuery.clone().count('* as total').first();
            // Apply pagination
            const paginatedData = await baseQuery
                .offset((page - 1) * page_size)
                .limit(page_size);
            const responseData = paginatedData.map(row => {
                return {
                    username: row.username,
                    subjectName: row.subjectName
                };
            });
            const paginationMeta = {
                total: totalCount.total,
                per_page: page_size,
                current_page: page,
                last_page: Math.ceil(totalCount.total / page_size)
            };
            const responseObj = {
                total: totalCount.total,
                paginatedData: {
                    meta: paginationMeta,
                    data: responseData
                }
            };
            return response.json(responseObj);
        } catch (error) {
            console.log(error);
            return response.json(error)
        }
    }
}
