const EmployeeModel = require("../models/Employee");
const bcrypt = require("bcrypt");
const HttpError = require("../errors/errorHandler");
const uuid = require("uuid");
const gravatar = require("gravatar");
const TokenService = require("./TokenService");
const EmployeeDTO = require("../dtos/EmployeeDTO");

class EmployeeService {
  async register({
    email,
    password,
    name,
    age,
    experience,
    salary_level,
    resumeUrl,
    city,
    position,
    skills,
    location,
  }) {
    console.log(email, password);
    const hashPassword = await bcrypt.hash(password, 5);
    const verificationToken = uuid.v4();
    const avatarURL = gravatar.url(email);

    const potentialEmployee = await EmployeeModel.findOne({ email });
    if (potentialEmployee) {
      return HttpError(409, `User with email ${email} already exists`);
    }

    const newEmployee = await EmployeeModel.create({
      email,
      password: hashPassword,
      name,
      avatarURL,
      age,
      verificationToken,
      experience,
      salary_level,
      city,
      position,
      resumeUrl,
      skills,
    });
    const employeeDTO = new EmployeeDTO(newEmployee);
    const tokens = TokenService.createTokens({ employeeDTO });
    await TokenService.pushToken(employeeDTO.id, tokens.refreshToken);

    return {
      ...tokens,
      employee: employeeDTO,
    };
  }

  async login({ email, password }) {
    const employee = await EmployeeModel.findOne({ email });
    const isCorrectPass = await bcrypt.compare(password, employee.password);

    if (!employee || !isCorrectPass) {
      return HttpError(403, "невірна почта або пароль");
    }

    const employeeDTO = new EmployeeDTO(employee);
    const tokens = TokenService.createTokens({ ...employeeDTO });
    await TokenService.pushToken(employeeDTO.id, tokens.refreshToken);

    return {
      tokens,
      employee: employeeDTO,
    };
  }

  async logut(refreshToken) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }

  async getAllPeople(from, to) {
    const allRecrut = await EmployeeModel.find({
      createdAt: { $gte: from, $lte: to },
    }).select("createdAt");
    return allRecrut || null;
  }
}

module.exports = new EmployeeService();
