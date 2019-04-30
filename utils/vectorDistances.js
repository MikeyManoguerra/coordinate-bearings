
const Bearing = require('../models/bearing');

/**
 * recursive?
 * have my starting point
 * Get an array of all the coordinate points objects
 * filter by parameters. remove any point >< than direction heading
 * use vector formula to get distance of each plot point to starting point
 * shortest one becomes new bearing instance
 *remove that point from large array
 new bearing instance becomes starting point
 return plot point with shortes parameter distance
 */


//magnitude = sqrt((x2-x1)^2 +(y2-y1)^2)

// const magnitude = Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2))


function buildRoute(route, currentPoint, pointArray, parentId = null) {
  const routeId = route.id;
  const bearingDirection = route.bearingDirection;
  const updatedPointArray = filterPointArray(currentPoint, pointArray, bearingDirection)
  if (updatedPointArray.length === 0) {
    return;
  }
  const [nextPoint, shortestMagnitude] = findTheNextPoint(currentPoint, updatedPointArray);
  const newBearing = {
    xCoordinate: nextPoint.xCoordinate,
    yCoordinate: nextPoint.yCoordinate,
    magnitudeToParent: shortestMagnitude,
    dataSetId: currentPoint.dataSetId,
    routeId,
    parentId,
  };

  return Bearing.create(newBearing)
    .then((bearing) => {
      const childId = bearing.id;
      if (parentId) {
        Bearing.findOneAndUpdate({ _id: parentId }, { $set: { childId: childId } }, { returnNewDocument: true });
      }
      return buildRoute(route, nextPoint, updatedPointArray, childId);
    })
    .catch(() => {

    })
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
  // does not handle crossing the max longitude line in pacific
  switch (bearingDirection) {
    case 'NORTH': {
      return arrayWithCurrentRemoved.filter(point => {
        point.xCoordinate > currentPoint.xCoordinate;
      })
    }
    case 'SOUTH': {
      return arrayWithCurrentRemoved.filter(point => {
        point.xCoordinate < currentPoint.xCoordinate;
      })
    }
    case 'EAST': {
      return arrayWithCurrentRemoved.filter(point => {
        point.yCoordinate > currentPoint.yCoordinate;
      })
    }
    case 'WEST': {
      return arrayWithCurrentRemoved.filter(point => {
        point.yCoordinate < currentPoint.yCoordinate;
      })
    }
    default:
      return arrayWithCurrentRemoved;
  }
}




const pointA = {
  id: 'gjreikg49363tgersw',
  xCoordinate: 2.64262367755,
  yCoordinate: 2.45235323,
}

const pointB = {
  id: '22',
  xCoordinate: -10.75474588,
  yCoordinate: 2.9769497649,
}

const pointArrayTest = [
  {
    id: 'g4r3qy45breabqy45q',
    xCoordinate: 2.64262367755,
    yCoordinate: 2.45235323,
  },
  {
    id: 'g4r3qy45qbfdabreby45q',
    xCoordinate: 2.64262367755,
    yCoordinate: 2.45235323,
  },
  {
    id: 'g4r3qy466436435qy45q',
    xCoordinate: 2.64262367755,
    yCoordinate: 2.45235323,
  },
  {
    id: 'g4r3qy4665qy45q',
    xCoordinate: 2.64262367755,
    yCoordinate: 2.45235323,
  },
  {
    id: 'g4r3q6634463y45qy45q',
    xCoordinate: 2.64262367755,
    yCoordinate: 2.45235323,
  },
  {
    id: '22',
    xCoordinate: 2.64262367755,
    yCoordinate: 2.45235323,
  },

]

filterPointArray(pointB, pointArrayTest);

module.exports = { buildRoute };