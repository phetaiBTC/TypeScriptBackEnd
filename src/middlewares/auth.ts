import { authenticate } from 'passport'
import passport from 'passport'
import { jwtVerify } from '@/utils/jwt'
import { Request, Response, NextFunction, response } from 'express'
import Users from '@/models/Users'

export const adminSignInOrStaffSignIn = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('adminSignInOrStaffSignIn', { session: false }, async (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.logIn(user, { session: false }, (err) => {
            if (err) return next(err);
            next();
        });
    })(req, res, next);
};
export const authorizeRoles = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const auth = req.user
        const is_user: any = await Users.findOne({ _id: auth ,isDelete:true})
        if (is_user) {
            return res.status(401).json({massage:"this account was delete"})
        }
        passport.authenticate('isAdminOrStaff', { session: false }, (err: any, user: any, info: any) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = user;
            if (roles.length && !roles.includes(user.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        })(req, res, next);
    };
};
