const mongoose = require('mongoose');

console.info('Connecting to database!');
const init = () => mongoose.connect('mongodb://mongo:27017/mongo-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.info('Database connection has been established!');
}).catch((e) => {
  console.error(e);
  throw e;
});

module.exports = {
  init,
};
