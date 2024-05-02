const express = require('express');
const recruiterController = require('../../controller/recruiterController');
const validateBody = require('../../middlewares/validator');
const { registerValidationRecruiter, loginValidation } = require('../../validations/user');
const router = express.Router();
const loader = require("../../middlewares/staticLoader")
const auth = require("../../middlewares/authenticate")


router.get("/stat",recruiterController.getPlatformStat);
router.post("/register", recruiterController.register)
router.post("/login",recruiterController.login);
router.get("/verify/:verificationToken",recruiterController.activate);
router.patch('/avatar',auth,loader.single("avatar"),recruiterController.uploadAvatar);
router.post('/logout',auth,recruiterController.logout);
router.get('/refresh',recruiterController.refresh);


module.exports = router;

//,validateBody(registerValidationRecruiter),,validateBody(loginValidation)