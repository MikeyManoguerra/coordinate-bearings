

const express = require('express');
const router = express.Router();
const DataSet = require('../models/dataSet.js');
const Point = require('../models/point.js');
const Route = require('../models/route');
const { buildRoute } = require('../utils/vectorDistances');


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
  let route;
  return Route.create(newRoute)
    .then(_route => {
      route = _route;
      return Point.find({ dataSetId });
    })
    .then(pointArray => {
      // TODO: have a better way of defining the initialPoint, but for now, random
      const initialPoint = pointArray[Math.round(pointArray.length / 2)];
      return buildRoute(route, initialPoint, pointArray);
    })
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {

    });
})