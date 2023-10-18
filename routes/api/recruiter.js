const express = require('express');
const recruiterController = require('../../controller/recruiterController');
const validateBody = require('../../middlewares/validator');
const { registerValidationRecruiter, loginValidation } = require('../../validations/user');
const router = express.Router();
const loader = require("../../middlewares/staticLoader")
const auth = require("../../middlewares/authenticate")

router.post("/register",validateBody(registerValidationRecruiter), recruiterController.register)
router.post("/login",validateBody(loginValidation),recruiterController.login);
router.get("/verify/:verificationToken",recruiterController.activate);
router.patch('/avatars',auth,loader.single("avatar"),recruiterController.uploadAvatar);
router.post('/logout',auth,recruiterController.logout);
router.post('/refresh',recruiterController.refresh);

module.exports = router;