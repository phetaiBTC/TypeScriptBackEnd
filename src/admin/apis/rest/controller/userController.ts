import { Request, Response } from 'express'
import { signToken, signVerificationCodeToken, jwtVerify } from '@/utils/jwt'
import Users from '@/models/Users'
import { genHash, compareHash } from '@/utils/bcrypt'
import { Verify } from 'crypto'
import transporter from '@/plugins/nodemailer'
import { genNumber } from '@/utils/Generate'
import MailMessage from 'nodemailer/lib/mailer/mail-message'
const userController = {
  login: async (req: Request, res: Response) => {
    try {
      const auth = req.user
      const is_user: any = await Users.findOne({ _id: auth, isDelete: false })
      if (!is_user) return res.status(400).json({ massage: "this account was delete" })
      const accessToken = signToken(is_user)
      res.status(200).json({ username: is_user.username, role: is_user.role, accessToken })
    } catch (e) {
      res.send(e)
    }
  },
  Register: async (req: Request, res: Response) => {
    const { username, password, email, role, mobile } = req.body
    try {
      const isEmail = await Users.findOne({ email })
      if (isEmail) return res.status(409).json({ message: "This email already exists in the system, please use another email" })
      const addUser = new Users({ username, email: email.toLowerCase(), password: genHash(password), role, mobile })
      await addUser.save()
      const otp = genNumber(6)
      const accessToken = signVerificationCodeToken(email, otp)
      transporter.sendMail({
        to: email,
        subject: "Meseum verifycation code",
        html: `
        <html>
        <body>
          <h1>Meseum Verification Code</h1>
          <p>Here is your verification code: <strong></strong></p>
          <button><a href="${process.env.URL_FRONT_END}user/verify-email?otp=${otp}&token=${accessToken}">Verify email</a></button>
          <p>Your verification code will expire after 15 minutes.</p>
        </body>
      </html>`,
      })
      res.status(201).json({ addUser, accessToken })
    }
    catch (e) {
      console.error(e)
      res.status(501).send(e)
    }
  },
  GetUsers: async (req: Request, res: Response) => {
    const { page, perpage, get, search }: any = req.query
    try {
      const isPage = parseInt(page)
      const isPerPage = parseInt(perpage)
      const value = get === "1"

      const isUsers = await Users.find({
        $and: [
          search ? {
            $or: [
              { username: { $regex: search, $options: 'i' } }
            ]
          } : {}
        ], isDelete: value
      }).skip((isPage * isPerPage) - isPerPage).limit(isPerPage)
      const count = await Users.find({ isDelete: false }).countDocuments()
      res.status(200).json({ info: isUsers, Count: count })
    } catch (e) {
      res.status(401).send(e)
    }
  },
  EditYourSelf: async (req: Request, res: Response) => {
    const { username, mobile, email } = req.body
    const auth = req.user
    const isUser = await Users.findOne({ _id: auth })
    if (!isUser) return res.status(400).json({ massage: "User not fount!" })
    await Users.findByIdAndUpdate(isUser, { $set: { username, mobile, email } }, { new: true })
    return res.status(200).json({ massage: "Update User successfully!" })
  },
  DeletUser: async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const isUser = await Users.findOne({ isDelete: false, _id: id })
      if (!isUser) return res.status(400).json({ massage: "User not fount!" })
      await Users.findByIdAndUpdate(isUser, { $set: { isDelete: true } }, { new: true })
      res.status(200).json({ massage: "Delete successfully!" })
    }
    catch (e) {
      res.status(404).send(e)
    }
  },
  HardDeletUser: async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const isUser = await Users.findOne({ _id: id })
      if (!isUser) return res.status(400).json({ massage: "User not fount!" })
      await Users.findByIdAndDelete(id)
      res.status(200).json({ massage: "Hard Delete successfully!" })
    }
    catch (e) {
      res.status(404).send(e)
    }
  },
  RestoreUser: async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const isUser = await Users.findOne({ isDelete: true, _id: id })
      if (!isUser) return res.status(400).json({ massage: "User not fount!" })
      await Users.findByIdAndUpdate(isUser, { $set: { isDelete: false } }, { new: true })
      res.status(200).json({ massage: "Restore successfully!" })
    }
    catch (e) {
      res.status(404).send(e)
    }
  },
  verifyCationCode: async (req: Request, res: Response) => {
    const { verifyCode, verifyToken } = req.body
    try {
      const decode: any = jwtVerify(verifyToken)
      if (decode.verifyCode !== verifyCode) return res.status(409).json({ message: "Invalid code" })
      const user: any = await Users.findOne({ email: decode.email })
      user.isVerify = true
      await user.save()
      const accessToken = signToken(user)
      res.status(201).json({ accessToken })
    }
    catch (e) {
      res.status(501).send(e)
    }
  },
  ResandEmail: async (req: Request, res: Response) => {
    const { verifyToken }: any = req.query
    try {
      const decode: any = jwtVerify(verifyToken)
      const otp = genNumber(6)
      const accessToken = signVerificationCodeToken(decode.email, otp)
      transporter.sendMail({
        to: decode.email,
        subject: "Meseum verifycation code",
        html: `
        <html>
        <body>
          <h1>Meseum Verification Code</h1>
          <p>Here is your verification code: <strong></strong></p>
          <button><a href="${process.env.URL_FRONT_END}user/verify-email?otp=${otp}&token=${accessToken}">Verify email</a></button>
          <p>Your verification code will expire after 15 minutes.</p>
        </body>
      </html>`,
      })
      res.status(200).json({ accessToken })
    }
    catch (e) {
      res.status(501).send(e)
    }
  },
  ChangePassword: async (req: Request, res: Response) => {
    const { oldpassword, newpassword } = req.body
    try {
      const auth = req.user
      const isUser: any = await Users.findOne({ _id: auth })
      if (!compareHash(oldpassword, isUser.password)) return res.status(400).json({ massage: "Your old password is incorrect" })
      isUser.password = genHash(newpassword);
      await isUser.save();
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (e) {
      res.status(501).send(e)
    }
  },
  ForgotPassword: async (req: Request, res: Response) => {
    try {
      const auth = req.user
      const isUser: any = await Users.findOne({ _id: auth })
      const accessToken = signToken(isUser)
      transporter.sendMail({
        to: isUser.email,
        subject: "Khaoniewlao change password",
        html: `
        <html>
        <body>
          <h1>Change Password</h1>
          <p>click Here to change your password</p>
          <button><a href="${process.env.URL_FRONT_END}user/forgot-password?token=${accessToken}">change password</a></button>
          <p>this link will expire after 15 minutes.</p>
        </body>
      </html>`,
      })
      res.status(200).json({ massage: "Go to your email" })
    }
    catch (e) {
      res.status(501).send(e)
    }
  },
  ForgotPassword2: async (req: Request, res: Response) => {
    const { password } = req.body
    const { token } = req.query
    try {
      const auth: any = token
      const isId: any = jwtVerify(auth)
      const isUser = await Users.findOne({ _id: isId.userId })
      if (!isUser) return res.status(400).json({ massge: "User not found" })
      isUser.password = genHash(password)
      await isUser.save();
      res.status(200).json({ massage: "create password is successfully" })
    } catch (e) {
      res.status(501).send(e)
    }
  },
  authMe: async (req: Request, res: Response) => {
    const { token } = req.body
    try {
      const auth: any = token
      const isId: any = jwtVerify(auth)
      const isUser = await Users.findOne({ _id: isId.userId })
      res.status(200).json({ user: isUser })
    } catch (e) {
      res.status(501).send(e)
    }
  }
}
export default userController