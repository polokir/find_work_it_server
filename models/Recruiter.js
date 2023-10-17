const { Schema, model } = require("mongoose");

const recruiterSchema = new Schema({
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
  company_name:{
    type:String,
    required:true,
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
  }
}, { versionKey: false, timestamps: true });

const Recruiter = model("recruiter",recruiterSchema);
module.exports = Recruiter;
