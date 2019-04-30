const mongoose = require('mongoose');

// const DATABASE_URL = 'mongodb://localhost/mongodb-coordinates';
const { DATABASE_URL } = require('./config');

function dbConnect(url = DATABASE_URL) {
  return mongoose.connect(url, { useNewUrlParser: true , useFindAndModify: false })
    .catch(err => {
      console.error('Mongoose failed to connect');
      console.error(err);
    });
}

module.exports = {
  dbConnect
};