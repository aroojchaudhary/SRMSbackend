import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { paginationUtils } from 'App/Utils/paginationUtils';
import Assessment from "App/Models/Assessment";
import Student from "App/Models/Student";
import Teacher from "App/Models/Teacher";
export default class ReportController {

    //Teachers report
    public async teachersReport({ request, response }: HttpContextContract) {
        try {
            const { page, page_size, sort, filter } = request.body();
            const query = Teacher.query().preload('subject');

            const paginationOptions = {
                page,
                pageSize: page_size,
                filter,
                sort,
            };

            const paginatedTeachers = await paginationUtils(query, paginationOptions, response);
            if (paginatedTeachers) {
                const teacherPerformance: Array<any> = [];
                for (const teacher of paginatedTeachers.paginatedData) {
                    const teacherData = {
                        id: teacher.id,
                        name: teacher.name,
                        subject: teacher.subject.name,
                    };

                    // Calculate 1st Year Performance
                    const firstYearAssessments = await getAssessmentsForTeacherAndYear(teacher, '1st-year');
                    const firstYearPerformance = calculatePerformance(firstYearAssessments);

                    // Calculate 2nd Year Performance
                    const secondYearAssessments = await getAssessmentsForTeacherAndYear(teacher, '2nd-year');
                    const secondYearPerformance = calculatePerformance(secondYearAssessments);

                    // Calculate Total Performance
                    const totalPerformance: number = calculateTotalPerformance(firstYearPerformance, secondYearPerformance);
                    const formattedTotalPerformance: string = totalPerformance.toFixed(2) + '%';

                    teacherData['firstYearPerformance'] = firstYearPerformance;
                    teacherData['secondYearPerformance'] = secondYearPerformance;
                    teacherData['totalPerformance'] = formattedTotalPerformance;
                    teacherPerformance.push(teacherData);
                }
                const paginationMeta = {
                    // @ts-ignore
                    total: paginatedTeachers?.paginatedData.totalNumber,
                    per_page: paginatedTeachers?.paginatedData.perPage,
                    current_page: paginatedTeachers?.paginatedData.currentPage,
                    last_page: paginatedTeachers?.paginatedData.lastPage,
                    first_page: paginatedTeachers?.paginatedData.firstPage,
                };

                const responseObj = {
                    total: paginatedTeachers?.total,
                    paginatedData: {
                        meta: paginationMeta,
                        data: teacherPerformance,
                    },
                };
                return response.json(responseObj);
            } else {
                return response.status(404).send('No paginated data found.');
            }
            // Function to fetch assessments for a teacher and year
            async function getAssessmentsForTeacherAndYear(teacher: any, year: string) {
                return Assessment.query()
                    .preload('attempt')
                    .whereHas('attempt', (attemptQuery) => {
                        attemptQuery.where('className', year);
                        if (teacher.subject && teacher.subject.id !== undefined) {
                            attemptQuery.where('subjectId', teacher.subject.id);
                        }
                    })
            }
            // Function to calculate performance percentage
            function calculatePerformance(assessments: any[]): string {
                const passThreshold = 0.5; // 50% threshold
                const totalStudents = assessments.length;
                const passCount = assessments.filter((assessment: any) => {
                    const { attempt } = assessment;
                    const totalMarks = attempt.marks;
                    const obtMarks = assessment.obt_marks;
                    const percentage = obtMarks / totalMarks;
                    const status = percentage >= passThreshold ? 'Pass' : 'Fail';
                    return status === 'Pass';
                }).length;
                const passRate = (passCount / totalStudents) * 100;
                const formattedPassRate = passRate.toFixed(2) + '%';
                return formattedPassRate;
            }
            // Function to calculate total performance
            function calculateTotalPerformance(firstYear: string, secondYear: string): number {
                const firstYearPassRate = parseFloat(firstYear);
                const secondYearPassRate = parseFloat(secondYear);
                const totalPassRate = (firstYearPassRate + secondYearPassRate) / 2;
                return totalPassRate;
            }
        } catch (error) {
            response.status(400).send(error)
        }
    }

    //Individual Teacher report
    public async individualTeacherReport({ request, response }: HttpContextContract) {
        try {
            const teacherId = request.input('teacherId');
            const month = request.input('month');
            const className = request.input('className');
            // Get the teacher's subject
            const teacher = await Teacher.query().where('id', teacherId).preload('subject').firstOrFail();
            // Count the total number of students in the given class
            const totalStudents = await Student.query().where('class_name', className).count('* as total').first();
            const totalStudentCount = totalStudents?.$extras.total;
            // Get the assessments for the given month and class name
            const assessments = await Assessment.query()
                .preload('attempt')
                .whereHas('attempt', (attemptQuery) => {
                    attemptQuery.where('className', className);
                    attemptQuery.where('subjectId', teacher.subject.id);
                })
                .whereRaw(`MONTH(created_at) = ?`, [month])
                .exec();
            // Calculate the analytics
            const passThreshold = 0.5;
            const pass = assessments.filter((assessment: any) => {
                const { attempt } = assessment;
                const totalMarks = attempt.marks;
                const obtMarks = assessment.obt_marks;
                const percentage = obtMarks / totalMarks;
                return percentage >= passThreshold;
            }).length;
            const fail = totalStudentCount - pass;
            const Percentage = ((pass / totalStudentCount) * 100).toFixed(2) + '%';
            // Determine remarks based on pass percentage
            let remarks = '';
            if (parseFloat(Percentage) >= 70) {
                remarks = 'Excellent';
            } else if (parseFloat(Percentage) >= 50) {
                remarks = 'Good';
            } else {
                remarks = 'Needs Improvement';
            }
            const analytics = {
                totalStudents: totalStudentCount,
                pass,
                fail,
                Percentage,
                remarks,
            };
            return response.send(analytics);
        } catch (error) {
            response.status(400).send(error);
        }
    }

