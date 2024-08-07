import { Router } from 'express'
import { isAdmin } from '@/plugins/passport'
import userController from '../controller/userController'
import { adminSignInOrStaffSignIn } from '../../../../middlewares/auth'

const router: Router = Router()

router.route('/user-login')
  .post(adminSignInOrStaffSignIn, userController.login)

router.route('/user-register')
  .post(userController.Register)

router.route('/user-getusers')
  .get(userController.GetUsers)

export default router