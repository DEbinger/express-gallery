// jshint esversion:6

const express = require('express');
const app = express();
const bp = require('body-parser');
const handlebars = require('express-handlebars');
const db = require('./models');
const gallery = require('./routes/gallery');
const PORT = process.env.PORT || 3000;
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const path = require('path');
const CONFIG = require('./config/config.json');
const RedisStore = require('connect-redis')(session);


app.use(bp.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
  store: new RedisStore(),
  secret: 'CONFIG.SESSION_SECRET'
}));


const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


// const authenticate = (username, password) => {
//   // get user data from the DB
//   const { USERNAME } = CONFIG;
//   const { PASSWORD } = CONFIG;

//   // check if the user is authenticated or not
//   return ( username === USERNAME && password === PASSWORD );
// };

passport.use(new LocalStrategy(
  function (username, password, done) {
    console.log('username, password: ', username, password);
    User.findOne({ username: username })
    .then(function (user) {
      return done(null, user);
    });
  return done(null, false, { message: 'Incorrect username.'});
  }

));

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(err, user);
});

app.get('/login', (req, res) => {
  res.render('./login.hbs');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login'
}));

app.get('/createuser', (req, res) => {
  res.render('./createuser.hbs');
});

app.post('/createuser', (req, res) => {
  // User
  res.redirect('/login');
});

app.get('/secret', (req, res) => {
  res.send('this is my secret page');
});

app.get('/', (req, res) => {
    res.render('index');
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }else{
    console.log('NOPE');
    res.redirect('/login');
  }
}

app.use('/gallery', gallery);

app.listen(PORT, function() {
  console.log('Server started on port 3000');
  db.sequelize.sync();
});

module.exports = app;