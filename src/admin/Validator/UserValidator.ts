import { Request, Response, NextFunction } from "express";
import Validate from "../Validations/UserValidation";

const Bases_ValiDate = (ValiD: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ValiD.validateAsync(req.body);
    next();
  } catch (e: any) {
    return res.status(400).json({ error: e.details[0].message });
  }
};
export const Validators = {
  register: Bases_ValiDate(Validate.register),
  login: Bases_ValiDate(Validate.login),
  editMe: Bases_ValiDate(Validate.editME),
  changePassword: Bases_ValiDate(Validate.changePassword),
  forgotPassword: Bases_ValiDate(Validate.forgotPassword),
};
