import { authenticate } from 'passport'
import passport from 'passport'
import { Request, Response, NextFunction } from 'express'

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

