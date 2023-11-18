const express = require('express');
const router = express.Router();
const auth = require("../../middlewares/authenticate");
const vacancyController = require('../../controller/vacancyController');


router.get("/can/:vacancyId",auth,vacancyController.getCandidates);
router.post("",auth,vacancyController.create);
router.get("/:id",vacancyController.getById);
router.get("",vacancyController.getAll);
router.patch("",auth,vacancyController.update);
router.delete("/:id",auth,vacancyController.removeVacancy);
router.patch("/apply/:idx",auth,vacancyController.applyVacancy);
router.get("/recrut/vacancies",auth,vacancyController.getRecruiterVacancy);

module.exports = router;