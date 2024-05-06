const express = require('express')
const router = express.Router();
const myblog = require('../Models/Blogs');

const {islogin}=require('../middleware')

router.get("/", async (req, res) => {
  const blogs=await myblog.find()
  res.render("Inked/index",{blogs:blogs});
  });

router.get("/home", async (req, res) => {
  const blogs=await myblog.find()
  res.render("Inked/index",{blogs:blogs});
  });
  
  router.get("/contact", (req, res) => {
    res.render("Inked/contact");
  });
  
  
  
  
  
  
  
  
  

  module.exports = router;