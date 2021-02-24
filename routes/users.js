var express = require('express');
var router = express.Router();
const {register, processRegister, processLogin, login, profile} = require('../controllers/usersController');

const uploadImages = require('../middlewares/uploadImages');
const registerValidator = require('../validations/registerValidator');
const checkUser = require('../middlewares/checkUser')


router.get('/register', register);
router.post('/register', uploadImages.any(), registerValidator, processRegister);

router.get('/login',login);
router.post('/login', processLogin);

router.get('/profile',checkUser ,profile)

module.exports = router;
