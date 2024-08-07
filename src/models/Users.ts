import { Schema, model } from "mongoose"
const userSchema = new Schema({
  username: {
    type: String
  },
  email: {
    type: String 
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: ['Admin', 'Staff']
  },
  mobile: {
    type: String,
  },
  isDelete: {
    type: Boolean,
    default:false
  },
  DeleteAt: {
    type: Date
    
  }
}, { timestamps: true })
const Users = model('Users', userSchema, 'Users')
export default Users