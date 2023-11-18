const RecruiterModel = require("../models/Recruiter");
const HttpError = require("../errors/errorHandler");
// const mailsender = require("../middlewares/mailsender");
const RecruiterService = require("../service/RecruiterService");
const Token = require("../models/Token");
const path = require("path");
const avatarDir = path.join(__dirname, "../", "public", "avatars");
const fs = require("fs/promises");
const modifier = require("../middlewares/photomodifier");

class RecruiterController {
  async register(req, res, next) {
    try {
      const { email, password, name, company_name,type_of_company } = req.body;
      const person = await RecruiterModel.findOne({ email });
      if (person) {
        res
          .status(409)
          .json({ message: `User with email ${email} already exists` });
        return;
      }
      const recruiter = await RecruiterService.register(
        email,
        password,
        name,
        company_name,
        type_of_company
      );
      res.cookie("refreshToken", recruiter.refreshToken, {
        maxAge: 30 * 34 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(200).json(recruiter);
    } catch (error) {
      next(error);
      console.log(error.message);
    }
  }

  async activate(req, res, next) {
    const { verificationToken } = req.params;
    const user = await RecruiterModel.findOne({ verificationToken });

    if (!user) {
      return next(HttpError(404, "User not found"));
    }
    const { _id } = user;

    await RecruiterModel.findByIdAndUpdate(_id, {
      verify: true,
      verificationToken: null,
    });
    res.status(200).json({ message: "Verification successful" });
  }

  async uploadAvatar(req, res,next) {
    try {
      console.log(req);
      const { id } = req.user;
      const { path: tempDirectory, originalname } = req.file;
      const fileName = `${id}_${originalname}`;

      const destinationFile = path.join(avatarDir, fileName);

      await modifier(tempDirectory);

      await fs.rename(tempDirectory, destinationFile);

      const avatarURL = path.join("avatars", fileName);
      await RecruiterModel.findByIdAndUpdate(id, { avatarURL });

      res.json({ avatarURL });
    } catch (error) {
      console.log(req);

      next(HttpError(500,error.message))
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const recruiter = await RecruiterService.login(email, password);

      if (!recruiter) {
        next(HttpError(404, "Not found"));
      }
      res.cookie("refreshToken", recruiter.tokens.refreshToken, {
        maxAge: 30 * 34 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(201).json(recruiter);
    } catch (error) {
      console.log(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await RecruiterService.logut(refreshToken);
      res.clearCookie("refreshToken");
      res.status(204).json(token);
    } catch (error) {
      console.log(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { id } = req.body;
      const RefreshToken = await Token.findOne({ user: id });

      if (!RefreshToken) {
        return next(HttpError(403, "Unathorized"));
      }

      const refreshed = await RecruiterService.refresh(
        RefreshToken.refreshToken
      );
      console.log(refreshed);
      return res.status(200).json(refreshed);
    } catch (error) {}
  }

  
}

module.exports = new RecruiterController();
