import Jwt from 'jsonwebtoken'

const secret: string = process.env.JWT_SECRET || 'khueher2020'

export const signToken = (user: any) => {
    return Jwt.sign({   // Generate Token
        userId: user._id
    }, secret, { expiresIn: '30d' }) // secret key
}
export const signVerificationCodeToken = (email: number, verifyCode: string) => {
    return Jwt.sign({
        email,
        verifyCode
    }, secret, { expiresIn: '15m' })
}

export const loginToken = (userId: String) => {
    return Jwt.sign({
        userId
    }, secret, { expiresIn: '365d' })
}

export const jwtVerify = (token: string) => {
    try {
        return Jwt.verify(token, secret)
    }
    catch (e) {
        console.error(e)
    }
}