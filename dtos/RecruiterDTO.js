


class RecruiterDTO{
    id;
    email;
    company_name;
    avatarURL;
    name;
    constructor(recruiter){
        this.id = recruiter._id;
        this.name = recruiter.name;
        this.email = recruiter.email;
        this.company_name = recruiter.company_name;
        this.avatarURL = recruiter.avatarURL;
    }
}

module.exports = RecruiterDTO;