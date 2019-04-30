
const mongoose = require('mongoose');

// const { DATABASE_URL } = require('../config');
const DATABASE_URL = 'mongodb://localhost/mongodb-coordinates';
const DataSet = require('../models/dataSet');
const Point = require('../models/point');

const inlets = require('../testInlets.json');
const { inletDataSet } = require('../db/inletDataSet');

console.log('Connecting to mongodb at ', DATABASE_URL);
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    console.log('Deleting Data...');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.log('Creating Indexes');
    return Promise.all([
      DataSet.ensureIndexes(),
      Point.ensureIndexes(),

    ]);
  })
  .then(() => {
    console.log('Seeding Database...');
    return DataSet.create(inletDataSet);
  })
  .then(dataSet => {
    const dataSetId = dataSet.id;
    const arrayWithDataSetId = inlets.map(inlet => {
      const point = {
        xCoordinate: inlet.xCoordinate,
        yCoordinate: inlet.yCoordinate,
        dataSetId
      };
      return point;
    });
    return Point.insertMany(arrayWithDataSetId);
  })
  .then((results) => {
    // console.log(`Inserted results with no errors, ${results}`);
    console.info('Disconnecting...');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
