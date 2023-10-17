const express = require('express');
const VacancyController = require('../../controller/vacancyController');
const router = express.Router();
const auth = require("../../middlewares/authenticate");
const vacancyController = require('../../controller/vacancyController');

router.post("",auth,vacancyController.create);
router.get("/:id",vacancyController.getById);
router.get("",vacancyController.getAll);
router.patch("",auth,vacancyController.update);
router.delete("/:id",auth,vacancyController.removeVacancy);

module.exports = router;