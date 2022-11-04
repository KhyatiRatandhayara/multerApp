const app = require("./app");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION, APP SHUTTING NOW!!");
  console.log(err.message, err.name);
  process.exit(1);
});

const DB = "mongodb://localhost/multerdb";

mongoose.connect(DB).then(() => {
  console.log("DB connected successfully");
});

module.exports = DB;
