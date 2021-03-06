// jshint esversion:6

const express = require('express');
const router = express.Router();
const db = require('../models');
let Photo = db.Photo;

router.get('/', (req, res) => {
  console.log('get test now');
  Photo.findAll({order: "id"})
  .then(function (photos) {
    console.log('this is inside the .then');
    res.render('index', {photos: photos});
  })
;});

let isAuth = (function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }else{
    res.redirect(303, '/login');
  }
});

router.post('/new', isAuth,(req, res) => {
  Photo.create({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  })
  .then(function () {
    res.redirect(303, '../gallery');
  })
  .catch(error => console.error(error));
});

router.get('/new', (req, res) => {
  res.render('new');
});

router.get('/:id/edit', isAuth,(req, res) => {
  Photo.findById(`${req.params.id}`)
  .then(function (photos) {
    res.render('edit', {photos: photos});
  });
});

router.get('/:id', (req, res) => {
  Photo.findById(`${req.params.id}`)
  .then(function (photo){
     Photo.findAll({order: "id", limit:3})
      .then(function (photos) {
        res.render('image', {photo : photo, photos : photos});
      });
  })
  .catch(error => console.error(error));
});

router.put('/:id', isAuth,(req, res) => {
  Photo.update({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  },
  {where: {id: req.params.id}}
  )
  .then(function() {
    res.redirect(303, `/gallery/${req.params.id}`);
  });
});

router.delete('/:id', isAuth,(req, res) => {
  Photo.destroy( {
    where : {id: `${req.params.id}`}}
    )
    .then(function() {
    res.redirect(303, `/gallery`);
  });
});

module.exports = router;