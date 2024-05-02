const RecruiterModel = require("../models/Recruiter");
const bcrypt = require("bcrypt");
const HttpError = require("../errors/errorHandler");
const uuid = require("uuid");
const gravatar = require("gravatar");
const mailsender = require("../middlewares/mailsender");
const RecruiterDTO = require("../dtos/RecruiterDTO");
const TokenService = require("./TokenService");
const Token = require("../models/Token");

class RecruiterService {
  async register(email, password, name, company_name,type_of_company) {
    const hashPassword = await bcrypt.hash(password, 3);
    const verificationToken = uuid.v4();
    const avatarURL = gravatar.url(email);
    // const confirmation = await mailsender(email, verificationToken);

    // if(!confirmation){
    //     return HttpError(401,"Email send error");
    // }

    const newRecruiter = await RecruiterModel.create({
      email,
      password: hashPassword,
      name,
      avatarURL,
      company_name,
      verificationToken,
      type_of_company
    });

    const recruiterDTO = new RecruiterDTO(newRecruiter);
    const tokens = TokenService.createTokens({ ...recruiterDTO });

    await TokenService.pushToken(recruiterDTO.id, tokens.refreshToken);

    return {
      ...tokens,
      recruiter: recruiterDTO,
    };
  }

  async login(email, password) {
    const person = await RecruiterModel.findOne({ email });
    if (!person) {
      console.log(person,"|RECR LOGIN|")
      return null;
    }
    const hashPass = await bcrypt.compare(password, person.password);

    if (!hashPass) {
      return null;
    }

    const recruiterDTO = new RecruiterDTO(person);
    const tokens = TokenService.createTokens({ ...recruiterDTO });
  
    console.log("recruiter login", recruiterDTO);
    await TokenService.pushToken(recruiterDTO.id, tokens.refreshToken);

    return {
      ...tokens,
      recruiter: recruiterDTO,
    };
  }

  async logut(refreshToken) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      return HttpError(403, "Unathorized");
    }
    const tokenData = TokenService.isValidRefreshToken(refreshToken);
    const tokenFromDB = await TokenService.searchToken(refreshToken);
    //console.log("db token",tokenData);
    if (!tokenData || !tokenFromDB) {
      return HttpError(403, "Unathorized");
    }
    const person = await RecruiterModel.findById(tokenData.id);
    const recruiterDTO = new RecruiterDTO(person);
    console.log(tokenFromDB);
    const tokens = TokenService.createTokens({ ...recruiterDTO });

    return {
      accessToken:tokens.accessToken,
    };
  }

  async getAllPeople(from,to){
    const allRecrut = await RecruiterModel.find({
      createdAt:{$gte:from, $lte:to}
    }).select("createdAt");
    return allRecrut || null;
  }
}

module.exports = new RecruiterService();
