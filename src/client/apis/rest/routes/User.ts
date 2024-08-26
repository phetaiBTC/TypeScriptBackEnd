import { Router, Request, Response } from 'express'
import { authorizeRoles as Roles} from '@/middlewares/auth'
import userController from '../controller/userController'
import uploadImage from '@/service/formidable'
const router: Router = Router()
router.route('/get-users')
  .get(userController.getUsers)
router.route('/delete-users/:_id')
  .delete(userController.delete)
router.route('/edit-users/:_id')
  .get(userController.edit)
router.route('/update-users')
  .put(userController.update)


export default router