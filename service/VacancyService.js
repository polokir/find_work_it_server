const RecruiterDTO = require("../dtos/RecruiterDTO");
const VacancyModel = require("../models/Vacancy");


class VacancyService {
  async create(body,recruiter) {
    try {
      const newVacancy = await VacancyModel.create({
        ...body,
        recruiter
      });
      return newVacancy;
    } catch (error) {
      console.log(error.message, "|VACANCY CREATE SERVICE|");
    }
   
  }

  async getVacancyById(id){
    const vacancy = await VacancyModel.findById(id).populate({
      path:"recruiter",
      select:"name company_name avatarURL "
    });
    return vacancy
  }

  async update(body,id){
    const updatedVacancy = await VacancyModel.findByIdAndUpdate(
        {_id:id},
        {...body},
        {new:true}
    );
    return updatedVacancy;
  }
  
  async deleteVacancy(userId,id){
    const deletedVacancy = await VacancyModel.findOneAndRemove({
      _id:id,
      recruiter:userId
    });
    return deletedVacancy;
  }

  async getAll(){
    const allVacancies = await VacancyModel.find().populate({
      path:"recruiter",
      select:"name email company_name avatarURL "
    });
  
    return allVacancies;
  }

  async getAllForStatistic(from,to,select){
    const allVacancies = await VacancyModel.find({
      createdAt:{$gte: from, $lte: to}
    }).select(select);
    return allVacancies;
  }

  async apply(userId,id){
    const result = await VacancyModel.findByIdAndUpdate(id, { 
      $push: { employee: userId },
      $inc:{apply_count:1},
    },{new:true});

    return result;
  }

  async getCandidates(userId,idx){
    const result = await VacancyModel.find({recruiter:userId,_id:idx}).populate({
      path:'employee',
      select:"name email skills avatarURL age experience position city resumeUrl",
    }).exec();
    return result;
  }
  
  async getRecruiterVacancy(recruiterId){
    const result = await VacancyModel.find({recruiter:recruiterId}).exec();
    return result || null;
  }

  async getAppliedVacancy(employeeId){
    const result = await VacancyModel.find({ employee: { $in: employeeId } })
    return result || null;
  }
  
  async searchVacancyByTitle(title){
    try {
      const result = await VacancyModel.find({title:title});
    return result || null;
    } catch (error) {
     console.log(error.message); 
    }
    
  }
}

module.exports = new VacancyService();