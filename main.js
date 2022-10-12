const express = require("express");
const { addBlogData, getBlogData, deleteBlog, authUser} = require("./dbController.js");
require("dotenv").config();
var cors = require("cors");
const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

// Setting up cross-origin-resource-sharing
app.use(cors(corsOptions));
app.use(express.json());

// Api for authorizing user
app.post("/authUser",(req, res)=>{
  console.log("authorizing user",req.body);
    authUser(res,req.body);
});

// Api for getting user Blog data
app.get("/getBlog/:user", (req, res) => {
  console.log("get data of", req.params);
  getBlogData(res, req.params);
});

// Api for post the blog by the user
app.post("/postBlog", (req, res) => {
  console.log("posting data",req.body);
  if (req.body) {
    addBlogData(res, req.body);
  } else {
    res.send("empty field");
  }
});

// Api for deleting the Blog of the user
app.delete("/deleteBlog", (req, res) => {
  console.log("income data", req.body);
  deleteBlog(res, req.body);
});


app.listen(process.env.PORT,() => {
  console.log("Example app listening on")
});
