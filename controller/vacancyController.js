const HttpError = require("../errors/errorHandler");
const VacancyService = require("../service/VacancyService");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs/promises");
const {
  dateParser,
  calculateMedian,
  monthIndexToName,
  groupBy,
} = require("../middlewares/math-functions");

class VacancyController {
  async create(req, res, next) {
    try {
      const { id } = req.user;
      const { body } = req;

      if (Object.keys(req.user).includes("skills")) {
        return next(HttpError(403, "WRONG ROLE ACTION FORBIDEN"));
      }
      console.log(body);
      const vacancy = await VacancyService.create(body, id);
      if (!vacancy) {
        next(HttpError(403, "not created"));
        return;
      }
      res.status(201).json(vacancy);
    } catch (error) {
      console.log(error.message, "|VACANCY CREATE CONTROLLER|");
      next(HttpError(500, error.message));
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const vacancy = await VacancyService.getVacancyById(id);
      if (!vacancy) {
        next(HttpError(404, "Not Found a vacancy"));
        return;
      }
      res.status(200).json(vacancy);
    } catch (error) {
      next(HttpError(500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const updateVacancy = await VacancyService.update(body, id);
      if (!updateVacancy) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(updateVacancy);
    } catch (error) {
      next(HttpError(500, error.message));
    }
  }

  async removeVacancy(req, res, next) {
    try {
      const { user } = req;
      const { id } = req.params;
      const deleted = await VacancyService.deleteVacancy(user.id, id);
      if (!deleted) {
        return res.status(404).json({ message: "DELETING FAILED" });
      }
      return res.status(204).json({ message: "SUCCESSFULLY DELETED" });
    } catch (error) {
      next(HttpError(500, error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const allVacancies = await VacancyService.getAll();
      return res.status(200).json(allVacancies);
    } catch (error) {}
  }

  async applyVacancy(req, res, next) {
    try {
      const { id } = req.user;
      const { idx } = req.params;
      if (Object.keys(req.user).includes("company_name")) {
        return next(HttpError(403, "WRONG ROLE ACTION FORBIDEN"));
      }
      const applied = await VacancyService.apply(id, idx);
      return res.json(applied);
    } catch (error) {
      next(HttpError(500, error.message));
    }
  }

  async getCandidates(req, res, next) {
    try {
      const { id } = req.user;
      const { vacancyId } = req.params;
      if (Object.keys(req.user).includes("skills")) {
        return next(HttpError(403, "WRONG ROLE ACTION FORBIDEN"));
      }
      const employess = await VacancyService.getCandidates(id, vacancyId);
      console.log(employess);
      return res.json(employess.flatMap((item) => item.employee));
    } catch (error) {
      next(HttpError(500, error.message));
    }
  }

  async getRecruiterVacancy(req, res, next) {
    try {
      const { id } = req.user;
      const vacancy = await VacancyService.getRecruiterVacancy(id);
      return res.json(vacancy);
    } catch (error) {
      next(HttpError(500, error.message));
    }
  }

  async getAppliedVacancy(req, res, next) {
    try {
      const { id } = req.user;
      const appliedVacancy = await VacancyService.getAppliedVacancy(id);
      res.json(appliedVacancy);
    } catch (error) {
      next(error);
    }
  }

  async searchVacancyByTitle(req, res, next) {
    try {
      const { title } = req.query;
      console.log(req.query);
      const vacancy = await VacancyService.getAll();
      const filtred = vacancy.filter((vacancy) =>
        vacancy.title.includes(title)
      );
      console.log("LOOOOOOOOOOOOOOOOOXXXXXXXXXXXX");
      return res.json(filtred);
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async getExcell(req, res, next) {
    const vacancies = await VacancyService.getAll();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Vacancies");

    // Заголовки таблицы
    const headers_all = Object.keys(vacancies[0].toObject());
    const excludedElements = ["_id", "text", "recruiter", "employee"];

    const headers = headers_all.filter(
      (header) => !excludedElements.includes(header)
    );

    console.log(headers, "headers: ");
    worksheet.addRow(headers);

    // Добавление данных в таблицу
    vacancies.forEach((vacancy) => {
      const rowData = headers.map((header) => vacancy[header]);
      worksheet.addRow(rowData);
    });

    // Сохранение файла
    res.attachment("vacancies.xlsx");
    await workbook.xlsx.write(res);
  }

  async MedianaSalaryToMonth(req, res, next) {
    const { from, to } = req.query;

    const vacancies = await VacancyService.getAllForStatistic(
      new Date(from),
      new Date(to),
      "salary createdAt year_of_experience"
    );

    const mappedVacancies = vacancies.filter((item) => {
      const currentVacancyDate = new Date(item.createdAt);
      const fromDate = new Date(from);
      const toDate = new Date(to);
      return fromDate <= currentVacancyDate && currentVacancyDate <= toDate;
    });

    const groupedByMonth = groupBy(mappedVacancies, (item) =>
      item.createdAt.getMonth()
    );
    const groupedByExpierence = groupBy(
      mappedVacancies,
      (item) => item.year_of_experience
    );

    const mediansByMonth = {};
    const mediansByExpierence = {};
    const newRecruiterbyMonth = {};
    const newEmployeebyMonth = {};

    for (const month in groupedByMonth) {
      const salariesForMonth = groupedByMonth[month].map((item) => item.salary);
      const median = calculateMedian(salariesForMonth);
      mediansByMonth[monthIndexToName(parseInt(month))] = median;
    }

    for (const year in groupedByExpierence) {
      const salariesForYear = groupedByExpierence[year].map(
        (item) => item.salary
      );
      const median = calculateMedian(salariesForYear);
      mediansByExpierence[year] = median;
    }

    return res.json({ mediansByMonth, mediansByExpierence });
  }
}

module.exports = new VacancyController();
