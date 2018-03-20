'use strict';

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, index: true},
  content: { type: String, index: true},
  created: { type: Date, default: Date.now}
});

//chris put something here...

module.exports = mongoose.model('Note', noteSchema);