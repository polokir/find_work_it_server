const { Schema, model } = require("mongoose");

const vacancySchema = new Schema({
    title:{
        type:String,
        required:[true, "title is required"]
    },
    text:{
        type:String,
        required:[true, "text is required"]
    },
    skills:{
        type:String,
        required:[true, "text is required"]
    },
    apply_count:{
        type:Number,
        default:0
    },
    test_task_link:{
        type:String,
        default:null
    },
    salary:{
        type:Number,
    },
    year_of_experience:{
        type:Number
    },
    recruiter:{
        type:Schema.Types.ObjectId,
        ref:"recruiter",
    },
    employee:{
        type:[{ type: Schema.Types.ObjectId, ref: 'employee' }],
    }
},{ versionKey: false, timestamps: true });


const Vacancy = model("vacancy",vacancySchema)
module.exports = Vacancy;