const EmployeeService = require("../service/EmployeeService");
const EmployeeModel = require("../models/Employee");
const fs = require("fs/promises");
const express = require('express');
const modifier = require("../middlewares/photomodifier");
const BaseController = require("./baseController");
const path = require("path");
const auth = require("../middlewares/authenticate");
const rezumeDir = path.join(__dirname, "../", "public", "rezumes");
const loader = require("../middlewares/staticLoader")


class EmployeeController extends BaseController {
  
  constructor(userService){
    super(userService);
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes(){
    this.router.post('/register', this.register.bind(this));
    this.router.post('/login', this.login.bind(this));
    this.router.post('/logout', this.logout.bind(this));
    this.router.patch('/rezume',auth,loader.single("rezume"),this.uploadRezume);
    this.router.patch('/avatar',auth, loader.single("avatar"),this.uploadAvatar.bind(this));
  }
  

  // async uploadAvatar(req, res, next) {
  //   try {
  //     const  {id}  = req.user;
  //     console.log(id)
  //     const recruiter = await EmployeeModel.findById(id);

  //     console.log(recruiter.avatarURL,"V ROT EVBAL AJiFAFB")
  //     // const oldAvatarURL = recruiter.avatarURL.replace(/^avatars\//, '');
  //     // if (oldAvatarURL) {
  //     //   const oldAvatarPath = path.join(avatarDir,oldAvatarURL);
  //     //   try {
  //     //     console.log(oldAvatarPath)
  //     //     await fs.access(oldAvatarPath);
  //     //     await fs.unlink(oldAvatarPath);
  //     //   } catch (error) {
  //     //     console.log(`Old avatar file not found at ${oldAvatarPath}`);
  //     //   }
  //     // }
  //     const { path: tempDirectory, originalname } = req.file;
  //     const fileName = `${id}_${originalname}`;

  //     const destinationFile = path.join(avatarDir, fileName);

  //     await modifier(tempDirectory);

  //     await fs.rename(tempDirectory, destinationFile);

  //     const avatarURL = `avatars/${fileName}`;
  //     await EmployeeModel.findByIdAndUpdate(id, { avatarURL });

  //     res.json({ avatarURL: `avatars/${fileName}` });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }


  async uploadRezume(req, res, next) {
    const { id } = req.user;
    const { path: tempDirectory, originalname } = req.file;
    const fileName = `${id}_${originalname}`;

    const destinationFile = path.join(rezumeDir, fileName);
    await fs.rename(tempDirectory, destinationFile);

    const resumeUrl = `rezumes/${fileName}`;
    await EmployeeModel.findByIdAndUpdate(id, { resumeUrl });
    res.json({ resumeUrl });
  }
}

module.exports = (userService) => new EmployeeController(userService).router;
