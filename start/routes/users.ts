import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // Routes accessible to all users
  Route.post('/login', 'AuthController.login')
  Route.post('/logout', 'AuthController.logout')

  // Routes accessible to students
  Route.group(() => {
  }).middleware(['auth', 'roleAuth:student']);

  // Routes accessible to teachers
  Route.group(() => {
  }).middleware(['auth', 'roleAuth:teacher']);

  // Routes accessible to admins
  Route.group(() => {
    //Admin CRUD routes
    Route.post("/admins","AdminsController.store")
    Route.get("/admins", "AdminsController.index")
    Route.put("/admins/:id", "AdminsController.update")
    Route.delete("/admins/:id", "AdminsController.destroy")
    //student CRUD routes
    Route.post("/students", "StudentsController.store")
    Route.get("/students", "StudentsController.index")
    Route.put("/students/:id", "StudentsController.update")
    Route.delete("/students/:id", "StudentsController.destroy")
    Route.post("/students/pagination", "StudentsController.pagination")
    Route.post("/students/bulk-updates", "StudentsController.bulkUpdates")
    //teacher CRUD routes
    Route.post("/teachers", "TeachersController.store")
    Route.get("/teachers", "TeachersController.index")
    Route.put("/teachers/:id", "TeachersController.update")
    Route.delete("/teachers/:id", "TeachersController.destroy")
    Route.post("/teachers/pagination", "TeachersController.pagination")
    Route.post("/teachers/bulk-updates", "TeachersController.bulkUpdates")
    //subject CRUD routes
    Route.post("/subjects", "SubjectsController.store")
    Route.get("/subjects", "SubjectsController.index")
    Route.put("/subjects/:id", "SubjectsController.update")
    Route.delete("/subjects/:id", "SubjectsController.destroy")
    //student_subjects CRUD routes
    Route.post("/student-subjects", "StudentSubjectsController.store")
    Route.get("/student-subjects", "StudentSubjectsController.index");
    Route.put("/student-subjects/:id", "StudentSubjectsController.update");
    Route.delete("/student-subjects/:id", "StudentSubjectsController.destroy");
    Route.post("/student-subjects/pagination", "StudentSubjectsController.pagination")
    //Attempt CRUD routes
    Route.post("/attempts", "AttemptsController.store")
    Route.get("/attempts", "AttemptsController.index")
    Route.put("/attempts/:id", "AttemptsController.update")
    Route.delete("/attempts/:id", "AttemptsController.destroy")
    Route.post("/attempts/pagination", "AttemptsController.pagination")
    //Assessment CRUD routes
    Route.post("/assessments", "AssessmentsController.store")
    Route.get("/assessments", "AssessmentsController.index")
    Route.put("/assessments/:id", "AssessmentsController.update")
    Route.delete("/assessments/:id", "AssessmentsController.destroy")
    Route.post("/assessments/pagination", "AssessmentsController.pagination")
    //Dashboard routes
    Route.get("/total-teachers", "DashboardController.totalTeachers")
    Route.get("/total-1y-students", "DashboardController.totalFirstYearStudents")
    Route.get("/total-2y-students", "DashboardController.totalSecondYearStudents")
    Route.get("/students-monthly-progress", "DashboardController.monthlyProgress")
    //Reports routes
    Route.post("/teachers/report","ReportsController.teachersReport")
    Route.post("/individual/teacher/report","ReportsController.individualTeacherReport")
    Route.post("/students/report","ReportsController.studentsReport")
    Route.post("/individual/student/report","ReportsController.individualTeacherReport")
  }).middleware(['auth', 'roleAuth:admin']);
}).prefix("api/v1");