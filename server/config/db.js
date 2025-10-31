require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("==============Mongodb Database Connected Successfully=============="))
  .catch((err) => {
    console.log("❌ Database Not Connected !!!");
    console.error(err);
  });
