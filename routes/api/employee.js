const express = require('express');
const validateBody = require('../../middlewares/validator');
const { registerValidationEmployee, loginValidation } = require('../../validations/user');
const employeeController = require('../../controller/employeeController');
const recruiterController = require('../../controller/recruiterController');

const router = express.Router();
const auth = require("../../middlewares/authenticate");
const loader = require('../../middlewares/staticLoader');


router.post('/register',employeeController.register);
router.post('/login',employeeController.login);
router.post('/logout',auth,employeeController.logout);
router.patch('/rezume',auth,loader.single("rezume"),employeeController.uploadRezume);
router.patch('/avatar',auth,loader.single("avatar"),employeeController.uploadAvatar);

module.exports =router;

//,validateBody(registerValidationEmployee)
//,validateBody(loginValidation)