import Joi from 'joi'

const Errormassage = (field: string) => ({
  'string.length': `${field} ต้องมีความยาว 8 ตัวอักษร`,
  'string.pattern.base': `${field} ต้องประกอบด้วยตัวเลขเท่านั้น`,
  'string.empty': `${field} จำเป็นต้องระบุ`,
  'string.email': `${field} ต้องเป็นที่อยู่อีเมลที่ถูกต้อง`,
});

const Validate = {

  register: Joi.object({
    username: Joi.string().required().messages(Errormassage('username')),
    email: Joi.string().email().required().messages(Errormassage('email')),
    password: Joi.string().min(6).required().messages(Errormassage('password')),
    mobile: Joi.string().length(8).pattern(/^\d+$/).required().messages(Errormassage('mobile')),
    role: Joi.string().valid('Staff', 'Admin').required().messages(Errormassage('role'))
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages(Errormassage('email')),
    password: Joi.string().required().messages(Errormassage('password'))
  }),

  editME: Joi.object({
    username: Joi.string().required().messages(Errormassage('username')),
    email: Joi.string().email().required().messages(Errormassage('email')),
    mobile: Joi.string().length(8).pattern(/^\d+$/).required().messages(Errormassage('mobile')),
  }),
  changePassword: Joi.object({
    oldpassword: Joi.string().required().messages(Errormassage('oldpassword')),
    newpassword: Joi.string().length(8).required().messages(Errormassage('newpassword')),
  }),
  forgotPassword: Joi.object({
    password: Joi.string().length(8).required().messages(Errormassage('password')),
  }),
};

export default Validate;
