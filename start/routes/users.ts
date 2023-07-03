import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  //login route
  Route.post('/login', 'Users/UsersController.login')

  //student CRUD route
  Route.get("/users/:id", "Users/UsersController.show")
  Route.post("/users", "Users/UsersController.store")
  Route.get("/users", "Users/UsersController.index")
  Route.put("/users/:id", "Users/UsersController.update")
  Route.delete("/users/:id", "Users/UsersController.destroy")

  //subject CRUD route
  Route.post("/subjects", "Users/SubjectsController.store")
  Route.get("/subjects", "Users/SubjectsController.index")
  Route.delete("/subjects/:id", "Users/SubjectsController.destroy")

  //student_subjects CRUD route
  Route.post("/student_subjects", "Users/StudentSubjectsController.store")
  Route.get("/student_subjects", "Users/StudentSubjectsController.index");
  Route.put("/student_subjects/:id", "Users/StudentSubjectsController.update");
  Route.delete("/student_subjects/:id", "Users/StudentSubjectsController.destroy");

}).prefix("api/v1");