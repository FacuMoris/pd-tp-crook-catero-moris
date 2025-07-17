const express = require('express')
const router = express.Router()

const jugadorController = require('../controllers/jugadorController')

router.get('/jugadores', jugadorController.index)

router.get('/jugadores/:ID', jugadorController.show)

router.put('/jugadores/:ID', jugadorController.update)

module.exports = router
