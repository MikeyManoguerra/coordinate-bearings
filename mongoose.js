const mongoose = require('mongoose');

const DATABASE_URL = 'mongodb://localhost/mongodb-coordinates';


function dbConnect(url = DATABASE_URL) {
  return mongoose.connect(url, { useNewUrlParser: true })
    .catch(err => {
      console.error('Mongoose failed to connect');
      console.error(err);
    });
}

module.exports = {
  dbConnect
};