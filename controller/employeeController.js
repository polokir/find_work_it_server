const EmployeeService = require("../service/EmployeeService");
const EmployeeModel = require("../models/Employee");

class EmployeeController {
  async register(req, res, next) {
    console.log();
    try {
      const employee = await EmployeeService.register({ ...req.body });
      res.cookie("refreshToken", employee.refreshToken, {
        maxAge: 30 * 34 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const employee = await EmployeeService.login({ ...req.body });
      console.log(employee);
      if(!employee){
        next(HttpError(404,"Not found"));
      }
      res.json(employee);
    } catch (error) {

    }
  }

  async logout(req,res,next){
    const {refreshToken} = req.body;
    await EmployeeService.logut(refreshToken);
    res.status(204).json()
  }
  
  async uploadAvatar(req,res){
    const { _id } = req.user;
    const { path: tempDirectory, originalname } = req.file;
    const fileName = `${_id}_${originalname}`;
  
    const destinationFile = path.join(avatarDir, fileName);
  
    await modifier(tempDirectory);
  
    await fs.rename(tempDirectory, destinationFile);
  
    const avatarURL = path.join("avatars", fileName);
    await EmployeeModel.findByIdAndUpdate(_id, { avatarURL });
  
    res.json({ avatarURL });
  } 

  
}

module.exports = new EmployeeController();
