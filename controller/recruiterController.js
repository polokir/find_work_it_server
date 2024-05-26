const RecruiterModel = require("../models/Recruiter");
const HttpError = require("../errors/errorHandler");
const RecruiterService = require("../service/RecruiterService");
const Token = require("../models/Token");
const path = require("path");
const avatarDir = path.join(__dirname, "../", "public", "avatars");
const fs = require("fs/promises");
const modifier = require("../middlewares/photomodifier");
const EmployeeService = require("../service/EmployeeService");
const { groupBy, monthIndexToName } = require("../middlewares/math-functions");
const BaseController = require("./baseController");
const express = require('express');
const loader = require("../middlewares/staticLoader")

const auth = require("../middlewares/authenticate");

class RecruiterController extends BaseController {

  constructor(userService){
    super(userService);
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes(){
    this.router.get('/refresh',this.refresh);
    this.router.post('/register', this.register.bind(this));
    this.router.post('/login', this.login.bind(this));
    this.router.post('/logout', this.logout.bind(this));
    this.router.get("/stat",this.getPlatformStat);
    this.router.patch('/avatar',auth,loader.single("avatar"),this.uploadAvatar.bind(this));
    //this.router.get("/verify/:verificationToken",recruiterController.activate);
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

  // async uploadAvatar(req, res, next) {
  //   try {
  //     const { id } = req.user;
  //     const recruiter = await RecruiterModel.findById(id);

  //     const oldAvatarURL = recruiter.avatarURL.replace(/^avatars\//, '');

  //     if (oldAvatarURL) {
  //       const oldAvatarPath = path.join(avatarDir,oldAvatarURL);
  //       try {
  //         console.log(oldAvatarPath)
  //         await fs.access(oldAvatarPath);
  //         await fs.unlink(oldAvatarPath);
  //       } catch (error) {
  //         console.log(`Old avatar file not found at ${oldAvatarPath}`);
  //       }
  //     }
  //     const { path: tempDirectory, originalname } = req.file;
  //     const fileName = `${id}_${originalname}`;

  //     const destinationFile = path.join(avatarDir, fileName);

  //     await modifier(tempDirectory);

  //     await fs.rename(tempDirectory, destinationFile);

  //     const avatarURL = `avatars/${fileName}`;
  //     await RecruiterModel.findByIdAndUpdate(id, { avatarURL });

  //     res.json({ avatarURL: `avatars/${fileName}` });
  //   } catch (error) {
  //     console.log(error.message);
  //     next(HttpError(500, error.message));
  //   }
  // }

  async refresh(req, res, next) {
    try {
      console.log(req.cookies)
      const { refreshToken } = req.cookies;
      const RefreshToken = await Token.findOne({ refreshToken: refreshToken });

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

  async getPlatformStat(req, res, next) {
    try {
      const { from, to } = req.query;
      const allRecrut = await RecruiterService.getAllPeople(
        new Date(from),
        new Date(to)
      );
      const allEmployees = await EmployeeService.getAllPeople(
        new Date(from),
        new Date(to)
      );

      const groupedRecruts =  groupBy(allRecrut,(item) => item.createdAt.getMonth());
      const groupedEmployees = groupBy(allEmployees,(item) => item.createdAt.getMonth());
      
      const finalStatRecrut = {};
      const finalStatEmployee ={};

      for (const month in groupedRecruts) {
        finalStatRecrut[monthIndexToName(parseInt(month))] = groupedRecruts[month].length;
      }
      
      for (const month in groupedEmployees) {
        finalStatEmployee[monthIndexToName(parseInt(month))] = groupedEmployees[month].length;
      }
      res.json({finalStatRecrut,finalStatEmployee});
    } catch (error) {}
  }
}

module.exports = (userService) => new RecruiterController(userService).router;
