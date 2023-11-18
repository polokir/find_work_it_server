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
    const vacancy = await VacancyModel.findById(id);
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
      select:"name email"
    }).exec();
    return result;
  }
  
  async getRecruiterVacancy(recruiterId){
    const result = await VacancyModel.find({recruiter:recruiterId}).exec();
    return result || null;
  }
}

module.exports = new VacancyService();