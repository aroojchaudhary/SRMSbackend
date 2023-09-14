/**
 * Contract source: https://git.io/JOdz5
 *
 * Feel free to let us know via PR, if you find something broken in this
 * file.
 */

import Teacher from "App/Models/Teacher"
import Student from "App/Models/Student"
import Admin from "App/Models/Admin"
declare module '@ioc:Adonis/Addons/Auth' {
  /*
  |--------------------------------------------------------------------------
  | Providers
  |--------------------------------------------------------------------------
  |
  | The providers are used to fetch users. The Auth module comes pre-bundled
  | with two providers that are `Lucid` and `Database`. Both uses database
  | to fetch user details.
  |
  | You can also create and register your own custom providers.
  |
  */
  interface ProvidersList {
    /*
    |--------------------------------------------------------------------------
    | User Provider
    |--------------------------------------------------------------------------
    |
    | The following provider uses Lucid models as a driver for fetching user
    | details from the database for authentication.
    |
    | You can create multiple providers using the same underlying driver with
    | different Lucid models.
    |
    */
    admin: {
      implementation: LucidProviderContract<typeof Admin>
      config: LucidProviderConfig<typeof Admin>
    }
    student: {
      implementation: LucidProviderContract<typeof Student>
      config: LucidProviderConfig<typeof Student>
    }
    teacher: {
      implementation: LucidProviderContract<typeof Teacher>
      config: LucidProviderConfig<typeof Teacher>
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Guards
  |--------------------------------------------------------------------------
  |
  | The guards are used for authenticating users using different drivers.
  | The auth module comes with 3 different guards.
  |
  | - SessionGuardContract
  | - BasicAuthGuardContract
  | - OATGuardContract ( Opaque access token )
  |
  | Every guard needs a provider for looking up users from the database.
  |
  */
  interface GuardsList {
    /*
    |--------------------------------------------------------------------------
    | OAT Guard
    |--------------------------------------------------------------------------
    |
    | OAT, stands for (Opaque access tokens) guard uses database backed tokens
    | to authenticate requests.
    |
    */
    admin_api: {
      implementation: OATGuardContract<'admin', 'admin_api'>
      config: OATGuardConfig<'admin'>
      client: OATClientContract<'admin'>
    }
    student_api: {
      implementation: OATGuardContract<'student', 'student_api'>
      config: OATGuardConfig<'student'>
      client: OATClientContract<'student'>
    }
    teacher_api: {
      implementation: OATGuardContract<'teacher', 'teacher_api'>
      config: OATGuardConfig<'teacher'>
      client: OATClientContract<'teacher'>
    }
  }
}
