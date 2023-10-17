const HttpError = require("../errors/errorHandler");
const VacancyService = require("../service/VacancyService");
const path = require("path");
const fs = require("fs/promises");
const rezumeDir = path.join(__dirname, "../", "public", "rezumes");

class VacancyController{
    
    async create(req,res,next){
       try {
        const {id} = req.user;
        const {body} = req;
        if(Object.keys(req.user).includes('skills')){
            return next(HttpError(403,"WRONG ROLE ACTION FORBIDEN"))
        }
        // console.log("user",req.user);
        const vacancy = await VacancyService.create(body,id);
        if(!vacancy){
            next(HttpError(403,"not created"));
            return;
        }
        res.status(201).json(vacancy);
       } catch (error) {
            next(HttpError(500,error.message));
       }
    }

    async getById(req,res,next){
        try {
            const id = req.params.id;
            const vacancy = await VacancyService.getVacancyById(id);
            if(!vacancy){
                next(HttpError(404,"Not Found a vacancy"))
                return;
            }
            res.status(200).json(vacancy);
        } catch (error) {
            next(HttpError(500,error.message));
        }
    }

    async update(req,res,next){
        try {
            const id = req.params.id;
            const updateVacancy = await VacancyService.update(body,id);
            if(!updateVacancy){
                return res.status(404).json({ message: "Not found" });
            }
            res.status(200).json(updateVacancy);
        } catch (error) {
            next(HttpError(500,error.message));
        }
    }

    async removeVacancy(req,res,next){
        try {
            const {user} = req;           
            const {id} = req.params;
            const deleted = await VacancyService.deleteVacancy(user.id,id);
            if(!deleted){
                return res.status(404).json({message:"DELETING FAILED"});
            }
            return res.status(204).json({message:"SUCCESSFULLY DELETED"});
        } catch (error) {
            next(HttpError(500,error.message));
        }
    }

    async getAll(req,res,next){
        try {
            const allVacancies = await VacancyService.getAll();
            return res.status(200).json(allVacancies);
        } catch (error) {
            
        }
    }

    async uploadRezume(req,res,next){
        const {user} = req;
        const { path: tempDirectory, originalname } = req.file;
        const fileName = `${user.id}_${originalname}`;
    }
}

module.exports = new VacancyController();