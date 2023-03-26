const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  title: String,
  author: String,
});

module.exports = mongoose.model('User', userSchema);
