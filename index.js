const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const dotenv=require('dotenv').config()
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const User = require('./Models/auth')
const session = require('express-session');
const MongoStore = require('connect-mongo');

mongoose
  .connect(
    process.env.MONGODB_URI
  )
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((e) => {
    console.log("failed");
  });


app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



const mongooseConnection = mongoose.connection;

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7 * 1
  },
  store: new MongoStore({ 
    mongoUrl: process.env.MONGODB_URI, 
    mongooseConnection,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }), // Use MongoDB to store sessions
}));






app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



 
passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());


passport.use(new LocalStrategy(User.authenticate())); 


  




  
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currenturl = "/home";

  if (req.user) {
    res.locals.user = req.user;
    if (req.user.displayName) {
      const username = req.user.displayName.split(' ')[0];
      res.locals.currentUser = username.toUpperCase();
      res.locals.currentusermail = req.user.email;
    } else if (req.user.username) {
      res.locals.currentUser = req.user.username.toUpperCase();
      res.locals.currentusermail = req.user.email;
    }
  } else {
    res.locals.currentUser = ""; // Clear currentUser if not logged in
    res.locals.currentusermail = "";
    res.locals.user = "";
  }

  next();
});
  


//all the routes
const BlogRoutes = require('./routes/blogs');
const AuthRoutes = require('./routes/auth');
const NormalRoutes = require('./routes/normalRoutes');

app.use(AuthRoutes);
app.use(BlogRoutes);
app.use(NormalRoutes);



app.listen(5000, () => {
  console.log("connect to server");
});
