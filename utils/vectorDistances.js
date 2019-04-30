
const { Bearing } = require('../models/bearing');

function buildRoute(route, currentPoint, pointArray, parentId = null) {
  // get important variables from route object
  const routeId = route.id;
  const bearingDirection = route.bearingDirection;
  // filter point array by parameters and remove current point from remaining points
  const updatedPointArray = filterPointArray(currentPoint, pointArray, bearingDirection);

  // if there are no points left, exit recursion
  if (updatedPointArray.length === 0) {
    return;
  }
  // get the next point with magnitude formula
  const [nextPoint, shortestMagnitude] = findTheNextPoint(currentPoint, updatedPointArray);
  // define new bearing for database
  const newBearing = {
    xCoordinate: nextPoint.xCoordinate,
    yCoordinate: nextPoint.yCoordinate,
    magnitudeToParent: shortestMagnitude,
    dataSetId: currentPoint.dataSetId,
    routeId,
    parentId,
  };
  // insert new bearing object
  return Bearing.create(newBearing)
    .then((bearing) => {
      const childId = bearing.id;
      // if parentId (any other point but starting point, update parent object with child)
      if (parentId) {
        return Bearing.findOneAndUpdate({ _id: parentId }, { $set: { childId: childId } }, { returnNewDocument: true })
          .then(() => {
            return buildRoute(route, nextPoint, updatedPointArray, childId);
          });
        // add another point to route
      } else return buildRoute(route, nextPoint, updatedPointArray, childId);
    })
    .catch(() => {

    });
}

function findTheNextPoint(currentPoint, pointArray) {
  let shortestMagnitude = calculateMagnitude(currentPoint, pointArray[0]);
  let nextPoint = pointArray[0];
  pointArray.forEach(point => {
    const magnitude = calculateMagnitude(currentPoint, point);
    if (magnitude < shortestMagnitude) {
      shortestMagnitude = magnitude;
      nextPoint = point;
    }
  });
  return [nextPoint, shortestMagnitude];
}

function filterPointArray(currentPoint, pointArray, bearingDirection) {
  // removes newest bearing from the points array, runs the filter function based upon the 
  // users bearing parameters
  const index = pointArray.findIndex(point => point.id === currentPoint.id);
  const arrayWithCurrentRemoved = [...pointArray.slice(0, index), ...pointArray.slice((index + 1))];
  const arrayFilteredForBearing = filterPointsByBearingDirection(currentPoint, arrayWithCurrentRemoved, bearingDirection);
  return arrayFilteredForBearing;
}

//  called inside find the next point
function calculateMagnitude(currentPoint, otherPoint) {
  const currentX = currentPoint.xCoordinate;
  const currentY = currentPoint.yCoordinate;
  const otherX = otherPoint.xCoordinate;
  const otherY = otherPoint.yCoordinate;
  const magnitude = Math.sqrt(Math.pow((otherX - currentX), 2) + Math.pow((otherY - currentY), 2))
  return magnitude;
}

// called in filterPointArray, removes current point and any  points that do not match bearing direction in array
function filterPointsByBearingDirection(currentPoint, arrayWithCurrentRemoved, bearingDirection) {
  // does not handle crossing the max longitude line in pacific, and the northern hemisphere
  switch (bearingDirection) {
    case 'NORTH': {
      const filteredArray = arrayWithCurrentRemoved.filter(point =>
        point.yCoordinate > currentPoint.yCoordinate

      )
      return filteredArray;
    }
    case 'SOUTH': {
      const filteredArray = arrayWithCurrentRemoved.filter(point =>
        point.yCoordinate < currentPoint.yCoordinate

      )
      return filteredArray;
    }
    case 'EAST': {
      const filteredArray = arrayWithCurrentRemoved.filter(point =>
        point.xCoordinate > currentPoint.xCoordinate
      )
      return filteredArray;
    }
    case 'WEST': {
      const filteredArray = arrayWithCurrentRemoved.filter(point =>
        point.xCoordinate < currentPoint.xCoordinate
      )
      return filteredArray;
    }
    default:
      return arrayWithCurrentRemoved;
  }
}

module.exports = { buildRoute };