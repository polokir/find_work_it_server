const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const app = express();
const recrutRouter = require("./routes/api/recruiter");
const employeeRouter = require("./routes/api/employee");
const vacancyRouter = require("./routes/api/vacancy");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/employee", employeeRouter);
app.use("/api/recrut", recrutRouter);
app.use("/vacancy",vacancyRouter);

app.use(express.static("public"));

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
