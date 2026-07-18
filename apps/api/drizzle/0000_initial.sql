-- 0000_initial.sql
-- Master schema migration for SAT-MSS database

-- 1. Create spatial extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" varchar(255) NOT NULL UNIQUE,
  "password_hash" varchar(255) NOT NULL,
  "name" varchar(150) NOT NULL,
  "organization" varchar(150) NOT NULL,
  "role" varchar(20) NOT NULL,
  "is_active" boolean NOT NULL DEFAULT true,
  "notification_threshold" integer NOT NULL DEFAULT 70,
  "last_login_at" timestamp with time zone,
  "created_by" uuid,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "totp_secret" text,
  "is_totp_enabled" boolean NOT NULL DEFAULT false
);

-- Self-reference foreign key on users
ALTER TABLE "users" ADD CONSTRAINT fk_users_created_by FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE RESTRICT;

-- 3. Create aois table
CREATE TABLE IF NOT EXISTS "aois" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(100) NOT NULL,
  "geometry" geometry(polygon, 4326) NOT NULL,
  "state_code" varchar(5) NOT NULL,
  "state_name" varchar(100) NOT NULL,
  "district_name" varchar(100) NOT NULL,
  "priority" varchar(10) NOT NULL DEFAULT 'MEDIUM',
  "is_active" boolean NOT NULL DEFAULT true,
  "notes" text,
  "area_ha" real,
  "created_by" uuid NOT NULL REFERENCES "users" ("id") ON DELETE RESTRICT,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- 4. Create imagery_scenes table
CREATE TABLE IF NOT EXISTS "imagery_scenes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "aoi_id" uuid NOT NULL REFERENCES "aois" ("id") ON DELETE RESTRICT,
  "satellite_source" varchar(20) NOT NULL,
  "tile_id" varchar(50) NOT NULL,
  "acquisition_date" varchar(10) NOT NULL,
  "acquisition_datetime" timestamp with time zone NOT NULL,
  "cloud_cover_pct" real NOT NULL,
  "processing_level" varchar(10) NOT NULL,
  "storage_path" text NOT NULL,
  "footprint" geometry(polygon, 4326) NOT NULL,
  "available_bands" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "solar_elevation_deg" real,
  "file_size_bytes" real,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- 5. Create ingestion_log table
CREATE TABLE IF NOT EXISTS "ingestion_log" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "aoi_id" uuid NOT NULL REFERENCES "aois" ("id") ON DELETE RESTRICT,
  "scene_id" uuid REFERENCES "imagery_scenes" ("id") ON DELETE RESTRICT,
  "satellite_source" varchar(20) NOT NULL,
  "tile_id" varchar(50) NOT NULL,
  "acquisition_date" varchar(10) NOT NULL,
  "cloud_cover_pct" real,
  "status" varchar(30) NOT NULL,
  "error_message" text,
  "ingested_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- 6. Create boundary_datasets table
CREATE TABLE IF NOT EXISTS "boundary_datasets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(200) NOT NULL,
  "type" varchar(20) NOT NULL,
  "state_code" varchar(5) NOT NULL,
  "validity_date" varchar(10) NOT NULL,
  "is_active" boolean NOT NULL DEFAULT false,
  "polygon_count" integer NOT NULL DEFAULT 0,
  "file_format" varchar(20) NOT NULL,
  "storage_key" text,
  "notes" text,
  "imported_by" uuid NOT NULL REFERENCES "users" ("id") ON DELETE RESTRICT,
  "imported_at" timestamp with time zone NOT NULL DEFAULT now(),
  "activated_at" timestamp with time zone,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- 7. Create boundary_polygons table
CREATE TABLE IF NOT EXISTS "boundary_polygons" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "dataset_id" uuid NOT NULL REFERENCES "boundary_datasets" ("id") ON DELETE RESTRICT,
  "name" varchar(200) NOT NULL,
  "permit_number" varchar(100),
  "permit_status" varchar(50),
  "geometry" geometry(multipolygon, 4326) NOT NULL,
  "max_disturbance_ha" real,
  "external_id" varchar(100),
  "metadata" text
);

-- 8. Create analysis_runs table
CREATE TABLE IF NOT EXISTS "analysis_runs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "aoi_id" uuid NOT NULL REFERENCES "aois" ("id") ON DELETE RESTRICT,
  "baseline_scene_id" uuid NOT NULL REFERENCES "imagery_scenes" ("id") ON DELETE RESTRICT,
  "target_scene_id" uuid NOT NULL REFERENCES "imagery_scenes" ("id") ON DELETE RESTRICT,
  "sensitivity_level" varchar(10) NOT NULL DEFAULT 'STANDARD',
  "status" varchar(20) NOT NULL DEFAULT 'QUEUED',
  "progress_pct" varchar(5) NOT NULL DEFAULT '0',
  "current_phase" varchar(30),
  "triggered_by" uuid NOT NULL REFERENCES "users" ("id") ON DELETE RESTRICT,
  "gse_job_id" varchar(100),
  "started_at" timestamp with time zone,
  "completed_at" timestamp with time zone,
  "error_message" text,
  "processing_metadata" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- 9. Create change_zones table
