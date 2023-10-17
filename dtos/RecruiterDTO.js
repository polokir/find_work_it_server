


class RecruiterDTO{
    id;
    email;
    company_name;
    avatarURL;
    constructor(recruiter){
        this.id = recruiter._id;
        this.email = recruiter.email;
        this.company_name = recruiter.company_name;
        this.avatarURL = recruiter.avatarURL;
    }
}

module.exports = RecruiterDTO;