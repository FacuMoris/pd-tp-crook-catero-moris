const express = require('express')
const router = express.Router()

const rangoController = require('../controllers/rangoController')

router.get('/rangos', rangoController.index)
router.get('/rangos/:ID', rangoController.show)
router.post('/rangos', rangoController.store)
router.put('/rangos/:ID', rangoController.update)

module.exports = router
