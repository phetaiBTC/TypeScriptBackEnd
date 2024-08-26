import { Request, Response } from "express";
import District from "@/models/District";
import Province from "@/models/Province";

const Address = {
    getProvince: async (req: Request, res: Response) => {
        try {
            const isProvince: any = await Province.find()
            res.status(200).json({ Province: isProvince })
        } catch (e) {
            res.status(400).send(e)
        }
    },
    getDistrict: async (req: Request, res: Response) => {
        try {
            const isDistrict = await District.find()
            res.status(200).json({ District: isDistrict })
        } catch (e) {
            res.status(400).send(e)
        }
    },
    getAddress: async (req: Request, res: Response) => {
        try {
            const getProvince = await Province.find()
            const info = await Promise.all(
                getProvince.map(async (i: any) => {
                    return {
                        _id: i._id,
                        name: i.name,
                        districts: (await District.find()).map((d: any) => {
                            return {
                                _id: d._id,
                                name: d.name
                            }
                        })
                    }
                })
            )
            res.status(200).json({ info })
        }
        catch (e) {
            res.status(501).send(e)
        }
    },
}


export default Address