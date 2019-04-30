

const express = require('express');
const router = express.Router();
const DataSet = require('../models/dataSet.js');
const Point = require('../models/point.js');
const Route = require('../models/route');
const Bearing = require('../models/bearing');

const { buildRoute } = require('../utils/vectorDistances');


router.post('/', (req, res, next) => {
  console.log('hi', req.body);
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
      return Bearing.find({ routeId: route.id });

    })
    .then((bearings) => { 
      const bearingsInOrder = orderBearings(bearings);
      return res.json(bearingsInOrder);
    })
    .catch(() => {

    });
});

function orderBearings(bearingsArray) {
  const parent = bearingsArray.find(point => {
    return point.parentId === null;
  });
  let bearingsInOrder = [];
  let currentPoint = parent;

  while (currentPoint.childId) {
    const newPoint = {
      lng: currentPoint.xCoordinate,
      lat: currentPoint.yCoordinate
    };
    bearingsInOrder.push(newPoint);
    const newCurrentPoint = bearingsArray.find(point => {
      return point.id.toString() === currentPoint.childId.toString();
    });
    currentPoint = newCurrentPoint;
  }
  const lastNewPoint = {
    lng: currentPoint.xCoordinate,
    lat: currentPoint.yCoordinate
  };
  bearingsInOrder.push(lastNewPoint)

  return bearingsInOrder;
}

module.exports = router;