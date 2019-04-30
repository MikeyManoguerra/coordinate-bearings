

const express = require('express');
const router = express.Router();
const DataSet = require('../models/dataSet.js');
const Point = require('../models/point.js');
const Route = require('../models/route');


router.post('/', (req, res, next) => {
  const {
    name,
    description,
    bearingDirection,
    dataSetId
  } = req.body;
  const newRoute = {
    name,
    description,
    bearingDirection,
    dataSetId
  };
  let routeId
  return Route.create(newRoute)
    .then(route => {
      routeId = route.id;
      return Point.find({ dataSetId });
    })
    .then(pointArray => {

    })
})