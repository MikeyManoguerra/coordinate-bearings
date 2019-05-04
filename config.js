'use strict';

require('dotenv').config();

module.exports = {
  DATABASE_URL: process.env.MONGODB_URL,
  // DATABASE_URL :'mongodb://localhost/mongodb-coordinates',
  PORT: process.env.PORT  || 8080,
  
};
