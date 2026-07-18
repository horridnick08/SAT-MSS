import { customType } from 'drizzle-orm/pg-core';

// Custom PostGIS Polygon type mapping for Drizzle ORM
export const geometryPolygon = customType<{
  data: any;
  driverData: any;
}>({
  dataType() {
    return 'geometry(Polygon, 4326)';
  },
  toDriver(value) {
    return value;
  },
  fromDriver(value) {
    return value;
  }
});

// Custom PostGIS MultiPolygon type mapping
export const geometryMultiPolygon = customType<{
  data: any;
  driverData: any;
}>({
  dataType() {
    return 'geometry(MultiPolygon, 4326)';
  },
  toDriver(value) {
    return value;
  },
  fromDriver(value) {
    return value;
  }
});

// Custom PostGIS Point type mapping
export const geometryPoint = customType<{
  data: any;
  driverData: any;
}>({
  dataType() {
    return 'geometry(Point, 4326)';
  },
  toDriver(value) {
    return value;
  },
  fromDriver(value) {
    return value;
  }
});
