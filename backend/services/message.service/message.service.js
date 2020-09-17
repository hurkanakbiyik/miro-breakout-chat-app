const Message = require('../../models/message.model');

function save(data) {
  const message = new Message(data);
  return message.save();
}

function find() {
  return Message.find({}, null, { sort: { createdAt: 'asc' } });
}

module.exports = {
  save,
  find,
};
