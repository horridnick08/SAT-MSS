-- SAT-MSS PostgreSQL Initialization Script
-- Runs once on first container startup.
-- Enables PostGIS and creates required extensions.

-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Verify PostGIS is loaded
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
    RAISE EXCEPTION 'PostGIS extension failed to load';
  END IF;
  RAISE NOTICE 'PostGIS % loaded successfully', PostGIS_Version();
END $$;
