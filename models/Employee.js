const { Schema, model } = require("mongoose");

const employeeSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  name:{
    type:String,
    required:[true,"name is required"],
  },
  avatarURL:{
    type:String,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
  age:{
    type:Number,
    required:true,
  },
  experience:{
    type:Number,
    required:true,
    default:0
  },
  skills:{
    type:[String],
    default:[]
  },
  salary_level:{
    type:Number,
  },
  resumeUrl:{
    type:String
  },
  
}, { versionKey: false, timestamps: true });

const Employee = model("employee",employeeSchema);
module.exports = Employee;
