// const express = require('express');
// const router = express.Router();
// const DataSet = require('../models/dataSet.js');
// const Point = require('../models/point.js');
// // get the names of all the datasets

// router.get('/', (req, res, next) => {
//   return DataSet.find()
//     .then((dataSets) => {
//       return res.json(dataSets);
//     })
//     .catch(err => next(err));
// });

// // TODO: addd a get all coordinates in dataset route?


// router.post('/', (req, res, next) => {
//   const {
//     name,
//     description,
//     coordinatesArray
//   } = req.body;
//   const newDataSet = { name, description };

//   return DataSet.create(newDataSet)
//     .then((result) => {
//       const dataSetId = result.id;
//       return insertPointIntoDataBase(dataSetId, coordinatesArray);
//     })
//     .then(() => {
//       return res.status(204).end();
//     })
//     .catch((err) => {

//       return next(err);
//     });
// });


// // TODO : this is bad fix the catch block
// function insertPointIntoDataBase(dataSetId, coordinatesArray) {
//   return coordinatesArray.forEach(plotPoint => {
//     const newPoint = {
//       xCoordinate: plotPoint.xCoordinate,
//       yCoordinate: plotPoint.yCoordinate,
//       dataSetId
//     };
//     return Point.create(newPoint)
//       .catch((err) => { throw err })
//   })
//     .catch((res) => {
//       const error = new Error(' one of the plot points you entered is missing a value')
//       error.status = 400;
//       return error;
//     });

// }


// module.exports = router;