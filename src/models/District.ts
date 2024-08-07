import { Schema, model } from "mongoose"
const DistrictSchema = new Schema({
    name: {
        type: String
    },
    Province: {
        type: Schema.Types.ObjectId,
        ref: 'Province'
    }
}, { timestamps: true })
const District = model('District', DistrictSchema, 'District')
export default District