/* Login, Signin, recuperate, verify */

const express = require('express');
const router = express.Router();

const { login, signin } = require('../controllers/auth.js');
const { requestRecovery, validateToken, resetPassword } = require('../controllers/recover.js');

router.post('/login', login);
router.post('/signin', signin);

/* Recuperación de contraseña */
router.post('/recover',              requestRecovery);
router.get('/recover/validate/:token', validateToken);
router.post('/recover/reset',        resetPassword);

module.exports = router;