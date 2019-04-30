

const express = require('express');
const router = express.Router();
const { Point } = require('../models/point');
const { DataSet } = require('../models/dataSet');
const { Route } = require('../models/route');
const { Bearing } = require('../models/bearing');

const { buildRoute } = require('../utils/vectorDistances');


router.post('/', (req, res, next) => {

  const {
    name,
    description,
    bearingDirection
  } = req.body;
  let route;

  return DataSet.findOne()
    .then((dataSet) => {
      const dataSetId = dataSet.id;
      const newRoute = {
        name,
        description,
        bearingDirection,
        dataSetId
      };
      return Route.create(newRoute);
    })
    .then(_route => {
      route = _route;
      return Point.find({ dataSetId: route.dataSetId });
    })
    .then(pointArray => {

      let indexArray = [];
      for (let i = 0; i < 1000; i++) {
        let index = Math.floor(Math.random() * pointArray.length);
        indexArray.push(index);
      }
      let filteredPointArray = [];
      indexArray.forEach(index => {
        filteredPointArray.push(pointArray[index]);
      });
      // TODO: have a better way of defining the initialPoint, but for now, random
      const initialPoint = filteredPointArray[Math.floor(filteredPointArray.length / 2)];
      return buildRoute(route, initialPoint, filteredPointArray);
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