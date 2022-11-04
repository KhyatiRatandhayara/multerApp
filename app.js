const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const File = require("./model/fileSchema");
const db = require("./database");
const port = process.env.port || 3000;
const app = express();

// Configurations for "body-parser"
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//Configuration for static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(`${__dirname}/public`));

//Configuration for Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/${file.fieldname}-${Date.now()}.${ext}`);
  },
});

// Multer Filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Not a PDF File!!"), false);
  }
};

//Calling the "multer" Function
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

//API Endpoint for uploading single file
app.post("/api/uploadFile", upload.single("myFile"), async (req, res) => {
  try {
    const uploadedFile = await File.create({
      name: req.file.filename,
    });
    res.status(200).json({
      status: "success",
      message: "File added successfully.",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});

app.get("/api/getFiles", async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json({
      status: "success",
      files,
    });
  } catch (error) {
    res.json({ status: "failed", error });
  }
});

//API end point for rendering HTML file
app.get("/", (req, res) => {
  res.status(200).render("index");
});

app.listen(port, () => {
  console.log("Server is running on port:" + port);
});
