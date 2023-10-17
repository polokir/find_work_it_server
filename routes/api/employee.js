const express = require('express');
const validateBody = require('../../middlewares/validator');
const { registerValidationEmployee, loginValidation } = require('../../validations/user');
const employeeController = require('../../controller/employeeController');
const router = express.Router();
const auth = require("../../middlewares/authenticate")


router.post('/register',validateBody(registerValidationEmployee),employeeController.register);
router.post('/login',validateBody(loginValidation),employeeController.login);
router.post('/logout',auth,employeeController.logout);

module.exports =router;