const express = require("express");
const app = express();
const logger = require("morgan");
var cors = require("cors");
app.use(cors({
  credentials:true,
  origin:'http://localhost:3000',
  ptionsSuccessStatus: 200
}));
//const recrutRouter = require("./routes/api/recruiter");
const recrutService = require('./service/RecruiterService')
const recruiterController = require('./controller/recruiterController')(recrutService);

const employeeService = require("./service/EmployeeService");
const employeeController = require("./controller/employeeController")(employeeService);

const vacancyRouter = require("./routes/api/vacancy");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));

app.use(cookieParser());
app.use(express.json());
app.use("/api/employee", employeeController);
app.use("/api/recrut", recruiterController);
app.use("/vacancy",vacancyRouter);

app.use("/public",express.static("public"));

app.all("*", (_, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

app.use((err, _, res, __) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});

module.exports = app;
