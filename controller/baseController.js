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
}

module.exports = BaseController;
