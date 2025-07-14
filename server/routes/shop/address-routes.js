

const express = require('express');

const {address,editAddress,deleteAddress,fetchAllAddress} = require('../../controllers/shop/address-controller')

const router = express.Router();

router.post('/add',address);
router.get('/get/:userId',fetchAllAddress);
router.delete('/delete/:userId/:addressId',deleteAddress);
router.put('/update/:userId/:addressId',editAddress);

module.exports = router;