    //Students report
    public async studentsReport({ request, response }: HttpContextContract) {
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
                const { student, attempt } = assessment;
                // Calculate pass percentage
                const totalMarks = attempt.marks;
                const obtMarks = assessment.obt_marks;
                const percentage = (obtMarks / totalMarks) * 100;
                // Determine status based on pass percentage
                const status = percentage >= 50 ? 'Pass' : 'Fail';
                return {
                    studentName: student.name,
                    totalMarks: attempt.marks,
                    obtMarks: assessment.obt_marks,
                    status
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
            console.log(error);
            return response.status(400).send(error);
        }
    }

    //Individual Student report
    // public async individualStudentReport({ request, response }: HttpContextContract) {
    //     try {
    //         const { page, page_size, sort, filter } = request.body();
    //         const studentId = request.input('studentId');
    //         const month = request.input('month');

    //         // Get the student's name
    //         const student = await Student.query().where('id', studentId).firstOrFail();
    //         // Load the student's subjects relationship
    //         await student.load('subjects');

    //         // Get the student's subjects through the relationship in the junction table
    //         const studentSubjects = student.getRelated('subjects');

    //         // Extract subject names from the subjects
    //         const subjectNames = studentSubjects.map((subject) => subject.name);
    //         // Get the assessments for the given month and student's subjects
    //         const query = Assessment.query()
    //             .preload('attempt')
    //             .whereHas('attempt', (attemptQuery) => {
    //                 attemptQuery.where('studentId', student.id);
    //             })
    //             .whereIn('test_name', studentSubjects.map((subject) => `12-${subject}-T1`)) // Assuming test name follows this format
    //             .whereRaw(`MONTH(created_at) = ?`, [month]);

    //         const paginationOptions = {
    //             page,
    //             pageSize: page_size,
    //             filter,
    //             sort,
    //         };

    //         const paginatedData = await paginationUtils(query, paginationOptions, response);

    //         const responseData = paginatedData?.paginatedData.toJSON().data.map((assessment) => {
    //             const { attempt } = assessment;
    //             const subjectMarksMap: { [subject: string]: number | null } = {};

    //             // Iterate through the student's subjects and fetch their respective marks
    //             subjectNames.forEach((subjectName) => {
    //                 const test_name = `12-${subjectName}-T1`; // Assuming test name follows this format
    //                 const subjectTest = attempt.subject_marks.find(
    //                     (subjectMark: { test_name: string, marks: number }) => subjectMark.test_name === test_name
    //                 );
    //                 if (subjectTest) {
    //                     subjectMarksMap[subjectName] = subjectTest.marks;
    //                 } else {
    //                     subjectMarksMap[subjectName] = null; // Set to null if subject test not found
    //                 }
    //             });

    //             // Calculate total marks
    //             const totalMarks = studentSubjects.reduce((total, subject) => {
    //                 return total + (subjectMarksMap[subject] || 0);
    //             }, 0);

    //             // Calculate pass percentage
    //             const passThreshold = 0.5;
    //             const obtMarks = assessment.obt_marks;
    //             const percentage = (obtMarks / totalMarks) * 100;

    //             // Determine status based on pass percentage
    //             const status = percentage > 50 ? 'Pass' : 'Fail';

    //             return {
    //                 studentName: student.name,
    //                 ...subjectMarksMap,
    //                 Obtained: obtMarks,
    //                 Total: totalMarks,
    //                 Percentage: percentage.toFixed(2) + '%',
    //                 Status: status,
    //             };
    //         });

    //         const paginationMeta = {
    //             total: paginatedData?.paginatedData.totalNumber,
    //             per_page: paginatedData?.paginatedData.perPage,
    //             current_page: paginatedData?.paginatedData.currentPage,
    //             last_page: paginatedData?.paginatedData.lastPage,
    //             first_page: paginatedData?.paginatedData.firstPage,
    //         };

    //         const responseObj = {
    //             total: paginatedData?.total,
    //             paginatedData: {
    //                 meta: paginationMeta,
    //                 data: responseData,
    //             },
    //         };

    //         return response.json(responseObj);
    //     } catch (error) {
    //         response.status(400).send(error);
    //     }
    // }
}
