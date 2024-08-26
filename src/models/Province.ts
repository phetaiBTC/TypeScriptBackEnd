import { Schema, model } from "mongoose"
const ProvinceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    sortOder: {
        type: Date,
        required: true
    }
}, { timestamps: true })
const Province = model('Province', ProvinceSchema, 'Province')
export default Province