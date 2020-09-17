const mongoose = require('mongoose');

const { Schema } = mongoose;

const Message = new Schema({
  text: String,
  roomId: String,
  author: String,
}, { timestamps: { createdAt: 'createdAt' } });

module.exports = mongoose.model('Message', Message);
