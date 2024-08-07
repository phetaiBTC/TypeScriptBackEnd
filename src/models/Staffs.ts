import { Schema, model } from "mongoose"
const StaffSchema = new Schema({
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  birthday: {
    type: Date
  },
  Users: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  District: {
    type: Schema.Types.ObjectId,
    ref: 'District'
  },
  isDelete: {
    type: Boolean
  },
  DeleteAt: {
    type: Date
  }
}, { timestamps: true })
const Staffs = model('Staffs', StaffSchema, 'Staffs')
export default Staffs