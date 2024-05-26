const modifier = require("../middlewares/photomodifier");
const loader = require("../middlewares/staticLoader")
const fs = require("fs/promises");
const path = require("path");
const avatarDir = path.join(__dirname, "../", "public", "avatars");
const HttpError = require('../errors/errorHandler')

class BaseController {
  constructor(userService) {
    this.userService = userService;
  }

  async register(req, res) {
    try {
      const user = await this.userService.register(req.body);
      res.cookie("refreshToken", user.refreshToken, {
        maxAge: 30 * 34 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(201).json(user);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async login(req, res) {
    try {
      const user = await this.userService.login(req.body);
      res.cookie("refreshToken", user.refreshToken, {
        maxAge: 30 * 34 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(200).json(user);
    } catch (err) {
      res.status(401).send(err.message);
    }
  }

  async logout(req, res) {
    try {
      await this.userService.logout(req.cookies.refreshToken);
      res.clearCookie("refreshToken");
      res.status(200).send("Logged out successfully");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async uploadAvatar(req, res, next) {
    try {
      const { id } = req.user;
      const user = await this.userService.getById(id);
      console.log(id,"----USER ID UPLOAD AVATAR METHOD----")
      if (user.avatarURL) {
        const oldAvatarPath = path.join(avatarDir, user.avatarURL.replace(/^avatars\//, ''));
        try {
          await fs.access(oldAvatarPath);
          await fs.unlink(oldAvatarPath);
        } catch (error) {
          console.log(`Old avatar file not found at ${oldAvatarPath}`);
        }
      }

      const { path: tempDirectory, originalname } = req.file;
      const fileName = `${id}_${originalname}`;
      const destinationFile = path.join(avatarDir, fileName);

      await modifier(tempDirectory);
      await fs.rename(tempDirectory, destinationFile);

      const avatarURL = `avatars/${fileName}`;
      await this.userService.updateAvatar(id, avatarURL);

      res.json({ avatarURL });
    } catch (error) {
      next(HttpError(500, error.message));
    }
  }
}

module.exports = BaseController;
