import * as Cesium from 'cesium';

/**
 * Converts a single Cesium.Cartesian3 coordinate to geographic [longitude, latitude] in degrees.
 */
export function cartesianToLngLat(point: Cesium.Cartesian3): [number, number] {
  const cartographic = Cesium.Cartographic.fromCartesian(point);
  const longitude = Cesium.Math.toDegrees(cartographic.longitude);
  const latitude = Cesium.Math.toDegrees(cartographic.latitude);
  return [longitude, latitude];
}

/**
 * Converts an array of Cesium.Cartesian3 coordinates to an array of geographic [longitude, latitude] coordinates.
 * This does NOT automatically close the loop.
 */
export function cartesianArrayToLngLats(points: Cesium.Cartesian3[]): [number, number][] {
  return points.map(cartesianToLngLat);
}

/**
 * Converts an array of Cesium.Cartesian3 coordinates to a standard closed GeoJSON Polygon geometry coordinate hierarchy.
 * Automatically ensures the first and last coordinates are identical.
 */
export function cartesianArrayToGeoJsonPolygonCoordinates(points: Cesium.Cartesian3[]): [number, number][][] {
  const lngLats = cartesianArrayToLngLats(points);
  if (lngLats.length > 0) {
    const first = lngLats[0];
    const last = lngLats[lngLats.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      lngLats.push([...first]);
    }
  }
  return [lngLats];
}
