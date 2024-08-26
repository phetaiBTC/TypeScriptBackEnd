import { Router } from 'express'
import { authorizeRoles as Roles } from '@/middlewares/auth'
import userController from '../controller/userController'
// import Address from '../controller/addressController'
import { Validators as V } from '@/admin/Validator/UserValidator'
import { adminSignInOrStaffSignIn } from '../../../../middlewares/auth'

const a = "Admin"
const s = "Staff"

const router: Router = Router()

router.route('/user-login')
  .post(V.login, adminSignInOrStaffSignIn, userController.login)

router.route('/user-register')
  .post(V.register, userController.Register)

router.route('/user-get')
  .get(Roles([a, s]), userController.GetUsers)

router.route('/user-delete/:id')
  .delete(Roles(['Admin', 'Staff']), userController.DeletUser)

router.route('/user-hard-delete/:id')
  .delete(Roles([a, s]), userController.HardDeletUser)

router.route('/user-restore/:id')
  .post(Roles([a]), userController.RestoreUser)

router.route('/user-edit-me')
  .put(V.editMe, Roles([a, s]), userController.EditYourSelf)

router.route('/user-verify-email')
  .post(Roles([a, s]), userController.verifyCationCode)

router.route('/user-resand-email')
  .post(Roles([a, s]), userController.ResandEmail)

router.route('/user-change-password')
  .post(V.changePassword, Roles([a, s]), userController.ChangePassword)

router.route('/user-forgot-password')
  .post(Roles([a, s]), userController.ForgotPassword)

router.route('/auth-me')
  .post(Roles([a, s]), userController.authMe)

router.route('/user-input-password')
  .post(V.forgotPassword, Roles([a, s]), userController.ForgotPassword2)

export default router