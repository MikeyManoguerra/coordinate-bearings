'use strict';

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  DATABASE_URL: process.env.MONGODB_URL || 'mongodb://localhost/noteful',
  
};
