const mongoose = require('mongoose');

const { Schema } = mongoose;

const Message = new Schema({
  message: String,
  roomId: String,
  name: String,
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Message', Message);
