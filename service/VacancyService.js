

class VacancyService {
  async create(body,recruiter) {
    const newVacancy = await VacancyModel.create({
      ...body,
      recruiter
    });
    return newVacancy;
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
    const allVacancies = await VacancyModel.find();
    return allVacancies;
  }
}

module.exports = new VacancyService();