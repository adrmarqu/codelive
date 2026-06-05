/* Login, Signin, recuperate, verify */

const express = require('express');
const router = express.Router();

const { login, signin, formCourse } = require('../controllers/auth.js');

router.post('/login', login);
router.post('/signin', signin);
router.post('/create-course', formCourse);

module.exports = router;