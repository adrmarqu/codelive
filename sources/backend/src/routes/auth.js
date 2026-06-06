/* Login, Signin, recuperate, verify */

const express = require('express');
const router = express.Router();

const { login, signin } = require('../controllers/auth.js');

router.post('/login', login);
router.post('/signin', signin);

module.exports = router;