

class EmployeeDTO{
    id;
    email;
    name;
    avatarURL;
    age;
    expierence;
    skills;
    salary_level;
    resumeUrl;
    constructor(employee){
        this.id=employee._id;
        this.email=employee.email;
        this.name=employee.name;
        this.avatarURL=employee.avatarURL;
        this.age=employee.age;
        this.expierence=employee.expierence;
        this.skills=employee.skills;
        this.salary_level=employee.salary_level;
        this.resumeUrl=employee.resumeUrl;
    }
}

module.exports = EmployeeDTO;