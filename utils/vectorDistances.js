const Route = require('../models/route');
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

// const newRoute ={
//   name, 
//   description,
//   bearingDirection,
//   dataSetId
// }

function createRoute(newRoute){

}

function buildRoute(currentPoint, pointsArray, routeId) {
  const [nextPoint, shortestMagnitude] = findTheNextPoint(currentPoint, pointsArray);


}



function findTheNextPoint(currentPoint, pointsArray) {
  let shortestMagnitude = calculateMagnitude(currentPoint, pointsArray[0]);
  let nextPoint = pointsArray[0];
  pointsArray.forEach(point => {
    const magnitude = calculateMagnitude(currentPoint, point);
    if (magnitude < shortestMagnitude) {
      shortestMagnitude = magnitude;
      nextPoint = point;
    }
  });
  return [nextPoint, shortestMagnitude];
}

function addBearingToRoute(routeId, nextBearing, shortestMagnitude) {
  // adds the bearing object to the route. unsure if add to DB as we go or build an array and then insert many.
  //  the problem is the parent child relationships,
  // so cant actually use insertmany method
}

function filterPointsArray(currentPoint, pointsArray, bearingDirection) {
  // removes newest bearing from the points array, runs the filter function based upon the 
  // users bearing parameters
  const index = pointsArray.findIndex(point => point.id === currentPoint.id);
  const arrayWithCurrentRemoved = [...pointsArray.slice(0, index), ...pointsArray.slice((index + 1))];
  const arrayFilteredForBearing = filterPointsByBearingDirection(currentPoint, arrayWithCurrentRemoved, bearingDirection);
  return arrayFilteredForBearing;
}

function calculateMagnitude(currentPoint, otherPoint) {
  const currentX = currentPoint.xCoordinate;
  const currentY = currentPoint.yCoordinate;
  const otherX = otherPoint.xCoordinate;
  const otherY = otherPoint.yCoordinate;
  const magnitude = Math.sqrt(Math.pow((otherX - currentX), 2) + Math.pow((otherY - currentY), 2))
  return magnitude;
}

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

filterPointsArray(pointB, pointArrayTest)