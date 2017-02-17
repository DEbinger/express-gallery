// jshint esversion:6

const express = require('express');
const app = express();
const bp = require('body-parser');
const handlebars = require('express-handlebars');
const db = require('./models');
const gallery = require('./routes/gallery');
const PORT = process.env.PORT || 3000;
const methodOverride = require('method-override');


app.use(bp.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));

const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/gallery', gallery);

app.listen(PORT, function() {
  console.log('Server started on port 3000');
  db.sequelize.sync();
});

module.exports = app;