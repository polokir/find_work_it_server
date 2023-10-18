const express = require('express');
const validateBody = require('../../middlewares/validator');
const { registerValidationEmployee, loginValidation } = require('../../validations/user');
const employeeController = require('../../controller/employeeController');
const router = express.Router();
const auth = require("../../middlewares/authenticate");
const loader = require('../../middlewares/staticLoader');


router.post('/register',validateBody(registerValidationEmployee),employeeController.register);
router.post('/login',validateBody(loginValidation),employeeController.login);
router.post('/logout',auth,employeeController.logout);
router.patch('/rezume',auth,loader.single("rezume"),employeeController.uploadRezume);
router.patch('/avatar',auth,loader.single("avatart"),employeeController.uploadRezume);

module.exports =router;