import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Student from 'App/Models/Student';
import Teacher from 'App/Models/Teacher';
import Assessment from 'App/Models/Assessment';
import { DateTime } from 'luxon';

export default class DashboardController {

    //get total number of teachers
    public async totalTeachers({ response }: HttpContextContract) {
        try {
            const data = await Teacher.query().count('* as total');
            const dashboardData = {
                totalTeachers: data[0].$extras.total
            }
            return response.send(dashboardData)
        } catch (error) {
            return response.status(400).send(error)
        }
    }

    //get total number of first year students
    public async totalFirstYearStudents({ response }: HttpContextContract) {
        try {
            const data = await Student.query().where('class_name', '1st-Year').count('* as total');
            const dashboardData = {
                totalFirstYearStd: data[0].$extras.total
            }
            return response.send(dashboardData)
        } catch (error) {
            return response.status(400).send(error)
        }
    }

    //get total number of second year students
    public async totalSecondYearStudents({ response }: HttpContextContract) {
        try {
            const data = await Student.query().where('class_name', '2nd-Year').count('* as total');
            const dashboardData = {
                totalSecondYearStd: data[0].$extras.total
            }
            return response.send(dashboardData)
        } catch (error) {
            return response.status(400).send(error)
        }
    }

    //monthly progress of all students
    public async monthlyProgress({ response }: HttpContextContract) {
        try {
            const assessments = await Assessment.query()
                .preload('student')
                .preload('attempt', (attemptQuery) => {
                    attemptQuery.preload('subject');
                })
                .exec();
            const currentDate = DateTime.now();
            const monthlyProgress = assessments.map((assessment: any) => {
                const { student, attempt } = assessment;

                // Get relevant fields from related models
                const { name: studentName, username, batch } = student;
                const { name: testName, class: testClass, subject, marks: totalMarks } = attempt;

                const { created_at, obt_marks } = assessment;

                // Calculate the number of months between the assessment creation date and the current date
                const monthsPassed = currentDate.diff(DateTime.fromISO(created_at), 'months').months;

                // Calculate the monthly progress percentage
                const monthlyProgress = (obt_marks / totalMarks) * 100;

                return {
                    studentName,
                    username,
                    batch,
                    testName,
                    subject: subject.name,
                    class: testClass,
                    totalMarks,
                    obtMarks: obt_marks,
                    monthlyProgress,
                    monthsPassed,
                };
            });
            return response.json({ monthlyProgress });
        } catch (error) {
            return response.status(400).send(error);
        }
    }
}
