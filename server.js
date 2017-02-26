// jshint esversion:6

const express = require('express');
const app = express();
const bp = require('body-parser');
const handlebars = require('express-handlebars');
const logout = require('express-passport-logout');
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
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = db.User;

app.use(bp.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.use(session({
  store: new RedisStore(),
  secret: 'CONFIG.SESSION_SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());



const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({
      where: {
        user: username
      }
    }).then ( user => {
      if (user === null) {
        console.log('user failed');
        return done(null, false, {message: 'bad username'});

    }else {

      bcrypt.compare(password, user.password).then(res => {
        console.log('This is now the pw and user.pw',password, user.password);
        if (res) {
          return done(null, user);
        }else {
          return done(null, false);
        }
      });

    }
  }).catch(err => {
    console.log('error: ', err);
  });
})
);

passport.serializeUser(function(user, done) {
  return done(null, {
    id:user.id,
    username:user.username
  });
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

app.get('/gallery/login', (req, res) => {
  res.render('./login.hbs');
});

app.post('/gallery/login', passport.authenticate('local', {
  successRedirect: '/gallery',
  failureRedirect: '/gallery/newuser'
}));

app.post('/gallery/newuser', (req, res) => {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function (err,hash){
    User.create({
        user: req.body.username,
        password: hash
    }).then( _ => {
      res.redirect(303,'/gallery/login');
    });
    });
  });
});

app.get('/gallery/newuser', (req, res) => {
  res.render('./createuser.hbs');
});

function isAuthApproved(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }else{
    console.log('NOPE');
    res.redirect('/gallery/login');
  }
}

app.get('/secret', isAuthApproved,(req, res) => {
  res.send('this is my secret page');
});

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/gallery', gallery);

app.listen(PORT, function() {
  console.log('Server started on port 3000');
  db.sequelize.sync();
});

module.exports = app;