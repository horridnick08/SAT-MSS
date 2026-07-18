import type { GeoJSONPolygon, GeoJSONPoint } from '@satmss/shared-types';

/**
 * Validates if a polygon has at least 3 vertices and forms a closed loop.
 */
export function isValidGeoJSONPolygon(polygon: GeoJSONPolygon): boolean {
  if (!polygon.coordinates || polygon.coordinates.length === 0) {
    return false;
  }

  for (const ring of polygon.coordinates) {
    // A linear ring must have at least 4 positions (minimum 3 unique coordinates + closed loop)
    if (ring.length < 4) {
      return false;
    }

    const first = ring[0];
    const last = ring[ring.length - 1];

    if (!first || !last || first[0] !== last[0] || first[1] !== last[1]) {
      return false; // Not a closed ring
    }
  }

  return true;
}

/**
 * Calculates a bounding box [minLon, minLat, maxLon, maxLat] for a GeoJSON polygon.
 */
export function getPolygonBoundingBox(polygon: GeoJSONPolygon): [number, number, number, number] {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;

  const outerRing = polygon.coordinates[0];
  if (!outerRing) {
    throw new Error('Invalid polygon coordinates mapping');
  }

  for (const coord of outerRing) {
    const lon = coord[0];
    const lat = coord[1];
    if (lon < minLon) minLon = lon;
    if (lat < minLat) minLat = lat;
    if (lon > maxLon) maxLon = lon;
    if (lat > maxLat) maxLat = lat;
  }

  return [minLon, minLat, maxLon, maxLat];
}

/**
 * Calculates the centroid of a GeoJSON polygon ring using coordinate averaging.
 */
export function getPolygonCentroid(polygon: GeoJSONPolygon): GeoJSONPoint {
  const outerRing = polygon.coordinates[0];
  if (!outerRing || outerRing.length === 0) {
    throw new Error('Invalid polygon coordinates mapping');
  }

  let totalLon = 0;
  let totalLat = 0;
  // Exclude duplicate closing vertex in average calculation
  const uniqueCount = outerRing.length - 1;

  for (let i = 0; i < uniqueCount; i++) {
    const coord = outerRing[i];
    if (coord) {
      totalLon += coord[0];
      totalLat += coord[1];
    }
  }

  return {
    type: 'Point',
    coordinates: [totalLon / uniqueCount, totalLat / uniqueCount],
  };
}

/**
 * Formats decimal degree coordinates to a clean string format.
 */
export function formatCoordinates(lon: number, lat: number): string {
  const lonCardinal = lon >= 0 ? 'E' : 'W';
  const latCardinal = lat >= 0 ? 'N' : 'S';
  return `${Math.abs(lat).toFixed(6)}°${latCardinal}, ${Math.abs(lon).toFixed(6)}°${lonCardinal}`;
}
