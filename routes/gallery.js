// jshint esversion:6

const express = require('express');
const router = express.Router();
const db = require('../models');
let Photo = db.Photo;

router.get('/', (req, res) => {
  Photo.findAll({order: "id"})
  .then(function (photos) {
    res.render('index', {photos: photos});
  })
;});

router.post('/new', (req, res) => {
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

router.get('/:id', (req, res) => {
  Photo.findById(`${req.params.id}`)
  .then(function (photos) {
    res.render('image', {photos: photos});
  })
  .catch(error => console.error(error));
});

router.get('/:id/edit', (req, res) => {
  Photo.findById(`${req.params.id}`)
  .then(function (photos) {
    res.render('edit', {photos: photos});
  });
});

router.put('/:id', (req, res) => {
  Photo.update({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  },
  {where: {id: `${req.params.id}`}}
  )
  .then(function() {
    res.redirect(303, `/gallery/${req.params.id}`);
  });
});

router.delete('/:id', (req, res) => {
  Photo.destroy( {
    where : {id: `${req.params.id}`}}
    )
    .then(function() {
    res.redirect(303, `/gallery`);
  });
});

module.exports = router;