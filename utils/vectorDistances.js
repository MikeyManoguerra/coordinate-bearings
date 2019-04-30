/**
 * 
 * recursive?
 * have my starting point
 * 
 * Get an array of all the coordinate points objects
 *  
 * filter by parameters. remove any point >< than direction heading
 * use vector formula to get distance of each plot point to starting point
 * shortest one becomes new bearing instance
 *remove that point from large array
 new bearing instance becomes starting point
 return plot point with shortes parameter distance
 * 
 * 
 */


//magnitude = sqrt((x2-x1)^2 +(y2-y1)^2)

// const magnitude = Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2))
function calculateMagnitude(currentPoint, otherPoint) {
  const currentX = currentPoint.xCoordinate;
  const currentY = currentPoint.yCoordinate;
  const otherX = otherPoint.xCoordinate;
  const otherY = otherPoint.yCoordinate;
  const magnitude = Math.sqrt(Math.pow((otherX - currentX), 2) + Math.pow((otherY - currentY), 2))
  return magnitude;
}


function findTheNextBearing(currentPoint, pointsArray) {
  let shortestMagnitude = calculateMagnitude(currentPoint, pointsArray[0]);
  let nextBearing = pointsArray[0];
  pointsArray.forEach(point => {
    const magnitude = calculateMagnitude(currentPoint, point);
    if (magnitude < shortestMagnitude) {
      shortestMagnitude = magnitude;
      nextBearing = point;
    }
  });
  return [nextBearing, shortestMagnitude];
}

function addBearingToRoute(routeId, nextBearing, shortestMagnitude) {
  // adds the bearing object to the route. unsure if add to DB as we go or build an array and then insert many.
  //  the problem is the parent child relationships,
  // so cant actually use insertmany method
}

function filterPointsArray() {
  // removes newest bearing from the points array, runs the filter function based upon the 
  // users bearing parameters
}