CREATE TABLE IF NOT EXISTS "change_zones" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "run_id" uuid NOT NULL REFERENCES "analysis_runs" ("id") ON DELETE RESTRICT,
  "change_type" varchar(20) NOT NULL,
  "geometry" geometry(polygon, 4326) NOT NULL,
  "area_sqm" real NOT NULL,
  "area_ha" real NOT NULL,
  "centroid" geometry(point, 4326) NOT NULL,
  "intersection_category" varchar(40) NOT NULL,
  "dist_to_protected_area_m" real NOT NULL,
  "dist_to_water_body_m" real NOT NULL,
  "ndvi_delta" real NOT NULL,
  "swir_ratio" real,
  "severity_score" real NOT NULL,
  "is_flagged_evidence" boolean NOT NULL DEFAULT false,
  "is_dismissed" boolean NOT NULL DEFAULT false,
  "dismissal_reason" text
);

-- 10. Create alerts table
CREATE TABLE IF NOT EXISTS "alerts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "aoi_id" uuid NOT NULL REFERENCES "aois" ("id") ON DELETE RESTRICT,
  "primary_zone_id" uuid NOT NULL REFERENCES "change_zones" ("id") ON DELETE RESTRICT,
  "run_id" uuid NOT NULL REFERENCES "analysis_runs" ("id") ON DELETE RESTRICT,
  "severity_score" real NOT NULL,
  "intersection_category" varchar(40) NOT NULL,
  "total_area_ha" real NOT NULL,
  "zone_count" real NOT NULL,
  "status" varchar(40) NOT NULL DEFAULT 'PENDING_REVIEW',
  "is_duplicate" boolean NOT NULL DEFAULT false,
  "is_potential_duplicate" boolean NOT NULL DEFAULT false,
  "parent_alert_id" uuid,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- 11. Create alert_status_log table
CREATE TABLE IF NOT EXISTS "alert_status_log" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "alert_id" uuid NOT NULL REFERENCES "alerts" ("id") ON DELETE RESTRICT,
  "previous_status" varchar(40),
  "new_status" varchar(40) NOT NULL,
  "changed_by" uuid NOT NULL REFERENCES "users" ("id") ON DELETE RESTRICT,
  "justification_note" text NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- 12. Create case_files table
CREATE TABLE IF NOT EXISTS "case_files" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "reference_number" varchar(20) NOT NULL UNIQUE,
  "alert_id" uuid NOT NULL REFERENCES "alerts" ("id") ON DELETE RESTRICT,
  "status" varchar(20) NOT NULL DEFAULT 'DRAFT',
  "compiled_by" uuid NOT NULL REFERENCES "users" ("id") ON DELETE RESTRICT,
  "analyst_notes" text,
  "recommendation" varchar(100),
  "recommendation_detail" text,
  "pdf_storage_path" text,
  "geojson_storage_path" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- 13. Create case_file_evidence_images table
CREATE TABLE IF NOT EXISTS "case_file_evidence_images" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "case_file_id" uuid NOT NULL REFERENCES "case_files" ("id") ON DELETE RESTRICT,
  "scene_id" uuid NOT NULL REFERENCES "imagery_scenes" ("id") ON DELETE RESTRICT,
  "caption" text NOT NULL,
  "display_order" integer NOT NULL DEFAULT 0
);

-- 14. Create case_file_audit table
CREATE TABLE IF NOT EXISTS "case_file_audit" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "case_file_id" uuid NOT NULL REFERENCES "case_files" ("id") ON DELETE RESTRICT,
  "action" varchar(30) NOT NULL,
  "performed_by" uuid NOT NULL REFERENCES "users" ("id") ON DELETE RESTRICT,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- 15. Create notifications table
CREATE TABLE IF NOT EXISTS "notifications" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE RESTRICT,
  "alert_id" uuid REFERENCES "alerts" ("id") ON DELETE RESTRICT,
  "type" varchar(20) NOT NULL,
  "title" varchar(200) NOT NULL,
  "body" text NOT NULL,
  "is_read" boolean NOT NULL DEFAULT false,
  "sent_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- 16. Create severity_config table
CREATE TABLE IF NOT EXISTS "severity_config" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "factor_name" varchar(50) NOT NULL UNIQUE,
  "factor_label" varchar(100) NOT NULL,
  "weight_pct" integer NOT NULL,
  "updated_by" uuid NOT NULL REFERENCES "users" ("id") ON DELETE RESTRICT,
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES (IBP §4.4)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_aois_geometry ON aois USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_change_zones_geometry ON change_zones USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_boundary_polygons_geometry ON boundary_polygons USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_imagery_scenes_footprint ON imagery_scenes USING GIST (footprint);

CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts (status);
CREATE INDEX IF NOT EXISTS idx_alerts_aoi_id ON alerts (aoi_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity_score ON alerts (severity_score DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_imagery_scenes_aoi_acquisition ON imagery_scenes (aoi_id, acquisition_date DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_runs_aoi_id ON analysis_runs (aoi_id);
CREATE INDEX IF NOT EXISTS idx_analysis_runs_status ON analysis_runs (status);
CREATE INDEX IF NOT EXISTS idx_change_zones_run_id ON change_zones (run_id);
CREATE INDEX IF NOT EXISTS idx_alert_status_log_alert_id ON alert_status_log (alert_id);
CREATE INDEX IF NOT EXISTS idx_case_file_audit_case_file_id ON case_file_audit (case_file_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications (user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_ingestion_log_aoi_date ON ingestion_log (aoi_id, ingested_at DESC);
