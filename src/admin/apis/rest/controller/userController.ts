import { Request, Response } from 'express'
import { signToken } from '@/utils/jwt'
import Users from '@/models/Users'
import { genHash } from '@/utils/bcrypt'
const userController = {
  login: async (req: Request, res: Response) => {
    try {
      const auth = req.user
      const is_user: any = await Users.findOne({ _id: auth })
      const accessToken = signToken(auth)
      res.status(200).json({ username: is_user.username, accessToken })
    } catch (e) {
      res.send(e)
    }
  },
  Register: async (req: Request, res: Response) => {
    const { username, password, email, role, mobile } = req.body
    try {

      if (!email) return res.status(404).json({ massage: "Please Enter your email!" })
      const isEmail = await Users.findOne({ email })
      if (isEmail) return res.status(409).json({ message: "This email already exists in the system, please use another email" })
      const addUser = new Users({ username, email: email.toLowerCase(), password: genHash(password), role, mobile })
      await addUser.save()
      res.status(201).json({ massage: addUser })
    }
    catch (e) {
      res.status(501).send(e)
    }
  },
  GetUsers: async (req: Request, res: Response) => {
    const { page, perpage, search }: any = req.query
    try {
      const isPage = parseInt(page)
      const isPerPage = parseInt(perpage)
      const isUsers = await Users.find({
        $and: [
          search ? {
            $or: [
              { username: { $regex: search, $options: 'i' } }
            ]
          } : {}
        ]
      }).skip((isPage * isPerPage) - isPerPage).limit(isPerPage)

      const count = await Users.find({}).countDocuments()
      res.status(200).json({ Users: isUsers, Count: count })
    } catch (e) {
      res.status(401).send(e)
    }
  },
  EditYourSelf: async (req: Request, res: Response) => {
    const { username, password, email, role, mobile } = req.body
    const auth = req.user
    const isUser = await Users.findOne({ _id: auth })
  }
}
export default userController