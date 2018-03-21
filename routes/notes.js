'use strict';

const express = require('express');
// Create an router instance (aka "mini-app")
const router = express.Router();

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');
const Note = require('../models/note');

/* ========== GET/READ ALL ITEM ========== */
router.get('/notes', (req, res, next) => {

  const searchTerm = req.query.searchTerm;
  let filter = {};
  let projection = {};
  let sort = 'created';

  if (searchTerm) {
    filter.$text = { $search: searchTerm };
    projection.score = {$meta: 'textScore'};
    sort = projection;
  }

  Note
    .find(filter, projection)
    .sort(sort)
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/notes/:id', (req, res, next) => {

  console.log(req.params);

  let id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next();
  }

  Note
    .findById(id)
    .then(result => {
      res.json(result);
    })
    .catch(err => next(err));
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/notes', (req, res, next) => {
  let {title, content} = req.body;
  let newNote = {title, content};
  if(!newNote.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  Note
    .create(newNote)
    .then(result => {
      res.json(result);
    })
    .catch(err => next(err));
  
  res.location('path/to/new/document').status(201).json({ id: 2 });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {

  let noteId = req.params.id;

  const {title, content} = req.body;

  let updateObj = {title, content};

  if(!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  mongoose.connect(MONGODB_URI)
    .then(() => {
      Note
        .findByIdAndUpdate(noteId, updateObj)
        .then(result => {
          res.json(result);
        })
        .catch(err => next(err));
    });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {

  let noteId = req.params.id;

  Note
    .findByIdAndRemove(noteId)
    .then(result => {
      if (result) {
        res.status(204).end();
      }
      else {
        next();
      }
    })
    .catch(err => next(err));

});

module.exports = router;