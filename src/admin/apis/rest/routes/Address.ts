import { Router } from 'express'
import Address from '../controller/addressController'
const router: Router = Router()

router.route('/address-province')
  .get(Address.getProvince)

router.route('/address-district')
  .get(Address.getDistrict)

router.route('/get-address')
  .get(Address.getAddress)

export default router