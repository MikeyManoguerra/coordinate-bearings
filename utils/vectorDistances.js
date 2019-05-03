
const { Bearing } = require('../models/bearing');

function buildRoute(route, currentPoint, pointArray, parentId = null) {
  // get important variables from route object
  const routeId = route.id;
  const bearingDirection = route.bearingDirection;
  // filter point array by parameters and remove current point from remaining points
  const updatedPointArray = filterPointArray(currentPoint, pointArray, bearingDirection);

  // if current point is all thats left, exit recursion
  if (updatedPointArray.length === 1) {
    return;
  }
  // get the next point with magnitude formula
  const currentPointIndex = updatedPointArray.findIndex(point => point.id === currentPoint.id);
  const [nextPoint, shortestMagnitude] = findTheNextPoint(currentPointIndex, updatedPointArray);
  const arrayWithCurrentRemoved = [...updatedPointArray.slice(0, currentPointIndex), ...updatedPointArray.slice((currentPointIndex + 1))];


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
            return buildRoute(route, nextPoint, arrayWithCurrentRemoved, childId);
          });
        // add another point to route
      } else return buildRoute(route, nextPoint, arrayWithCurrentRemoved, childId);
    })
    .catch(() => {

    });
}

function findTheNextPoint(currentPointIndex, pointArray, counter = 1) {

  const currentPoint = pointArray[currentPointIndex];
  let shortestMagnitude;
  let nextPoint;
  let pointToWest = pointArray[currentPointIndex - counter];
  let pointToEast = pointArray[currentPointIndex + counter];

  if (pointToEast && pointToWest) {
    let magnitudeWest = calculateMagnitude(currentPoint, pointToWest);
    let magnitudeEast = calculateMagnitude(currentPoint, pointToEast);
    magnitudeWest < magnitudeEast ? shortestMagnitude = magnitudeWest : shortestMagnitude = magnitudeEast;
    magnitudeWest < magnitudeEast ? nextPoint = pointToWest : nextPoint = pointToEast;
  }
  else if (pointToWest) {
    shortestMagnitude = calculateMagnitude(currentPoint, pointToWest);
    nextPoint = pointToWest;
  }
  else if (pointToEast) {
    shortestMagnitude = calculateMagnitude(currentPoint, pointToEast);
    nextPoint = pointToEast;
  }
  else {
    return [nextPoint, shortestMagnitude];
  }

  counter = counter + 1;
  pointToWest = pointArray[currentPointIndex - counter];
  pointToEast = pointArray[currentPointIndex + counter];

  let closestPointFound = false;

  if (pointToWest) {
    closestPointFound = Math.abs(currentPoint.xCoordinate - pointToWest.xCoordinate) > shortestMagnitude;
    // console.log(Math.abs(currentPoint.xCoordinate - pointToWest.xCoordinate), shortestMagnitude, 'west', closestPointFound);
    if (closestPointFound) {
      return [nextPoint, shortestMagnitude];
    }
  }
  if (pointToEast) {
    closestPointFound = Math.abs(currentPoint.xCoordinate - pointToEast.xCoordinate) > shortestMagnitude;
    // console.log(Math.abs(currentPoint.xCoordinate - pointToEast.xCoordinate), shortestMagnitude, 'east', closestPointFound);
    if (closestPointFound) {
      return [nextPoint, shortestMagnitude];
    }
  }

  return findTheNextPoint(currentPointIndex, pointArray, counter);
}

function filterPointArray(currentPoint, pointArray, bearingDirection) {
  // removes newest bearing from the points array, runs the filter function based upon the 
  // users bearing parameters
  const arrayFilteredForBearing = filterPointsByBearingDirection(currentPoint, pointArray, bearingDirection);
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
        point.yCoordinate >= currentPoint.yCoordinate
      );
      return filteredArray;
    }
    case 'SOUTH': {
      const filteredArray = arrayWithCurrentRemoved.filter(point =>
        point.yCoordinate <= currentPoint.yCoordinate
      );
      return filteredArray;
    }
    case 'EAST': {
      const filteredArray = arrayWithCurrentRemoved.filter(point =>
        point.xCoordinate >= currentPoint.xCoordinate
      );
      return filteredArray;
    }
    case 'WEST': {
      const filteredArray = arrayWithCurrentRemoved.filter(point =>
        point.xCoordinate <= currentPoint.xCoordinate
      );
      return filteredArray;
    }
    default:
      return arrayWithCurrentRemoved;
  }
}

module.exports = { buildRoute };