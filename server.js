const app = require('./app')
const mongoose = require('mongoose');
require('dotenv').config();
const start = () => {
  app.listen(process.env.PORT, () => {
  console.log(`Server running. Use our API on port: ${process.env.PORT}`)
})

mongoose.connect(process.env.DB_URL)
    .then(()=>console.log("DB connected"))
    .catch((err)=>console.log('DB connection ERROR',err));
}

start();