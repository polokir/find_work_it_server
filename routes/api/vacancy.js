const express = require('express');
const router = express.Router();
const auth = require("../../middlewares/authenticate");
const vacancyController = require('../../controller/vacancyController');

router.get('/search', vacancyController.searchVacancyByTitle);
router.get("/totalnumb",vacancyController.getTotal);
router.get("/statistcs/get-excel",vacancyController.getExcell);
router.get("/statistcs",vacancyController.MedianaSalaryToMonth);
router.get("/can/:vacancyId",auth,vacancyController.getCandidates);
router.post("",auth,vacancyController.create);
router.get("/:id",vacancyController.getById);
router.get("",vacancyController.getAll);
router.patch("",auth,vacancyController.update);
router.delete("/:id",auth,vacancyController.removeVacancy);
router.patch("/apply/:idx",auth,vacancyController.applyVacancy);
router.get("/recrut/vacancies",auth,vacancyController.getRecruiterVacancy);
router.get("/employee/applied",auth,vacancyController.getAppliedVacancy);


module.exports = router;