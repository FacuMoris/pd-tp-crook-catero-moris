const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')

const usuarioController = require('../controllers/usuarioController')

router.post('/register', usuarioController.register)
router.post('/login', usuarioController.login)
router.get('/welcome', requireAuth, usuarioController.welcome)
router.get('/refresh-token', usuarioController.refreshToken)

module.exports = router
