# Final Implementation Blueprint
## SAT-MSS — Satellite Mining Surveillance System
### Developer Handbook · Version 1.0 · India MVP

---

| Document Control | |
|---|---|
| **Document ID** | IBP-SATMSS-001 |
| **Version** | 1.0.0 |
| **Status** | Final — Development Approved |
| **Authority** | Chief Software Architect / Technical Program Manager |
| **Classification** | Internal — Engineering Confidential |
| **Source Documents** | PRD (`problem_definition.md`) · SRS (`srs_document.md`) · PXD (`pxd_document.md`) |
| **Date Issued** | 2026-07-19 |
| **Development Start** | Post stakeholder sign-off on this document |

> **NOTICE:** This is the final planning document for SAT-MSS Version 1.0. No further planning artifacts will be produced unless requirements formally change via the Change Request process. All architectural decisions herein are binding for the MVP delivery.

---

## Table of Contents

- Section 1 — Project Architecture
- Section 2 — Technology Stack
- Section 3 — Development Standards
- Section 4 — Database Design
- Section 5 — API Contract
- Section 6 — Frontend Architecture
- Section 7 — Backend Architecture
- Section 8 — Geospatial Engine
- Section 9 — AI Module
- Section 10 — Sprint Plan
- Section 11 — Milestones
- Section 12 — Development Order
- Section 13 — Technical Risks
- Section 14 — Definition of Done

---

## SECTION 1 — Project Architecture

### 1.1 Architecture Style

SAT-MSS uses a **Modular Monolith Backend** paired with a **Single-Page Application Frontend** and a **dedicated Geospatial Processing Service**. This is a deliberate decision against microservices at MVP stage — it reduces operational complexity while preserving the module boundaries required for future decomposition.

The three primary runtime systems are:

```
┌─────────────────────────────────────────────────────────────────────┐
│  SAT-MSS SYSTEM BOUNDARY                                            │
│                                                                     │
│  ┌─────────────────────┐     ┌───────────────────────────────┐     │
│  │   FRONTEND (SPA)    │────▶│   BACKEND API (Modular)       │     │
│  │   Next.js + Cesium  │◀────│   Node.js / Express           │     │
│  │   Browser Runtime   │     │   REST + WebSocket            │     │
│  └─────────────────────┘     └──────────────┬────────────────┘     │
│                                             │                       │
│                               ┌─────────────▼──────────────┐       │
│                               │  GEOSPATIAL ENGINE (GSE)   │       │
│                               │  Python / FastAPI           │       │
│                               │  Rasterio · GDAL · NumPy   │       │
│                               └─────────────┬──────────────┘       │
│                                             │                       │
│         ┌───────────────────────────────────▼──────────────────┐   │
│         │  DATA LAYER                                          │   │
│         │  PostgreSQL + PostGIS · Redis · Object Storage       │   │
│         └──────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Celery      │  │  SMTP/Email  │  │  External: Copernicus    │  │
│  │  Worker Pool │  │  Notifier    │  │  Open Access Hub (EOSDIS)│  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Monorepo Layout

The project lives in a single Git repository managed with **pnpm workspaces** at the JavaScript layer and a separate **Python virtual environment** for the geospatial engine.

```
satmss/
│
├── apps/
│   ├── web/                         # Frontend — Next.js SPA
│   └── api/                         # Backend — Node.js/Express
│
├── services/
│   └── gse/                         # Geospatial Engine — Python/FastAPI
│
├── packages/
│   ├── shared-types/                # TypeScript interfaces shared between web and api
│   ├── shared-constants/            # Shared enums, status codes, role definitions
│   └── geo-utils/                   # Shared geospatial utility functions (TypeScript)
│
├── infrastructure/
│   ├── docker/                      # Dockerfiles for each service
│   ├── docker-compose.yml           # Local development orchestration
│   ├── docker-compose.prod.yml      # Production override
│   └── nginx/                       # Reverse proxy configuration
│
├── database/
│   ├── migrations/                  # SQL migration files (numbered sequentially)
│   ├── seeds/                       # Seed data for development and testing
│   └── schema.sql                   # Master schema reference (auto-generated)
│
├── scripts/
│   ├── setup.sh                     # First-time developer environment setup
│   ├── seed-india-boundaries.sh     # Seeds India state/district boundary data
│   └── import-concessions.sh        # Imports sample concession datasets
│
├── docs/
│   ├── problem_definition.md        # PRD
│   ├── srs_document.md              # SRS
│   ├── pxd_document.md              # PXD
│   └── implementation_blueprint.md  # This document
│
├── .github/
│   ├── workflows/                   # CI/CD pipeline definitions
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .env.example                     # All required environment variables (no values)
├── pnpm-workspace.yaml
├── package.json                     # Root package (dev tooling only)
├── tsconfig.base.json               # Base TypeScript config extended by all apps
└── README.md
```

### 1.3 Module Boundaries

Each module within the backend API is a self-contained directory. Modules communicate exclusively through their exported service interfaces — never through direct database queries across module boundaries.

| Module | Responsibility | Owned Tables |
|---|---|---|
| `auth` | Authentication, session management, RBAC enforcement | `users`, `sessions`, `roles` |
| `aoi` | AOI CRUD, boundary management, district/state assignment | `aois`, `aoi_versions` |
| `imagery` | Scene catalog, ingestion log, band metadata | `imagery_scenes`, `ingestion_log` |
| `boundaries` | Concession and protected area boundary import and versioning | `boundary_datasets`, `boundary_polygons` |
| `analysis` | Analysis run orchestration, result storage, GSE job dispatch | `analysis_runs`, `change_zones` |
| `alerts` | Alert lifecycle, triage, deduplication, notification dispatch | `alerts`, `alert_status_log` |
| `cases` | Case file compilation, PDF generation, export, audit trail | `case_files`, `case_file_audit` |
| `reports` | Operational dashboard aggregations, metrics | (read-only cross-module queries) |
| `admin` | User management, severity weight configuration, system health | `severity_config`, `system_settings` |
| `notifications` | Email and in-platform notification delivery | `notifications` |

### 1.4 Dependency Graph

```
web ──────────────────────────────────────────────────▶ api
web ──────────────────────────────────────────────────▶ shared-types
web ──────────────────────────────────────────────────▶ shared-constants
api ──────────────────────────────────────────────────▶ shared-types
api ──────────────────────────────────────────────────▶ shared-constants
api ──────────────────────────────────────────────────▶ geo-utils
api ──────────────────────────────────────────────────▶ gse (HTTP)
api ──────────────────────────────────────────────────▶ PostgreSQL+PostGIS
api ──────────────────────────────────────────────────▶ Redis
gse ──────────────────────────────────────────────────▶ PostgreSQL+PostGIS
gse ──────────────────────────────────────────────────▶ Object Storage (MinIO/S3)
gse ──────────────────────────────────────────────────▶ Copernicus Open Access Hub
```

**Constraint:** `gse` never calls `api`. Data flows from `gse` to the database directly. The `api` reads results after the `gse` writes them. This prevents circular dependencies and ensures the geospatial engine is independently testable.

### 1.5 Inter-Service Communication

| Channel | Direction | Protocol | Usage |
|---|---|---|---|
| REST API | web → api | HTTPS | All user-initiated actions |
| WebSocket | api → web | WSS | Real-time alerts, analysis progress |
| Internal REST | api → gse | HTTP (internal network) | Dispatch analysis jobs |
| Message Queue | api ↔ gse | Redis Pub/Sub | Job status callbacks |
| Object Storage | gse ↔ storage | S3-compatible API | Imagery tile read/write |
| SMTP | api → email | SMTP/TLS | Alert email notifications |

---

## SECTION 2 — Technology Stack

Every technology choice below is justified by the system's requirements from the SRS and PXD. No technology was selected for trendiness — each was chosen for a specific architectural reason.

### 2.1 Frontend

| Technology | Version | Justification |
|---|---|---|
| **Next.js** | 14.x (App Router) | SSR capabilities for initial load performance (NFR-002). Built-in API routes for lightweight BFF patterns. Strong TypeScript support. Industry-standard React framework. |
| **React** | 18.x | Component-based architecture required for the complex, layered Mission Control UI (PXD §8). Concurrent rendering improves perceived performance during Cesium globe transitions. |
| **CesiumJS** | 1.118+ | The only open-source, browser-native 3D globe rendering library capable of photorealistic terrain, WGS84-accurate polygon draping, and camera choreography matching PXD §6. No alternative (Mapbox, Leaflet) provides equivalent 3D terrain with satellite imagery draping. |
| **Resium** | Latest | React bindings for CesiumJS. Allows Cesium entities to be declared as React components, enabling controlled state management of globe entities without imperative DOM-style coding. |
| **Zustand** | 4.x | Lightweight, fast state management. SAT-MSS requires complex, shared state across the Mission Control panels (active AOI, current analysis, timeline position, active alert). Zustand outperforms Redux for this non-hierarchical state topology without boilerplate overhead. |
| **React Query (TanStack)** | 5.x | Server state management, caching, and automatic background refetching for alert feeds and dashboard data. Eliminates manual loading/error state management across 40+ API calls. |
| **TypeScript** | 5.x | Mandatory. The geospatial data models (GeoJSON, WGS84 coordinates, analysis results) are complex nested structures. TypeScript prevents an entire class of runtime errors that would be catastrophic in a forensic evidence system. |
| **Tailwind CSS** | 3.x | Utility-first CSS for rapid, consistent implementation of the Orbital Glass design system (PXD §15). Custom CSS properties are used for the glassmorphism values; Tailwind handles layout, spacing, and responsive utilities. |
| **Framer Motion** | 10.x | Declarative animation library for implementing the 13 animation tokens defined in PXD §11.2. Handles panel slide-ins, fade transitions, and staggered zone appearance. |
| **React Hook Form + Zod** | Latest | Form management and validation for AOI confirmation, report assembly, and user management forms. Zod schemas are shared with the backend via `shared-types` package. |
| **Recharts** | 2.x | The change area timeline sparkline chart (PXD §18.4). Recharts is SVG-based, composable, and integrates cleanly with React state without a separate charting runtime. |

### 2.2 Backend (API)

| Technology | Version | Justification |
|---|---|---|
| **Node.js** | 20.x LTS | Runtime for the API server. The API is predominantly I/O-bound (database queries, GSE dispatch, storage calls), which Node's event loop handles efficiently. V8 performance is sufficient for REST workloads. |
| **Express.js** | 4.x | Minimal, well-understood HTTP framework. The modular monolith structure requires precise control over request routing and middleware composition that Express provides without opinionated scaffolding. |
| **TypeScript** | 5.x | Same rationale as frontend. Shared types package requires TypeScript on both sides of the API contract. |
| **Drizzle ORM** | Latest | Type-safe SQL query builder that generates native PostgreSQL queries. Unlike Prisma, Drizzle does not abstract PostGIS spatial functions away — analysts' queries like `ST_Intersects`, `ST_Distance`, and `ST_Area` are expressible as typed Drizzle extensions. Critical for the concession intersection logic (FR-010). |
| **Socket.IO** | 4.x | WebSocket implementation for real-time features: analysis progress streaming (SCR-08), alert notifications (FR-016), and live dashboard metric updates. |
| **Bull + Redis** | Bull 4.x / Redis 7 | Job queue for background processing: PDF report generation, email dispatch, imagery metadata sync. Provides job retry, dead-letter queuing, and job progress events. |
| **Nodemailer** | Latest | SMTP email dispatch for alert notifications (FR-016). Supports authenticated SMTP, TLS, and template-based emails. |
| **Passport.js + JWT** | Latest | Authentication. Passport handles the strategy pattern (local credentials, future SAML/OAuth extension). JWTs carry the RBAC role claim, enabling stateless permission checks on every route. |
| **Argon2** | Latest | Password hashing. Argon2id is the current gold standard for server-side password storage, preferred over bcrypt for its memory-hardness properties. |
| **Puppeteer** | Latest | Headless Chrome for PDF report generation (FR-022). The report PDF is rendered from an HTML template, allowing pixel-perfect formatting matching the PXD §22.4 specification. |
| **Zod** | 3.x | Runtime validation of all API request bodies and query parameters. Schema definitions live in `shared-types` and are imported by both API route handlers and frontend forms. |
| **Winston** | Latest | Structured logging. All log entries are JSON-formatted with correlation IDs, enabling log aggregation and forensic tracing of the immutable audit trail (FR-023). |

### 2.3 Geospatial Engine (GSE)

| Technology | Version | Justification |
|---|---|---|
| **Python** | 3.11+ | Standard language for Earth Observation and geospatial scientific computing. The ecosystem of GDAL, Rasterio, NumPy, and Scikit-image is Python-native. No other language matches this library depth for EO processing. |
| **FastAPI** | 0.110+ | The GSE exposes an internal REST API to the Node.js backend for job dispatch. FastAPI provides async support, automatic OpenAPI docs, and Pydantic validation with minimal overhead. |
| **GDAL** | 3.8+ | Foundation of all geospatial data I/O. Reading Sentinel-2 .SAFE packages, reprojecting rasters, writing GeoTIFF outputs. GDAL is the de-facto standard for all professional geospatial processing. |
| **Rasterio** | 1.3+ | Pythonic wrapper over GDAL for raster operations. Used for band reading, windowed reads (memory-efficient processing of large scenes), and writing output rasters. |
| **NumPy** | 1.26+ | Array-based computation for pixel-level operations — NDVI calculation, pixel difference arrays, threshold masking. All band data is loaded as NumPy arrays. |
| **Scikit-image** | 0.22+ | Image processing algorithms: morphological operations (erosion/dilation for noise removal), connected component labeling (individual change zone identification), and region property measurement (zone area, centroid). |
| **Shapely** | 2.x | Geometric operations in Python: polygon intersection, union, buffering (for proximity calculations in severity scoring). Shapely 2.x uses GEOS 3.12 and provides significant performance improvements. |
| **GeoPandas** | 0.14+ | Tabular operations on geospatial data: loading concession boundary shapefiles, spatial joins, dissolve operations. Wraps Shapely and Fiona. |
| **Celery** | 5.x | Distributed task queue for analysis jobs. Analysis runs are dispatched as Celery tasks, enabling concurrent processing of multiple AOIs (NFR-003). Redis serves as both the Celery broker and result backend. |
| **sentinelsat** | 1.x | Python client for the Copernicus Open Access Hub API. Used by the imagery ingestion job to search and download Sentinel-1 and Sentinel-2 scenes for registered AOIs (FR-001, FR-002). |

### 2.4 Database

| Technology | Version | Justification |
|---|---|---|
| **PostgreSQL** | 16.x | Relational database. The combination of ACID compliance (required for the immutable audit trail — FR-023), PostGIS extension, and mature ecosystem make PostgreSQL the only viable choice for a system with both relational and geospatial data requirements. |
| **PostGIS** | 3.4+ | Spatial extension for PostgreSQL. Enables native storage of geometry columns (AOI polygons, change zone boundaries, concession polygons), and execution of spatial queries (`ST_Intersects`, `ST_Distance`, `ST_Area`) in SQL. Eliminates round-trips to the application layer for spatial operations. |
| **Redis** | 7.x | Multi-purpose in-memory store: Celery message broker, Bull job queue backend, API response caching (dashboard aggregations), and WebSocket session state. |

### 2.5 Infrastructure

| Technology | Justification |
|---|---|
| **Docker + Docker Compose** | All services containerized. Local development uses Docker Compose. Production uses Docker Swarm or equivalent. Ensures environment parity across developer machines and deployment targets. |
| **MinIO** | S3-compatible object storage for imagery tiles and case file exports. Self-hosted for data sovereignty compliance (SRS C-03). The Node.js SDK and Python boto3 client both support the S3 API, enabling transparent migration to AWS S3 or GCP GCS if required. |
| **Nginx** | Reverse proxy in front of all services. Handles TLS termination, request routing (web, api, gse internal), rate limiting, and static asset serving. |
| **GitHub Actions** | CI/CD pipeline. Lint, type-check, test, build, and deploy on every pull request merge. |

---

## SECTION 3 — Development Standards

### 3.1 Coding Conventions

**TypeScript (Web + API):**
- Strict mode enabled: `"strict": true` in all `tsconfig.json` files.
- No `any` types permitted without an explicit `// eslint-disable-next-line @typescript-eslint/no-explicit-any` comment and justification.
- All exported functions must have explicit return type annotations.
- Prefer `interface` over `type` for object shape definitions. Use `type` for unions and intersections.
- Imports are organized: (1) Node built-ins, (2) third-party packages, (3) internal packages (`@satmss/*`), (4) relative imports. ESLint `import/order` rule enforces this.
- No default exports from module files — named exports only. Default exports are permitted only in Next.js `page.tsx` files (framework requirement).

**Python (GSE):**
- PEP 8 enforced via `ruff` linter.
- Type hints on all function signatures (`mypy` in strict mode).
- Docstrings on all public functions and classes (Google style).
- No mutable default arguments.
- All file I/O with context managers (`with` blocks).

### 3.2 Naming Conventions

| Concern | Convention | Examples |
|---|---|---|
| TypeScript variables | `camelCase` | `alertSeverityScore`, `aoiPolygon` |
| TypeScript constants | `SCREAMING_SNAKE_CASE` | `MAX_AOI_COUNT`, `ALERT_STATUS_PENDING` |
| TypeScript interfaces | `PascalCase` with `I` prefix | `IAoiRecord`, `IAnalysisResult` |
| TypeScript types | `PascalCase` | `AlertStatus`, `IntersectionCategory` |
| React components | `PascalCase` | `AlertQueuePanel`, `CesiumGlobeViewer` |
| React hooks | `camelCase` with `use` prefix | `useAoiSelection`, `useAnalysisProgress` |
| CSS class names | `kebab-case` | `mission-control-panel`, `alert-severity-chip` |
| API route paths | `kebab-case`, plural resources | `/api/v1/aois`, `/api/v1/case-files` |
| Database tables | `snake_case`, plural | `alert_status_log`, `boundary_datasets` |
| Database columns | `snake_case` | `created_at`, `aoi_id`, `severity_score` |
| Python functions | `snake_case` | `calculate_ndvi_delta`, `run_change_detection` |
| Python classes | `PascalCase` | `ChangeDetectionPipeline`, `SceneIngestionJob` |
| Environment variables | `SCREAMING_SNAKE_CASE` | `DATABASE_URL`, `GSE_INTERNAL_SECRET` |
| Git branches | `kebab-case` with prefix | `feat/aoi-drawing`, `fix/alert-dedup-logic` |

### 3.3 Git Strategy

SAT-MSS uses **GitHub Flow** with protected `main` and long-lived `develop` branches.

```
main           ← Production-ready code only. Tagged releases.
  └── develop  ← Integration branch. Always shippable.
       ├── feat/aoi-drawing-mode
       ├── feat/change-detection-pipeline
       ├── fix/timeline-scrub-crossfade
       └── chore/update-cesium-version
```

**Rules:**
- `main` is protected: no direct pushes. Merge only from `develop` via release PR.
- `develop` is protected: requires 1 approving reviewer and all CI checks passing before merge.
- Feature branches are created from `develop` and merged back to `develop` via Pull Request.
- Delete feature branches after merge.
- Force-pushing to any shared branch is prohibited.

### 3.4 Branch Naming

```
feat/     — New feature work
fix/      — Bug fixes
chore/    — Tooling, dependency, configuration changes
docs/     — Documentation-only changes
test/     — Test-only changes
refactor/ — Code restructuring without behavior change
perf/     — Performance improvements
```

### 3.5 Commit Message Format

SAT-MSS uses **Conventional Commits** specification.

```
<type>(<scope>): <subject>

[optional body]

[optional footer: issue reference, breaking change notice]
```

**Types:** `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`, `ci`

**Scopes:** `auth`, `aoi`, `imagery`, `analysis`, `alerts`, `cases`, `reports`, `admin`, `gse`, `cesium`, `db`, `infra`, `types`

**Examples:**
```
feat(aoi): add polygon vertex undo functionality in drawing mode

fix(analysis): prevent duplicate zone creation on re-run

chore(deps): upgrade CesiumJS from 1.115 to 1.118

feat(cases): implement PDF generation with Puppeteer

BREAKING CHANGE: severity_score column renamed to severity_score_normalized
```

**Rules:**
- Subject line: imperative mood, lowercase, no period, max 72 characters.
- Body: wrap at 72 characters. Explain the *why*, not the *what*.
- Reference GitHub issues: `Closes #47`, `Fixes #112`.

### 3.6 Environment Management

Environment variables are managed per-environment. Never commit values.

**Files:**
- `.env.example` — all variable names with descriptions, no values (committed)
- `.env.local` — developer local values (gitignored)
- `.env.test` — test environment values (gitignored)
- `.env.production` — production values (stored in secrets manager, never in repo)

**Required variables (full list in `.env.example`):**

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/satmss
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis
REDIS_URL=redis://localhost:6379

# Object Storage
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET_IMAGERY=satmss-imagery
MINIO_BUCKET_EXPORTS=satmss-exports

# Authentication
JWT_SECRET=
JWT_EXPIRES_IN=8h
SESSION_SECRET=

# Geospatial Engine
GSE_BASE_URL=http://localhost:8001
GSE_INTERNAL_SECRET=

# External Data Sources
COPERNICUS_USERNAME=
COPERNICUS_PASSWORD=
COPERNICUS_API_URL=https://scihub.copernicus.eu/dhus

# Email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@satmss.gov.in

# Application
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CESIUM_TOKEN=
NODE_ENV=development
```

---

## SECTION 4 — Database Design

### 4.1 Design Principles

- All geometry columns use PostGIS `geometry(Polygon, 4326)` or `geometry(MultiPolygon, 4326)` — WGS84 coordinate system (SRID 4326) throughout, consistent with SRS Constraint DC-05.
- All tables have `created_at` and `updated_at` timestamps. `updated_at` is auto-maintained by a database trigger.
- All primary keys are UUIDs generated by the database (`gen_random_uuid()`), not sequential integers. This prevents ID enumeration attacks and is suitable for distributed systems.
- All audit/log tables are append-only with a `CHECK` constraint preventing `UPDATE` or `DELETE` operations (enforced via a database rule).
- All foreign keys have explicit `ON DELETE RESTRICT` — orphan records are prevented at the database level.

### 4.2 Entity Relationship Diagram

```
users ─────────────────────────────────────────────────────┐
  │ id (PK)                                                  │
  │ email (UNIQUE)                                           │
  │ role                                                     │
  │                                                          │
  └──── created_by_user_id ─────────────────────────── users (self-ref)

aois ────────────────────────────────────────────────────────────┐
  │ id (PK)                                                       │
  │ name                                                          │
  │ geometry (PostGIS Polygon)                                    │
  │ state_code                                                    │
  │ district_name                                                 │
  │ priority                                                      │
  │ is_active                                                     │
  │ created_by (FK → users)                                       │
  │                                                               │
  └──── aoi_id ──────────── imagery_scenes                        │
  └──── aoi_id ──────────── analysis_runs                         │
  └──── aoi_id ──────────── alerts                                │

imagery_scenes ─────────────────────────────────────────────────┐
  │ id (PK)                                                       │
  │ aoi_id (FK → aois)                                           │
  │ satellite_source                                              │
  │ tile_id                                                       │
  │ acquisition_date                                              │
  │ cloud_cover_pct                                               │
  │ processing_level                                              │
  │ storage_path (object storage key)                             │
  │ footprint (PostGIS Polygon)                                   │
  │                                                               │
  └──── scene_id (baseline/target) ─── analysis_runs

boundary_datasets
  │ id (PK)
  │ name
  │ type (CONCESSION | PROTECTED_AREA)
  │ state_code
  │ validity_date
  │ is_active
  │ imported_by (FK → users)
  │
  └──── dataset_id ─────────────────── boundary_polygons

boundary_polygons
  │ id (PK)
  │ dataset_id (FK → boundary_datasets)
  │ name
  │ permit_number
  │ permit_status
  │ geometry (PostGIS MultiPolygon)
  │ max_disturbance_ha (nullable)

analysis_runs
  │ id (PK)
  │ aoi_id (FK → aois)
  │ baseline_scene_id (FK → imagery_scenes)
  │ target_scene_id (FK → imagery_scenes)
  │ status (QUEUED | RUNNING | COMPLETED | FAILED)
  │ sensitivity_level
  │ triggered_by (FK → users)
  │ started_at
  │ completed_at
  │ error_message (nullable)
  │
  └──── run_id ─────────────────────── change_zones
  └──── run_id ─────────────────────── alerts (via change_zones)

change_zones
  │ id (PK)
  │ run_id (FK → analysis_runs)
  │ change_type (VEGETATION_LOSS | BARE_EARTH | WATER_BODY | ACCESS_ROAD)
  │ geometry (PostGIS Polygon)
  │ area_sqm
  │ area_ha
  │ centroid (PostGIS Point)
  │ intersection_category
  │ dist_to_protected_area_m
  │ dist_to_water_body_m
  │ ndvi_delta
  │ is_flagged_evidence
  │ is_dismissed
  │ dismissal_reason (nullable)

alerts
  │ id (PK)
  │ aoi_id (FK → aois)
  │ primary_zone_id (FK → change_zones)
  │ run_id (FK → analysis_runs)
  │ severity_score
  │ intersection_category
  │ total_area_ha
  │ zone_count
  │ status (PENDING_REVIEW | UNDER_REVIEW | CONFIRMED_ILLEGAL | ...)
  │ is_duplicate (merged into parent_alert_id)
  │ parent_alert_id (FK → alerts, nullable)
  │ created_at
  │
  └──── alert_id ───────────────────── alert_status_log
  └──── alert_id ───────────────────── case_files
  └──── alert_id ───────────────────── notifications

alert_status_log   [APPEND-ONLY]
  │ id (PK)
  │ alert_id (FK → alerts)
  │ previous_status
  │ new_status
  │ changed_by (FK → users)
  │ justification_note (min 50 chars enforced by CHECK)
  │ created_at

case_files
  │ id (PK)
  │ reference_number (UNIQUE, format: CF-YYYY-XXXX)
  │ alert_id (FK → alerts)
  │ status (DRAFT | COMPLETE | EXPORTED)
  │ compiled_by (FK → users)
  │ analyst_notes
  │ recommendation
  │ recommendation_detail
  │ pdf_storage_path (nullable)
  │ geojson_storage_path (nullable)
  │ created_at
  │ updated_at
  │
  └──── case_file_id ───────────────── case_file_audit
  └──── case_file_id ───────────────── case_file_evidence_images

case_file_evidence_images
  │ id (PK)
  │ case_file_id (FK → case_files)
  │ scene_id (FK → imagery_scenes)
  │ caption
  │ display_order

case_file_audit   [APPEND-ONLY]
  │ id (PK)
  │ case_file_id (FK → case_files)
  │ action (VIEW | EDIT | EXPORT_PDF | EXPORT_GEOJSON | STATUS_CHANGE)
  │ performed_by (FK → users)
  │ created_at

notifications
  │ id (PK)
  │ user_id (FK → users)
  │ alert_id (FK → alerts, nullable)
  │ type (IN_PLATFORM | EMAIL)
  │ title
  │ body
  │ is_read
  │ sent_at

severity_config
  │ id (PK)
  │ factor_name
  │ weight_pct (sum of all active records must equal 100)
  │ updated_by (FK → users)
  │ updated_at

ingestion_log   [APPEND-ONLY]
  │ id (PK)
  │ aoi_id (FK → aois)
  │ scene_id (FK → imagery_scenes, nullable — null if ingestion failed)
  │ satellite_source
  │ tile_id
  │ acquisition_date
  │ cloud_cover_pct
  │ status (SUCCESS | FAILED | SKIPPED_CLOUD_COVER)
  │ error_message (nullable)
  │ ingested_at
```

### 4.3 PostGIS Spatial Functions in Use

| Operation | PostGIS Function | Usage |
|---|---|---|
| Concession intersection check | `ST_Intersects(geom_a, geom_b)` | FR-010: classify change zones |
| Distance to protected area | `ST_Distance(geom_a::geography, geom_b::geography)` | FR-011 severity factor (c) |
| Distance to water body | `ST_Distance(geom_a::geography, geom_b::geography)` | FR-011 severity factor (d) |
| Change zone area | `ST_Area(geom::geography)` | FR-008: area in m² |
| Zone centroid | `ST_Centroid(geom)` | Alert coordinate generation |
| AOI boundary check | `ST_Within(geom_a, geom_b)` | Full containment within concession |
| Deduplication overlap | `ST_Intersects + ST_Area(ST_Intersection(...))` | FR-017: overlap ratio |
| Spatial index query | `WHERE geom && ST_MakeEnvelope(...)` | All spatial filter queries |
| Buffer for proximity | `ST_Buffer(geom::geography, distance_m)` | Protected area adjacency check |

### 4.4 Indexing Strategy

```sql
-- Primary spatial indexes (GiST — required for PostGIS)
CREATE INDEX idx_aois_geometry ON aois USING GIST (geometry);
CREATE INDEX idx_change_zones_geometry ON change_zones USING GIST (geometry);
CREATE INDEX idx_boundary_polygons_geometry ON boundary_polygons USING GIST (geometry);
CREATE INDEX idx_imagery_scenes_footprint ON imagery_scenes USING GIST (footprint);

-- Standard B-tree indexes for frequent filter columns
CREATE INDEX idx_alerts_status ON alerts (status);
CREATE INDEX idx_alerts_aoi_id ON alerts (aoi_id);
CREATE INDEX idx_alerts_severity_score ON alerts (severity_score DESC);
CREATE INDEX idx_alerts_created_at ON alerts (created_at DESC);
CREATE INDEX idx_imagery_scenes_aoi_acquisition ON imagery_scenes (aoi_id, acquisition_date DESC);
CREATE INDEX idx_analysis_runs_aoi_id ON analysis_runs (aoi_id);
CREATE INDEX idx_analysis_runs_status ON analysis_runs (status);
CREATE INDEX idx_change_zones_run_id ON change_zones (run_id);
CREATE INDEX idx_alert_status_log_alert_id ON alert_status_log (alert_id);
CREATE INDEX idx_case_file_audit_case_file_id ON case_file_audit (case_file_id);
CREATE INDEX idx_notifications_user_unread ON notifications (user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_ingestion_log_aoi_date ON ingestion_log (aoi_id, ingested_at DESC);

-- Partial index for active boundary datasets
CREATE INDEX idx_boundary_polygons_active_dataset ON boundary_polygons (dataset_id)
  WHERE dataset_id IN (SELECT id FROM boundary_datasets WHERE is_active = true);
```

### 4.5 Database Migrations

Migrations are numbered sequentially: `0001_initial_schema.sql`, `0002_add_severity_config.sql`, etc. They are run via a migration runner script on deployment. Migrations are never modified after being applied to production — only new migrations are added.

---

## SECTION 5 — API Contract

All endpoints are prefixed with `/api/v1`. All responses are JSON. All authenticated endpoints require `Authorization: Bearer <jwt_token>` header. All datetime values are ISO 8601 UTC strings.

**Standard Error Response Shape:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": [ { "field": "name", "message": "Required" } ]
  }
}
```

**Standard Pagination Shape (for list endpoints):**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 143,
    "totalPages": 8
  }
}
```

---

### 5.1 Authentication Domain

**POST /api/v1/auth/login**
- Purpose: Authenticate a user and return a JWT.
- Request: `{ "email": string, "password": string }`
- Response: `{ "token": string, "user": { "id", "email", "role", "name", "organization" } }`
- Validation: email format valid; both fields required.
- Errors: `401 INVALID_CREDENTIALS`, `429 RATE_LIMITED` (max 10 attempts/15 min per IP)

**POST /api/v1/auth/logout**
- Purpose: Invalidate the current session token.
- Request: (none; token in Authorization header)
- Response: `{ "success": true }`
- Errors: `401 UNAUTHORIZED`

**GET /api/v1/auth/me**
- Purpose: Return authenticated user profile.
- Response: `{ "id", "email", "role", "name", "organization", "notificationThreshold", "lastLoginAt" }`
- Errors: `401 UNAUTHORIZED`

**PATCH /api/v1/auth/me**
- Purpose: Update notification threshold preference.
- Request: `{ "notificationThreshold": number (1–100) }`
- Response: Updated user object.
- Errors: `400 VALIDATION_ERROR`

---

### 5.2 AOI Domain

**GET /api/v1/aois**
- Purpose: List all AOIs (filtered by role scope).
- Query params: `?stateCode=OD&districtName=Sundargarh&isActive=true&page=1&pageSize=20`
- Response: Paginated list of AOI objects including GeoJSON geometry.
- Auth: All roles.

**POST /api/v1/aois**
- Purpose: Create a new AOI.
- Auth: System Administrator only.
- Request:
```json
{
  "name": "Sundargarh Forest Zone North",
  "geometry": { "type": "Polygon", "coordinates": [[...]] },
  "stateCode": "OD",
  "districtName": "Sundargarh",
  "priority": "HIGH"
}
```
- Response: Created AOI object with `id`.
- Validation: `geometry` must be a valid GeoJSON Polygon in WGS84; `name` required (max 100 chars); `priority` must be `HIGH | MEDIUM | LOW`; polygon must have minimum 3 vertices.
- Errors: `400 VALIDATION_ERROR`, `403 FORBIDDEN`, `409 DUPLICATE_AOI_NAME`

**GET /api/v1/aois/:id**
- Purpose: Get single AOI with full metadata.
- Response: Full AOI object including geometry, statistics (alert count, last analysis date, imagery count).

**PATCH /api/v1/aois/:id**
- Purpose: Update AOI name, priority, or active status.
- Auth: System Administrator only.
- Request: Partial update of `name`, `priority`, `isActive`.
- Errors: `404 NOT_FOUND`, `403 FORBIDDEN`

**DELETE /api/v1/aois/:id**
- Purpose: Soft-delete (deactivate) an AOI. Never hard-deletes.
- Auth: System Administrator only.
- Response: `{ "success": true }`
- Errors: `404 NOT_FOUND`, `403 FORBIDDEN`, `409 CONFLICT` (if AOI has pending analyses)

---

### 5.3 Imagery Domain

**GET /api/v1/aois/:aoiId/scenes**
- Purpose: List all imagery scenes for an AOI, optionally filtered by date range and cloud cover.
- Query params: `?from=2024-01-01&to=2025-12-31&maxCloudCover=30&satellite=SENTINEL2`
- Response: Paginated list of scene objects: `{ id, satelliteSource, tileId, acquisitionDate, cloudCoverPct, processingLevel, storagePath, footprint }`
- Auth: Analyst, Director.

**POST /api/v1/aois/:aoiId/scenes/trigger-sync**
- Purpose: Manually trigger an imagery sync for an AOI from Copernicus Hub.
- Auth: System Administrator only.
- Response: `{ "jobId": string, "status": "QUEUED" }`
- Errors: `429 SYNC_ALREADY_IN_PROGRESS`

**GET /api/v1/scenes/:id/tile-url**
- Purpose: Return a signed temporary URL for accessing the raw imagery tile in object storage.
- Auth: Analyst, Director.
- Response: `{ "url": string, "expiresAt": string }`

---

### 5.4 Boundary Domain

**GET /api/v1/boundaries/datasets**
- Purpose: List all boundary datasets with staleness status.
- Auth: All authenticated.
- Response: List of `{ id, name, type, stateCode, validityDate, isActive, isStale, importedAt, importedBy }`

**POST /api/v1/boundaries/datasets**
- Purpose: Import a new boundary dataset.
- Auth: System Administrator only.
- Request: `multipart/form-data` with fields: `name`, `type` (CONCESSION | PROTECTED_AREA), `stateCode`, `validityDate`, and file upload (GeoJSON, KML, or Shapefile zip).
- Response: `{ "datasetId": string, "polygonCount": number, "status": "PROCESSING" }`
- Validation: file format validated; `validityDate` must be a valid date; `type` required.
- Errors: `400 INVALID_FILE_FORMAT`, `400 VALIDATION_ERROR`

**GET /api/v1/boundaries/datasets/:id/diff**
- Purpose: Return a diff comparison between a new (pending) dataset and the currently active one.
- Auth: System Administrator only.
- Response: `{ "added": [polygons], "removed": [polygons], "modified": [polygons], "unchanged": number }`

**POST /api/v1/boundaries/datasets/:id/activate**
- Purpose: Activate a pending dataset, superseding the current active one.
- Auth: System Administrator only.
- Response: Updated dataset object.

**GET /api/v1/boundaries/polygons**
- Purpose: Return boundary polygons intersecting a bounding box (for map rendering).
- Query params: `?bbox=minLon,minLat,maxLon,maxLat&type=CONCESSION&stateCode=OD`
- Response: GeoJSON FeatureCollection of polygons within the bbox.
- Auth: All authenticated.

---

### 5.5 Analysis Domain

**POST /api/v1/aois/:aoiId/analyses**
- Purpose: Dispatch a new change detection analysis run.
- Auth: Analyst, System Administrator.
- Request:
```json
{
  "baselineSceneId": "uuid",
  "targetSceneId": "uuid",
  "sensitivityLevel": "STANDARD | HIGH"
}
```
- Response: `{ "runId": string, "status": "QUEUED", "estimatedDurationSeconds": number }`
- Validation: Both scene IDs must belong to the specified AOI; scenes must not be the same; target must be chronologically after baseline.
- Errors: `400 VALIDATION_ERROR`, `409 ANALYSIS_ALREADY_RUNNING`

**GET /api/v1/analyses/:runId**
- Purpose: Poll analysis run status and retrieve results when complete.
- Response:
```json
{
  "id": "uuid",
  "status": "QUEUED | RUNNING | COMPLETED | FAILED",
  "progressPct": 68,
  "currentPhase": "SCENE_COMPARISON",
  "changeZones": [...],       // populated when status = COMPLETED
  "alertGenerated": { "id": "uuid" },
  "errorMessage": null
}
```

**GET /api/v1/aois/:aoiId/analyses**
- Purpose: List all analysis runs for an AOI.
- Response: Paginated list of run summaries.
- Auth: Analyst, Director.

**PATCH /api/v1/analyses/:runId/zones/:zoneId**
- Purpose: Flag a zone as evidence or dismiss it as false positive.
- Auth: Analyst.
- Request: `{ "action": "FLAG | DISMISS", "dismissalReason": string (required if DISMISS, min 20 chars) }`
- Response: Updated zone object.
- Errors: `404 NOT_FOUND`, `400 VALIDATION_ERROR`

---

### 5.6 Alert Domain

**GET /api/v1/alerts**
- Purpose: List alerts for the triage queue.
- Query params: `?status=PENDING_REVIEW&severityMin=70&intersectionCategory=PROTECTED_AREA_INCURSION&aoiId=uuid&from=2025-01-01&page=1&pageSize=20&sortBy=severity_score&sortDir=desc`
- Response: Paginated alert list with full metadata.
- Auth: All roles (field ranger sees only alerts assigned to their state).

**GET /api/v1/alerts/:id**
- Purpose: Get full alert detail including all change zones and status history.
- Response: Alert object with nested `changeZones`, `statusLog`, `aoi`, `analysisRun`.

**PATCH /api/v1/alerts/:id/status**
- Purpose: Update alert status (triage action).
- Auth: Analyst, System Administrator.
- Request: `{ "status": "UNDER_REVIEW | CONFIRMED_ILLEGAL | CONFIRMED_LEGAL | FALSE_POSITIVE_NATURAL | FALSE_POSITIVE_DATA_ERROR | ESCALATED_TO_ENFORCEMENT", "justificationNote": string (min 50 chars) }`
- Response: Updated alert with new status log entry.
- Validation: Status transition must be valid per the allowed state machine. Justification note required and minimum 50 characters.
- Errors: `400 INVALID_STATUS_TRANSITION`, `400 JUSTIFICATION_TOO_SHORT`

**POST /api/v1/alerts/:id/merge**
- Purpose: Confirm deduplication merge of an alert into a parent alert.
- Auth: Analyst.
- Request: `{ "parentAlertId": "uuid" }`
- Response: Updated alert with `isDuplicate: true`.
- Errors: `404 NOT_FOUND`, `409 CANNOT_MERGE_INTO_SELF`

**GET /api/v1/alerts/:id/timeline**
- Purpose: Return all detection events at the same geographic location across all analyses.
- Response: Array of `{ runId, acquisitionDate, changeArea, severityScore }` ordered chronologically.

---

### 5.7 Case File Domain

**POST /api/v1/case-files**
- Purpose: Create a new (draft) case file linked to an alert.
- Auth: Analyst.
- Request: `{ "alertId": "uuid" }`
- Response: Created case file object with auto-populated sections and reference number.
- Validation: Alert must be in `CONFIRMED_ILLEGAL` or `ESCALATED_TO_ENFORCEMENT` status.
- Errors: `400 INVALID_ALERT_STATUS`, `409 CASE_FILE_ALREADY_EXISTS`

**GET /api/v1/case-files**
- Purpose: List case files.
- Query params: `?status=DRAFT&analystId=uuid&page=1&pageSize=20`
- Auth: Analyst (own files + shared), Director (all).

**GET /api/v1/case-files/:id**
- Purpose: Get full case file with all sections, evidence images, and audit trail.
- Auth: Analyst, Director.
- Side effect: Records a `VIEW` entry in `case_file_audit`.

**PATCH /api/v1/case-files/:id**
- Purpose: Update case file draft (analyst notes, recommendation, evidence selection).
- Auth: Analyst (must be compiler of the case file).
- Request: Partial update of `analystNotes`, `recommendation`, `recommendationDetail`, `evidenceImageIds` (ordered array of scene IDs).
- Validation: `analystNotes` minimum 100 characters if provided; `evidenceImageIds` must include at minimum 2 entries.

**POST /api/v1/case-files/:id/export**
- Purpose: Initiate PDF and/or GeoJSON export.
- Auth: Analyst.
- Request: `{ "formats": ["PDF", "GEOJSON"] }`
- Response: `{ "jobId": string, "status": "QUEUED" }` — export is async.
- Errors: `400 MISSING_REQUIRED_FIELDS` (if case file is incomplete)

**GET /api/v1/case-files/:id/export/:jobId**
- Purpose: Poll export job status and get download URL when ready.
- Response: `{ "status": "QUEUED | GENERATING | READY | FAILED", "pdfUrl": string|null, "geojsonUrl": string|null }`

**GET /api/v1/case-files/:id/audit**
- Purpose: Return the full immutable audit trail for a case file.
- Auth: Analyst, Director, System Administrator.
- Response: Chronological array of audit entries.

---

### 5.8 Dashboard Domain

**GET /api/v1/dashboard/summary**
- Purpose: Aggregate metrics for the Operational Dashboard.
- Auth: Director, System Administrator.
- Query params: `?from=2025-01-01&to=2025-12-31&stateCode=OD&intersectionCategory=PROTECTED_AREA_INCURSION`
- Response:
```json
{
  "totalActiveAlerts": 47,
  "alertsByCategory": { "PROTECTED_AREA_INCURSION": 12, "CONCESSION_VIOLATION": 18, ... },
  "confirmedIllegalCount": 23,
  "totalDeforestationHa": 4821.3,
  "alertOutcomeBreakdown": { "confirmed": 23, "legalActivity": 8, "falsePositive": 12, "pending": 4 },
  "alertTrend": [ { "date": "2025-01", "count": 5 }, ... ],
  "deforestationTrend": [ { "date": "2025-01", "ha": 312.4 }, ... ]
}
```

**GET /api/v1/dashboard/aoi-heatmap**
- Purpose: Return alert intensity data per AOI for heat map rendering.
- Auth: Director, System Administrator.
- Response: Array of `{ aoiId, centroid, alertCount, highestSeverityScore, totalChangeHa }`

---

### 5.9 Admin Domain

**GET /api/v1/admin/users**
- Purpose: List all users.
- Auth: System Administrator only.
- Response: Paginated user list (no password hashes).

**POST /api/v1/admin/users**
- Purpose: Create a new user and send invitation email.
- Auth: System Administrator only.
- Request: `{ "email": string, "name": string, "organization": string, "role": "FIELD_RANGER | ANALYST | DIRECTOR | ADMIN" }`
- Errors: `409 EMAIL_ALREADY_EXISTS`, `400 VALIDATION_ERROR`

**PATCH /api/v1/admin/users/:id**
- Purpose: Update user role or deactivate user.
- Auth: System Administrator only.
- Request: `{ "role": string?, "isActive": boolean? }`
- Errors: `400 CANNOT_DEACTIVATE_SELF`

**GET /api/v1/admin/severity-config**
- Purpose: Get current severity scoring factor weights.
- Auth: System Administrator only.
- Response: Array of `{ factorName, weightPct, updatedAt, updatedBy }`

**PUT /api/v1/admin/severity-config**
- Purpose: Update severity score factor weights.
- Auth: System Administrator only.
- Request: Array of `{ factorName, weightPct }` — must sum to 100.
- Validation: Total of all `weightPct` values must equal exactly 100.
- Errors: `400 WEIGHTS_DO_NOT_SUM_TO_100`

---

### 5.10 Notification Domain

**GET /api/v1/notifications**
- Purpose: Get unread in-platform notifications for the authenticated user.
- Query params: `?isRead=false&page=1&pageSize=20`
- Response: Paginated notification list.

**PATCH /api/v1/notifications/:id/read**
- Purpose: Mark a notification as read.
- Response: `{ "success": true }`

**PATCH /api/v1/notifications/read-all**
- Purpose: Mark all notifications for the user as read.
- Response: `{ "count": number }`

---

### 5.11 WebSocket Events

The WebSocket connection is established at `wss://{host}/ws` with the JWT in the `Authorization` query parameter.

**Server → Client events:**

| Event Name | Payload | Description |
|---|---|---|
| `analysis:progress` | `{ runId, progressPct, currentPhase }` | Analysis job progress updates |
| `analysis:complete` | `{ runId, alertId, zoneCount, severityScore }` | Analysis finished, alert generated |
| `analysis:failed` | `{ runId, errorMessage }` | Analysis job failed |
| `alert:new` | `{ alertId, aoiId, severityScore, intersectionCategory }` | New alert generated |
| `notification:new` | `{ notificationId, title, body }` | New in-platform notification |
| `export:ready` | `{ jobId, caseFileId, pdfUrl, geojsonUrl }` | Export job completed |

---

## SECTION 6 — Frontend Architecture

### 6.1 Directory Structure (`apps/web/`)

```
apps/web/
├── app/                            # Next.js App Router
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (mission)/
│   │   ├── layout.tsx              # Mission Control shell layout
│   │   ├── page.tsx                # Mission Control home (SCR-02)
│   │   ├── aois/
│   │   │   ├── page.tsx            # AOI Management (SCR-17)
│   │   │   └── [id]/page.tsx
│   │   ├── alerts/
│   │   │   ├── page.tsx            # Alert Queue (SCR-13)
│   │   │   └── [id]/page.tsx
│   │   ├── cases/
│   │   │   ├── page.tsx            # Case File Archive (SCR-14)
│   │   │   └── [id]/page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Operational Dashboard (SCR-15)
│   │   └── admin/
│   │       ├── users/page.tsx      # User Management (SCR-16)
│   │       ├── boundaries/page.tsx # Boundary Dataset Management (SCR-18)
│   │       └── settings/page.tsx   # Settings (SCR-19)
│   ├── globals.css
│   └── layout.tsx                  # Root layout (fonts, providers)
│
├── components/
│   ├── cesium/                     # All CesiumJS-related components
│   │   ├── GlobeViewer.tsx         # Root Cesium viewer wrapper
│   │   ├── CameraController.tsx    # Camera transition logic
│   │   ├── AoiLayer.tsx            # AOI polygon entities
│   │   ├── AlertLayer.tsx          # Alert marker entities
│   │   ├── BoundaryLayer.tsx       # Concession/Protected area overlays
│   │   ├── ChangeZoneLayer.tsx     # Detection result overlays
│   │   ├── AoiDrawingMode.tsx      # Interactive vertex placement
│   │   ├── ImageryLayer.tsx        # Satellite imagery tile provider
│   │   └── TerrainProvider.tsx     # DEM terrain configuration
│   │
│   ├── panels/                     # Mission Control panel components
│   │   ├── LeftCommandPanel.tsx
│   │   ├── RightIntelligencePanel.tsx
│   │   ├── TopMissionBar.tsx
│   │   ├── BottomNavStrip.tsx
│   │   ├── ImageryConfigPanel.tsx
│   │   ├── AnalysisConfigPanel.tsx
│   │   ├── ResultsPanel.tsx
│   │   ├── TimelinePanel.tsx
│   │   └── ReportAssemblyPanel.tsx
│   │
│   ├── ui/                         # Atomic design system components
│   │   ├── GlassCard.tsx
│   │   ├── SeverityRing.tsx
│   │   ├── AlertChip.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── BandSelector.tsx
│   │   ├── CoordinateDisplay.tsx
│   │   ├── ProgressScan.tsx
│   │   ├── TimelineScrubber.tsx
│   │   ├── ChangeAreaSparkline.tsx
│   │   ├── DataField.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorState.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── forms/                      # Form components
│   │   ├── AoiConfirmationForm.tsx
│   │   ├── AlertStatusForm.tsx
│   │   ├── ReportSectionForm.tsx
│   │   └── UserCreateForm.tsx
│   │
│   └── layout/                     # Shell layout components
│       ├── SplashScreen.tsx
│       ├── MissionControlShell.tsx
│       └── AuthGuard.tsx
│
├── stores/                         # Zustand state stores
│   ├── useGlobeStore.ts            # Camera position, zoom level, active state
│   ├── useAoiStore.ts              # Selected AOI, drawing mode, vertex list
│   ├── useImageryStore.ts          # Selected scenes, band composite
│   ├── useAnalysisStore.ts         # Active run, progress, results
│   ├── useAlertStore.ts            # Alert queue filters, selected alert
│   ├── useTimelineStore.ts         # Baseline/target scenes, compare mode
│   ├── useReportStore.ts           # Report assembly state
│   └── useAuthStore.ts             # Authenticated user, role
│
├── hooks/                          # Custom React hooks
│   ├── useCameraTransition.ts      # Cesium camera choreography
│   ├── useAoiDrawing.ts            # Vertex placement state machine
│   ├── useAnalysisProgress.ts      # WebSocket analysis progress subscription
│   ├── useAlertNotifications.ts    # WebSocket alert notification subscription
│   ├── useSpatialHierarchy.ts      # Current level in Globe→India→State→District→AOI
│   └── useKeyboardNavigation.ts    # Global keyboard shortcut handling
│
├── lib/                            # Utilities and API client
│   ├── api/
│   │   ├── client.ts               # Axios instance with auth interceptors
│   │   ├── aoi.ts                  # AOI API call functions
│   │   ├── imagery.ts
│   │   ├── analysis.ts
│   │   ├── alerts.ts
│   │   ├── cases.ts
│   │   ├── dashboard.ts
│   │   └── admin.ts
│   ├── cesium/
│   │   ├── cameraEasing.ts         # Custom camera easing curves
│   │   ├── terrainConfig.ts        # Cesium terrain provider setup
│   │   ├── imageryProviders.ts     # Tile imagery provider configuration
│   │   └── entityFactories.ts      # Factory functions for Cesium Entity creation
│   ├── colors.ts                   # Design system color tokens as JS constants
│   ├── typography.ts               # Type scale constants
│   └── websocket.ts                # Socket.IO client singleton
│
├── types/                          # Local type extensions (extends shared-types)
├── public/
│   ├── cesium/                     # CesiumJS static assets (workers, assets)
│   └── fonts/                      # Orbitron, Inter, JetBrains Mono woff2 files
│
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 6.2 State Management Architecture

SAT-MSS uses **Zustand** for client-side global state and **TanStack Query** for server-synchronized state. The division is strict:

| Concern | Tool | Rationale |
|---|---|---|
| Camera position, zoom level, active spatial level | Zustand (`useGlobeStore`) | Pure UI state — not server data |
| AOI drawing mode, current vertices | Zustand (`useAoiStore`) | Ephemeral UI state |
| Analysis progress, current phase | Zustand (`useAnalysisStore`) | Populated by WebSocket events |
| Timeline scrubber position, compare mode | Zustand (`useTimelineStore`) | Pure UI state |
| Alert list, filters, selection | TanStack Query | Paginated server data |
| AOI list | TanStack Query | Server data with background refetch |
| Case file | TanStack Query | Server data, invalidated on mutation |
| Dashboard metrics | TanStack Query | Server data with 5-min stale time |

### 6.3 Routing

Next.js App Router is used. The route structure follows the screen inventory from PXD §30. All routes under `(mission)` are protected by `AuthGuard` — unauthenticated users are redirected to `/login`.

Route protection is role-based: the `AuthGuard` component checks the user's role (from `useAuthStore`) against the required roles for each route. Unauthorized role access returns a 403 page (not a redirect).

### 6.4 Cesium Integration Architecture

CesiumJS is integrated via the **Resium** library. The root `GlobeViewer` component initializes the Cesium Viewer instance and provides it via React Context to all child components.

**Critical integration notes:**
- The Cesium `Viewer` is initialized once and never remounted. React re-renders update Cesium entities declaratively via Resium props.
- The `CameraController` component listens to `useGlobeStore` and translates state changes into Cesium camera `flyTo` calls with the choreographed easing curves from PXD §6.
- `ImageryLayer` uses a Cesium `UrlTemplateImageryProvider` pointed at the signed tile URLs from the imagery API.
- `AoiDrawingMode` intercepts Cesium's native click handler, translates screen coordinates to Cartographic (lat/lon), and updates the vertex list in `useAoiStore`.
- All detection zone polygons in `ChangeZoneLayer` are rendered as Cesium `Polygon` entities with terrain-clamped positions (`heightReference: CLAMP_TO_GROUND`).

### 6.5 Component Hierarchy

```
RootLayout
└── AuthGuard
    ├── LoginPage
    └── MissionControlShell
        ├── SplashScreen (renders until app ready, then fades)
        ├── TopMissionBar
        │   ├── BreadcrumbTrail
        │   ├── MissionClock
        │   ├── NotificationBell
        │   └── UserAvatar
        │
        ├── GlobeViewer (Cesium)
        │   ├── TerrainProvider
        │   ├── ImageryLayer (base composite)
        │   ├── AoiLayer
        │   ├── AlertLayer
        │   ├── BoundaryLayer (concessions + protected areas)
        │   ├── ChangeZoneLayer (analysis results)
        │   ├── AoiDrawingMode (active when drawing)
        │   └── CameraController
        │
        ├── LeftCommandPanel (collapsible)
        │   ├── UserIdentityBadge
        │   ├── MissionBriefing
        │   ├── NavigationIcons
        │   └── SystemStatus
        │
        ├── RightIntelligencePanel (collapsible)
        │   ├── AlertFeed
        │   ├── CaseFileFeed
        │   └── DataStreamStatus
        │
        ├── [Conditional Panels — rendered via portal, right-edge anchor]
        │   ├── ImageryConfigPanel
        │   ├── AnalysisConfigPanel
        │   ├── ResultsPanel
        │   └── ReportAssemblyPanel
        │
        ├── TimelinePanel (bottom-anchor, conditional)
        │
        └── BottomNavStrip
            ├── BreadcrumbTrail
            └── KeyboardHints
```

---

## SECTION 7 — Backend Architecture

### 7.1 Directory Structure (`apps/api/`)

```
apps/api/
├── src/
│   ├── index.ts                    # Entry point — creates Express app, starts server
│   ├── app.ts                      # Express app factory (middleware, routes, error handler)
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.router.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.middleware.ts  # JWT verification, RBAC guards
│   │   ├── aoi/
│   │   │   ├── aoi.router.ts
│   │   │   ├── aoi.service.ts
│   │   │   └── aoi.controller.ts
│   │   ├── imagery/
│   │   │   ├── imagery.router.ts
│   │   │   ├── imagery.service.ts
│   │   │   └── imagery.controller.ts
│   │   ├── boundaries/
│   │   ├── analysis/
│   │   │   ├── analysis.router.ts
│   │   │   ├── analysis.service.ts     # Dispatches jobs to GSE
│   │   │   ├── analysis.controller.ts
│   │   │   └── analysis.processor.ts  # Bull queue job handlers
│   │   ├── alerts/
│   │   ├── cases/
│   │   │   ├── cases.router.ts
│   │   │   ├── cases.service.ts
│   │   │   ├── cases.controller.ts
│   │   │   └── pdf-generator.ts        # Puppeteer PDF generation
│   │   ├── reports/
│   │   ├── admin/
│   │   └── notifications/
│   │
│   ├── db/
│   │   ├── client.ts               # Drizzle + pg pool singleton
│   │   ├── schema/                 # Drizzle table definitions (one file per table)
│   │   │   ├── users.ts
│   │   │   ├── aois.ts
│   │   │   ├── imagery-scenes.ts
│   │   │   └── ... (one per table)
│   │   └── queries/                # Shared complex query functions
│   │       ├── spatial.queries.ts  # PostGIS spatial query builders
│   │       └── aggregation.queries.ts
│   │
│   ├── jobs/                       # Bull queue definitions
│   │   ├── queues.ts               # Queue instances (analysis, pdf, email, imagery-sync)
│   │   └── workers/
│   │       ├── analysis.worker.ts  # Triggers GSE, polls results
│   │       ├── pdf.worker.ts       # Puppeteer PDF generation
│   │       ├── email.worker.ts     # Nodemailer dispatch
│   │       └── imagery-sync.worker.ts
│   │
│   ├── websocket/
│   │   ├── socket.ts               # Socket.IO server setup
│   │   └── events.ts               # Event emission utilities
│   │
│   ├── middleware/
│   │   ├── authenticate.ts         # JWT extraction and verification
│   │   ├── authorize.ts            # Role-based access control guard factory
│   │   ├── validate.ts             # Zod schema validation middleware
│   │   ├── rateLimiter.ts          # Express rate limiter
│   │   └── requestLogger.ts        # Winston request logging
│   │
│   ├── lib/
│   │   ├── storage.ts              # MinIO/S3 client wrapper
│   │   ├── gse-client.ts           # HTTP client for GSE internal API
│   │   └── audit.ts                # Audit log write utilities
│   │
│   └── types/
│       └── express.d.ts            # Augmented Express Request type (user, role)
│
├── tsconfig.json
└── package.json
```

### 7.2 Request Processing Pipeline

```
Incoming Request
     │
     ▼
Nginx (TLS termination, rate limit at infra level)
     │
     ▼
Express App
     │
     ├── requestLogger middleware (correlation ID assigned)
     ├── cors middleware
     ├── helmet middleware (security headers)
     ├── body parser (JSON, multipart for file uploads)
     ├── rateLimiter middleware (per-route limits)
     │
     ▼
Route Handler
     │
     ├── authenticate middleware (JWT verification → req.user)
     ├── authorize middleware (RBAC role check)
     ├── validate middleware (Zod schema validation of body/params/query)
     │
     ▼
Controller (thin — delegates immediately to Service)
     │
     ▼
Service (business logic, database calls via Drizzle)
     │
     ▼
Response (standardized shape)
     │
     ├── Global error handler (catches unhandled errors, formats error response)
     └── Winston logs final status
```

### 7.3 Background Job Architecture

Four Bull queues handle all asynchronous workloads:

**Queue 1: `analysis-jobs`**
- Priority queue (HIGH/MEDIUM/LOW per AOI priority).
- Job: `{ aoiId, runId, baselineSceneId, targetSceneId, sensitivityLevel }`
- Worker: calls GSE `/internal/analyse` endpoint, streams progress updates via Socket.IO to connected clients.
- On complete: writes change zones to DB, calculates severity, generates alert, dispatches email notification job.
- Retry: up to 2 retries. On final failure: marks `analysis_runs.status = FAILED`, notifies analyst.

**Queue 2: `pdf-export-jobs`**
- Job: `{ caseFileId, userId }`
- Worker: renders the PDF report template in headless Puppeteer, uploads to object storage, writes `case_files.pdf_storage_path`, emits `export:ready` WebSocket event.
- Timeout: 120 seconds per job.

**Queue 3: `email-notification-jobs`**
- Job: `{ userId, templateName, templateData }`
- Worker: Nodemailer sends via configured SMTP.
- Retry: up to 3 retries with exponential backoff.

**Queue 4: `imagery-sync-jobs`**
- Scheduled via Bull cron: runs every 12 hours.
- For each active AOI: queries Copernicus Hub for new scenes within the AOI footprint and cloud cover tolerance, downloads metadata, triggers imagery download to object storage.
- Large scenes (Sentinel-2 full tile at 110MB) are downloaded in streaming fashion to object storage without loading fully into memory.

### 7.4 PDF Report Generation

The Puppeteer-based PDF generator renders an HTML template (`pdf.template.html`) with the case file data. The process:

1. Puppeteer launches a headless Chromium instance.
2. The template is loaded with case file data injected as a JSON blob in a `<script>` tag.
3. Evidence imagery is fetched from object storage and embedded as base64 data URIs (avoids network requests in the headless context).
4. Puppeteer navigates to the rendered HTML, waits for all images to load (`networkidle0`).
5. PDF is printed with A4 format, 10mm margins, and print CSS applied.
6. PDF buffer is streamed to MinIO object storage.
7. A signed download URL is generated and returned to the API.

---

## SECTION 8 — Geospatial Engine

### 8.1 Directory Structure (`services/gse/`)

```
services/gse/
├── app/
│   ├── main.py                     # FastAPI application entry point
│   ├── routers/
│   │   ├── analyse.py              # POST /internal/analyse — dispatch analysis
│   │   ├── health.py               # GET /health
│   │   └── ingest.py               # POST /internal/ingest — trigger imagery download
│   │
│   ├── pipelines/
│   │   ├── ingestion/
│   │   │   ├── copernicus_client.py    # sentinelsat wrapper
│   │   │   ├── scene_downloader.py     # Streaming download to object storage
│   │   │   └── metadata_extractor.py  # Extract band/footprint metadata
│   │   │
│   │   ├── analysis/
│   │   │   ├── pipeline.py             # Orchestrates all analysis steps
│   │   │   ├── scene_loader.py         # Load scenes from object storage as NumPy arrays
│   │   │   ├── preprocessor.py         # Radiometric normalization, cloud masking
│   │   │   ├── ndvi_calculator.py      # NDVI calculation from band arrays
│   │   │   ├── change_detector.py      # Delta computation, threshold masking
│   │   │   ├── zone_extractor.py       # Connected components → individual zones
│   │   │   ├── zone_classifier.py      # Classify zone type (vegetation/bare/water/road)
│   │   │   └── severity_scorer.py      # Weighted severity score calculation
│   │   │
│   │   └── intersection/
│   │       └── boundary_intersector.py # PostGIS-based intersection classification
│   │
│   ├── tasks/
│   │   └── celery_app.py           # Celery application and task definitions
│   │
│   ├── db/
│   │   └── connection.py           # SQLAlchemy connection to PostgreSQL + PostGIS
│   │
│   ├── storage/
│   │   └── object_client.py        # boto3 wrapper for MinIO/S3
│   │
│   └── models/
│       ├── analysis_request.py     # Pydantic models for internal API
│       └── zone_result.py
│
├── requirements.txt
├── Dockerfile
└── pyproject.toml
```

### 8.2 AOI Workflow

```
Admin registers AOI (via Node.js API)
     │
     ▼  DB write: aois table
     │
     ▼
Imagery Sync Job triggers (every 12h)
     │
     ▼
copernicus_client.py queries Copernicus Open Access Hub
  → Search: product=Sentinel-2A, footprint=AOI polygon (WKT), cloudcover≤30
  → Search: product=Sentinel-1 IW, footprint=AOI polygon
     │
     ▼
scene_downloader.py streams .SAFE packages to MinIO
  → Storage key: imagery/{aoi_id}/{satellite}/{tile_id}/{acquisition_date}/
     │
     ▼
metadata_extractor.py reads scene metadata
  → Extracts: cloud cover, footprint polygon, band availability, processing level
     │
     ▼
DB write: imagery_scenes + ingestion_log tables
     │
     ▼
Node.js API receives ingestion_log update, notifies analyst if new scene available
```

### 8.3 Imagery Workflow (Analysis Pre-processing)

```
Analyst selects baseline and target scenes → POST /api/v1/aois/:id/analyses
     │
     ▼
analysis.service.ts creates analysis_runs record (status=QUEUED)
analysis.service.ts enqueues Bull job
     │
     ▼
analysis.worker.ts dequeues job → calls GSE POST /internal/analyse
     │
     ▼
GSE pipeline.py begins execution:

  Phase 1: SCENE_LOAD (progress 0→15%)
  ─────────────────────────────────────
  scene_loader.py:
  → Downloads baseline and target .SAFE packages from MinIO
  → Reads relevant bands using Rasterio windowed reads
  → Clips to AOI bounding box (reduces processing to AOI extent only)
  → Loads Band 4 (Red), Band 8 (NIR), Band 11 (SWIR) for Sentinel-2
  → Resamples all bands to common 10m resolution (Band 11 is 20m native)
  → Returns NumPy arrays: shape (bands, rows, cols)
```

### 8.4 NDVI Pipeline

```
  Phase 1 continued: NDVI CALCULATION
  ─────────────────────────────────────
  ndvi_calculator.py:

  For each scene (baseline and target):
  → NDVI = (Band_NIR - Band_Red) / (Band_NIR + Band_Red)
  → Result: 2D float array, values -1.0 to +1.0
  → Healthy dense vegetation: NDVI ≥ 0.4
  → Sparse/degraded vegetation: NDVI 0.2–0.4
  → Bare soil / exposed earth: NDVI 0.0–0.2
  → Water bodies: NDVI < 0.0

  preprocessor.py (cloud masking):
  → Applies Sentinel-2 Scene Classification Layer (Band SCL) to mask clouds
  → Masked pixels are set to NaN and excluded from NDVI calculation
  → If > 15% of AOI extent is cloud-masked, processing halts with
    INSUFFICIENT_CLOUD_FREE_COVERAGE error

  Output: baseline_ndvi (2D array), target_ndvi (2D array)
```

### 8.5 Change Detection Pipeline

```
  Phase 2: CHANGE DETECTION (progress 15→85%)
  ──────────────────────────────────────────────
  change_detector.py:

  Step 1 — Delta NDVI computation:
  → delta_ndvi = baseline_ndvi - target_ndvi
  → Positive delta = vegetation loss (green → bare)
  → Negative delta = vegetation gain (unlikely in mining context, noted)

  Step 2 — Threshold masking:
  → STANDARD sensitivity: |delta_ndvi| ≥ 0.25 → flagged pixel
  → HIGH sensitivity: |delta_ndvi| ≥ 0.15 → flagged pixel
  → Binary mask produced: 1 = change, 0 = no change

  Step 3 — Morphological noise removal:
  → Erosion (kernel 3×3) removes isolated single pixels (noise, cloud shadows)
  → Dilation (kernel 3×3) restores boundary of genuine change zones
  → Minimum zone size: 1 hectare (100 Sentinel-2 10m pixels)
    Zones smaller than minimum are discarded

  Step 4 — SWIR composite check:
  → For pixels flagged as bare earth change:
    SWIR_ratio = (Band_SWIR_target - Band_SWIR_baseline) / Band_SWIR_baseline
    If SWIR_ratio > 0.3 → confirms bare soil exposure (mining spoil signature)
    If SWIR_ratio ≤ 0.3 → may indicate natural bare ground (river bank etc.)

  zone_extractor.py:

  Step 5 — Connected component labeling:
  → Scikit-image label() produces individual connected regions
  → Each region = one candidate change zone
  → Region properties extracted: area, centroid, bounding box, solidity

  zone_classifier.py:

  Step 6 — Zone type classification:
  → VEGETATION_LOSS: delta_ndvi ≥ 0.25, zone area > 1 ha
  → BARE_EARTH: VEGETATION_LOSS + SWIR_ratio > 0.3
  → WATER_BODY: target_ndvi < -0.1 AND baseline_ndvi > -0.1
    (new water body where open land was)
  → ACCESS_ROAD: zone shape elongation ratio > 8:1 AND width < 30m
    (long, thin linear clearings)

  Phase 3: CLASSIFICATION + SCORING (progress 85→100%)
  ────────────────────────────────────────────────────────
  boundary_intersector.py:
  → For each zone geometry (as WKT): execute PostGIS queries
    - ST_Intersects with active concession polygons → intersection category
    - ST_Distance to nearest protected area polygon
    - ST_Distance to nearest water body (from hydrology layer)
  → Returns intersection_category + proximity distances

  severity_scorer.py:
  → Loads current severity weights from severity_config table
  → Computes weighted score:
    score = Σ (factor_value_normalized × weight_pct)
    Final score clamped to [1, 100]
    PROTECTED_AREA_INCURSION zones: floor applied at 75 (BR-010)

  DB writes:
  → change_zones records (geometry stored as PostGIS Polygon)
  → analysis_runs.status = COMPLETED
  → Alert record generated if max zone severity ≥ threshold

  Deduplication check (post-write):
  → For the new alert's primary zone: check ST_Intersects with
    geometries of open alerts in same AOI within last 90 days
  → If overlap ratio > 60%: flag as potential duplicate
    → API sets alert.is_potential_duplicate = true
    → Analyst sees deduplication prompt on next triage session
```

---

## SECTION 9 — AI Module

### 9.1 AI Module Philosophy

The SAT-MSS MVP uses **classical remote sensing signal processing** (NDVI thresholding, morphological filtering, SWIR band ratios) for change detection — not trained machine learning models. This is a deliberate decision:

**Rationale:**
- Classical methods are fully explainable and auditable — a forensic evidence system cannot use a black-box model without explainability.
- NDVI-based change detection on Sentinel-2 imagery is a well-validated, peer-reviewed methodology used by organizations including FAO, ISRO, and Global Forest Watch.
- Training data for illegal mining detection in India is sparse and unverified. A poorly trained model introduces systematic false positives that would undermine the legal credibility of case files.

The AI module is **architecturally isolated** in V1 — it defines the interface but uses classical algorithms internally. In V2, the classical algorithm can be replaced by a trained model without any API contract changes.

### 9.2 AI Module Interface

**Input schema (what the AI module receives):**

```
AnalysisInput {
  aoi_geometry: GeoJSON Polygon (WGS84)
  baseline_scene_path: str   # Object storage path to .SAFE package
  target_scene_path: str     # Object storage path to .SAFE package
  sensitivity_level: "STANDARD" | "HIGH"
  severity_weights: Dict[str, float]  # Factor name → weight (sums to 1.0)
  active_boundary_datasets: List[int]  # Dataset IDs for intersection
}
```

**Output schema (what the AI module produces):**

```
AnalysisOutput {
  zones: List[ZoneResult]
  processing_metadata: {
    baseline_cloud_cover_pct: float
    target_cloud_cover_pct: float
    effective_aoi_coverage_pct: float  # % of AOI that was cloud-free and analyzed
    ndvi_baseline_mean: float
    ndvi_target_mean: float
    processing_duration_seconds: float
  }
  error: Optional[str]  # Non-null only if processing halted before completion
}

ZoneResult {
  geometry: GeoJSON Polygon (WGS84)
  area_sqm: float
  area_ha: float
  centroid: GeoJSON Point
  change_type: "VEGETATION_LOSS" | "BARE_EARTH" | "WATER_BODY" | "ACCESS_ROAD"
  ndvi_delta: float
  intersection_category: "FULLY_WITHIN_CONCESSION" | "CONCESSION_VIOLATION"
                       | "PROTECTED_AREA_INCURSION" | "NO_CONCESSION_OVERLAP"
  dist_to_protected_area_m: float
  dist_to_water_body_m: float
  severity_score: int  # 1–100
}
```

### 9.3 AI Module Internal Structure

The AI module in V1 contains:

```
DetectionStrategy (abstract base class)
  └── ClassicalNDVIStrategy (V1 implementation)
  └── [PlaceholderMLStrategy] (stub for V2 — raises NotImplementedError)
```

The `pipeline.py` instantiates the strategy based on a configuration flag (`DETECTION_STRATEGY=classical | ml`). The strategy flag is currently hard-coded to `classical` in the V1 environment configuration.

This pattern (Strategy design pattern) ensures:
- The pipeline orchestration code does not change when the strategy changes.
- V2 machine learning integration only requires implementing `MLStrategy` and updating the config flag.

### 9.4 Future AI Extensibility (V2 Scope)

When V2 introduces a trained ML model:

**Candidate model type:** A pixel-level binary semantic segmentation model (e.g., U-Net architecture) trained on Sentinel-2 imagery patches labeled as mining/non-mining.

**Training data sources (to be acquired for V2):**
- ISRO's historical illegal mining incident database (ground truth labels).
- Existing confirmed alert polygons from SAT-MSS V1 (generated ground truth from operational use).
- Global Surface Mining dataset (globally labeled open pit mines — approximate transfer learning base).

**Model interface:** The V2 `MLStrategy` will accept the same `AnalysisInput` and produce the same `AnalysisOutput` shape. No API contract changes. No frontend changes.

**Explainability requirement:** The V2 model must produce per-pixel confidence scores alongside its segmentation output. These confidence scores are stored as a metadata raster and exposed to analysts as an "AI Confidence" overlay in the Results Panel. This addresses the legal credibility constraint of the SRS.

---

## SECTION 10 — Sprint Plan

### Sprint Overview

8 sprints × 2 weeks each = 16 weeks total (MVP delivery).

Team composition assumed:
- 2 Frontend Engineers (FE1, FE2)
- 2 Backend Engineers (BE1, BE2)
- 1 Geospatial / Remote Sensing Engineer (GS1)
- 1 DevOps Engineer (DO1)
- 1 Tech Lead (TL — reviews, architecture decisions, unblocking)

---

### Sprint 1 — Foundation (Weeks 1–2)

**Goal:** Every engineer has a working local environment. Infrastructure, database schema, and authentication are complete. The team can merge PRs against a working CI pipeline.

**Tasks:**
- [DO1] Docker Compose environment: PostgreSQL + PostGIS, Redis, MinIO, Nginx.
- [DO1] GitHub Actions CI pipeline: lint, typecheck, test, build for all workspaces.
- [DO1] `.env.example` with all required variables documented.
- [TL] Monorepo scaffold: pnpm workspaces, shared-types, shared-constants packages.
- [BE1] Database migrations 0001–0005: all core tables (users, aois, imagery_scenes, boundary_datasets, boundary_polygons).
- [BE1] Database migrations 0006–0010: analysis, alerts, cases, notifications, audit tables.
- [BE1] Drizzle schema definitions for all tables.
- [BE2] Authentication module: login, logout, JWT, RBAC middleware.
- [BE2] User management endpoints (POST, GET, PATCH admin/users).
- [GS1] GSE FastAPI scaffold: health endpoint, Celery setup, database connection.
- [FE1] Next.js app scaffold with TypeScript, Tailwind, Zustand, TanStack Query.
- [FE2] Login page UI (Orbital Glass design system foundation: colors, fonts, glass card component).

**Deliverables:**
- Working local dev environment reproducible from `scripts/setup.sh`.
- All database tables created and migrated.
- JWT authentication working end-to-end.
- CI pipeline green on `develop`.

**Dependencies:** None.
**Duration:** 2 weeks.

---

### Sprint 2 — Globe & Spatial Navigation (Weeks 3–4)

**Goal:** The Cesium globe renders. The camera transitions through the full spatial hierarchy (Globe → India → State → District). The Mission Control shell layout is complete.

**Tasks:**
- [FE1] CesiumJS integration: `GlobeViewer`, `TerrainProvider`, `CameraController`.
- [FE1] India administrative boundaries rendered (state and district GeoJSON from Survey of India public dataset — seeded via `scripts/seed-india-boundaries.sh`).
- [FE1] Camera transition animations (Orbital Descent, Lateral Glide, Retraction) implementing PXD §6 easing curves.
- [FE1] Spatial hierarchy state machine: `useSpatialHierarchy` hook.
- [FE2] Mission Control shell: `TopMissionBar`, `LeftCommandPanel`, `RightIntelligencePanel`, `BottomNavStrip`.
- [FE2] `SplashScreen` component with Earth emergence animation.
- [FE2] Breadcrumb trail component.
- [FE2] Panel collapse/expand behavior with Framer Motion animations.
- [BE1] India boundary data seed: state codes, district names, centroid coordinates loaded into reference tables.
- [GS1] Cesium terrain provider configuration (Cesium World Terrain or equivalent open DEM source).

**Deliverables:**
- Mission Control home screen (SCR-02) functional.
- Splash screen (SCR-01) functional.
- State and district selection with camera transitions (SCR-03, SCR-04, SCR-05).
- Left/Right panels displaying static data.

**Dependencies:** Sprint 1 complete.
**Duration:** 2 weeks.

---

### Sprint 3 — AOI Management (Weeks 5–6)

**Goal:** Analysts can browse existing AOIs on the globe and create new AOIs using the polygon drawing tool. AOI data persists to the database.

**Tasks:**
- [BE1] AOI module: all CRUD endpoints (`GET /aois`, `POST /aois`, `PATCH /aois/:id`, `DELETE /aois/:id`).
- [BE1] AOI polygon stored as PostGIS geometry. Spatial validation in service layer.
- [FE1] `AoiLayer` component: renders existing AOI polygons on Cesium terrain (green/amber/red by status).
- [FE1] AOI hover tooltip with name, alert count, last analysis date.
- [FE1] AOI click: camera zoom to AOI, `AoiContextPanel` slides in.
- [FE1] Drawing Mode: `AoiDrawingMode` component — vertex placement, drag to reposition, undo, close polygon.
- [FE1] `useAoiDrawing` hook — drawing state machine.
- [FE2] `AoiConfirmationForm` — name, priority, save/discard.
- [FE2] AOI Management admin screen (SCR-17).
- [FE2] Drawing HUD (vertex count, live area, coordinates display).
- [GS1] Area calculation utility using Shapely for precise ha computation (PostGIS `ST_Area` for DB, Shapely for live client-side preview).

**Deliverables:**
- AOI layer rendered on globe.
- New AOI drawing workflow end-to-end (SCR-06).
- AOI list in left panel updates in real time.
- AOI Management admin screen functional.

**Dependencies:** Sprint 2 complete.
**Duration:** 2 weeks.

---

### Sprint 4 — Imagery & Boundary Data (Weeks 7–8)

**Goal:** Satellite imagery is ingested from Copernicus Hub. Scenes are displayed on the globe within AOI boundaries. Concession and protected area boundaries are importable and rendered.

**Tasks:**
- [GS1] `copernicus_client.py`: sentinelsat integration for Sentinel-2 and Sentinel-1 search.
- [GS1] `scene_downloader.py`: streaming download of .SAFE packages to MinIO.
- [GS1] `metadata_extractor.py`: cloud cover, footprint, band extraction from scene metadata.
- [GS1] Celery task for imagery sync (triggered manually via API in Sprint 4; scheduled in Sprint 7).
- [BE2] Imagery module: scene list endpoint, scene detail, signed URL endpoint.
- [BE2] Ingestion log write on every scene acquisition.
- [BE2] Imagery sync trigger endpoint (`POST /aois/:id/scenes/trigger-sync`).
- [BE1] Boundary module: file upload endpoint (GeoJSON/KML/Shapefile), validation, dataset diff generation, activation.
- [FE1] `ImageryLayer`: Cesium `SingleTileImageryProvider` rendering scene within AOI boundary.
- [FE1] Progressive imagery load (coarse → fine, pulsing border).
- [FE1] Band selector (Natural Color, False Color, SWIR, SAR) with live crossfade.
- [FE2] `ImageryConfigPanel`: scene list, date range, cloud cover filter.
- [FE2] `BoundaryLayer`: concession and protected area polygons on Cesium terrain.
- [FE2] Boundary Dataset Management admin screen (SCR-18).
- [BE2] Boundary staleness check: scheduled daily job flags datasets > 180 days old.

**Deliverables:**
- Imagery ingestion pipeline end-to-end (Copernicus → MinIO → DB).
- Scene rendered on globe within AOI boundary (SCR-07).
- Concession and protected area boundaries rendered on globe.
- Boundary Dataset Management functional.
- Staleness warning banner displayed (BR-003).

**Dependencies:** Sprint 3 complete; Copernicus API credentials available.
**Duration:** 2 weeks.

---

### Sprint 5 — Analysis Pipeline & Results (Weeks 9–10)

**Goal:** The full change detection analysis pipeline runs end-to-end. Results are displayed as detection overlays on the Cesium terrain.

**Tasks:**
- [GS1] `preprocessor.py`: radiometric normalization, cloud masking via SCL band.
- [GS1] `ndvi_calculator.py`: NDVI computation from Band 4 and Band 8 arrays.
- [GS1] `change_detector.py`: delta NDVI, threshold masking, morphological filter, SWIR check.
- [GS1] `zone_extractor.py`: connected component labeling, minimum area filter.
- [GS1] `zone_classifier.py`: zone type classification logic.
- [GS1] `boundary_intersector.py`: PostGIS intersection and distance queries.
- [GS1] `severity_scorer.py`: weighted scoring using `severity_config` table.
- [BE1] Analysis module: dispatch endpoint, run status endpoint, GSE client.
- [BE1] Analysis Bull worker: dispatches to GSE, polls for completion, writes results to DB.
- [BE1] Alert generation logic: severity threshold check, deduplication check.
- [BE2] WebSocket: analysis progress events (`analysis:progress`, `analysis:complete`, `analysis:failed`).
- [FE1] `ChangeZoneLayer`: detection zone polygons on Cesium terrain (terrain-clamped).
- [FE1] Zone click: camera recenters, `ZoneDetailCard` appears.
- [FE1] `AnalysisConfigPanel`: baseline/target scene selection, sensitivity, Initiate button.
- [FE1] `ProgressScan` component: scanning line animation during execution.
- [FE2] `ResultsPanel`: severity ring, zone count, area display, intersection status.
- [FE2] `useAnalysisProgress` hook: WebSocket subscription for progress updates.

**Deliverables:**
- Full analysis pipeline (SCR-08) end-to-end.
- Detection results displayed on globe (SCR-09).
- Alert generated and visible in Right Panel.
- WebSocket progress updates streaming to frontend.

**Dependencies:** Sprint 4 complete; PostGIS functions validated.
**Duration:** 2 weeks.

---

### Sprint 6 — Timeline, Alerts & Triage (Weeks 11–12)

**Goal:** The timeline comparison panel is interactive. Alert triage workflow is complete. Alert status management with audit trail is functional.

**Tasks:**
- [FE1] `TimelinePanel`: temporal strip, scene ticks, baseline/target draggable markers, change area sparkline.
- [FE1] Compare mode: split terrain view with draggable divider.
- [FE1] Timeline animation playback (▶ PLAY).
- [FE1] Scene crossfade on tick click/drag (50ms delay, 300ms fade).
- [FE1] Timeline gap visualization (hatched NO DATA zones).
- [FE2] Alert Queue page (SCR-13): sortable, filterable list with all query params.
- [FE2] Alert detail page: zones, status history, image comparison.
- [FE2] `AlertStatusForm`: status dropdown, justification note, min 50 chars validation.
- [BE2] Alert module: list, detail, status update, merge endpoints.
- [BE2] Alert status state machine validation (invalid transitions rejected).
- [BE2] Alert status log write on every transition.
- [BE1] Timeline endpoint: `GET /api/v1/alerts/:id/timeline`.
- [BE1] WebSocket: `alert:new` event emission when new alert is generated.
- [GS1] Alert deduplication: overlap ratio calculation using ST_Area(ST_Intersection).

**Deliverables:**
- Timeline comparison panel (SCR-10) fully functional.
- Alert Queue (SCR-13) functional with all filters.
- Alert status management with audit trail end-to-end.
- Deduplication prompt working.

**Dependencies:** Sprint 5 complete.
**Duration:** 2 weeks.

---

### Sprint 7 — Case Files, Reports & Dashboard (Weeks 13–14)

**Goal:** Analysts can compile and export Case Files as PDF and GeoJSON. The Operational Dashboard is functional. Email notifications are working.

**Tasks:**
- [BE1] Case file module: create, update, export endpoints.
- [BE1] PDF generation worker (Puppeteer): HTML template → PDF → MinIO → signed URL.
- [BE1] GeoJSON export: compile all zone geometries + metadata into GeoJSON FeatureCollection.
- [BE1] Case file audit trail: VIEW, EDIT, EXPORT events recorded on every action.
- [BE1] Case file export job: Bull queue, WebSocket `export:ready` event.
- [BE2] Dashboard aggregation queries: summary, aoi-heatmap endpoints.
- [BE2] Email notification worker: Nodemailer, alert email template.
- [BE2] Notification module: in-platform notification list, mark-read endpoints.
- [FE2] `ReportAssemblyPanel`: evidence image drag-and-drop, caption fields, notes, recommendation.
- [FE2] Live PDF preview (iframe rendering report template in browser).
- [FE2] Export progress tracking via WebSocket `export:ready`.
- [FE1] Operational Dashboard (SCR-15): trend charts (Recharts), heat map overlay on globe.
- [FE1] Case File Archive page (SCR-14).
- [FE2] Notification bell with unread count, notification feed panel.
- [DO1] Imagery sync Celery cron schedule: every 12 hours.

**Deliverables:**
- Report Assembly and PDF export end-to-end (SCR-11).
- GeoJSON export working.
- Case File Archive (SCR-14) functional.
- Operational Dashboard (SCR-15) with live data.
- Email notifications delivered on new high-severity alerts.

**Dependencies:** Sprint 6 complete; SMTP credentials available.
**Duration:** 2 weeks.

---

### Sprint 8 — Hardening, Performance & Release Prep (Weeks 15–16)

**Goal:** The application is production-ready. Performance targets from NFR-001 through NFR-012 are verified. Security is hardened. The deployment pipeline is complete.

**Tasks:**
- [TL] End-to-end integration testing across the full analyst journey (SCR-01 through SCR-12).
- [TL] RBAC audit: verify all 4 roles have correct access boundaries across all 40 endpoints.
- [DO1] Production Docker Compose configuration (`docker-compose.prod.yml`).
- [DO1] Nginx SSL/TLS configuration with Let's Encrypt or institutional certificate.
- [DO1] Production MinIO bucket configuration with appropriate retention policies.
- [DO1] Database backup schedule: daily PostgreSQL dump to object storage.
- [DO1] Monitoring: application health checks, database connection pool monitoring.
- [BE1] Rate limiting audit: all auth endpoints and public-facing routes rate-limited.
- [BE2] Argon2 password hashing on user creation. 2FA enforcement (TOTP or email OTP).
- [BE2] Session expiry enforcement: 8-hour JWT, automatic logout on expiry (NFR-010).
- [FE1] Performance audit: Cesium tile loading, panel animation, API response times.
- [FE1] Accessibility audit: keyboard navigation, ARIA labels, focus management, reduced-motion.
- [FE2] Error state testing: data feed offline, analysis failure, session timeout states.
- [FE2] Empty state testing: all 4 empty state scenarios.
- [GS1] Analysis pipeline performance test: verify 72-hour MTTD under load (NFR-001).
- [GS1] Cloud masking edge case testing: high cloud cover scenes, partial cloud cover.
- [TL] Security review: JWT secret rotation procedure, environment secret audit.
- [TL] User onboarding tutorial content and Learnability test (NFR-012) with 5 representative users.

**Deliverables:**
- All 20 V1 screens functional and tested.
- NFR-001 (72h MTTD) verified via load test.
- NFR-006 (99.5% availability) SLA configured.
- NFR-008 (RBAC) verified via permission matrix test.
- NFR-012 (Learnability) validated with user testing.
- Production deployment pipeline operational.
- `README.md` with full deployment instructions.

**Dependencies:** Sprints 1–7 complete.
**Duration:** 2 weeks.

---

## SECTION 11 — Milestones

### Milestone 1 — MVP Alpha (End of Sprint 4 · Week 8)

**Definition:** The system runs locally. Core infrastructure is proven. An analyst can log in, navigate the globe, register an AOI, ingest imagery from Copernicus Hub, and view satellite imagery draped on terrain.

**Ready when:**
- [ ] All database tables created and seeded.
- [ ] Authentication (login/logout/RBAC) working.
- [ ] Globe renders with India state/district hierarchy and camera transitions.
- [ ] AOI drawing and saving works.
- [ ] At least one real Sentinel-2 scene ingested and displayed on terrain.
- [ ] Concession boundary import and rendering works.

**Audience:** Internal engineering team only. Not for stakeholder demo.

---

### Milestone 2 — MVP Beta (End of Sprint 6 · Week 12)

**Definition:** The core analyst workflow is end-to-end. An analyst can complete the full journey from Mission Control to viewing analysis results and managing alert triage.

**Ready when:**
- [ ] Change detection analysis pipeline runs on real Sentinel-2 scenes.
- [ ] Detection zones render on Cesium terrain as correctly colored overlays.
- [ ] Severity score calculated and displayed with correct BR-010 floor.
- [ ] Alert generated, visible in Right Panel and Alert Queue.
- [ ] Alert status update with justification note and audit trail.
- [ ] Timeline comparison panel functional.
- [ ] WebSocket real-time progress updates working.
- [ ] Alert deduplication prompt working.

**Audience:** Internal stakeholders (Product, NRSC liaison). Closed beta with 2–3 real analyst users.

---

### Milestone 3 — Release Candidate (End of Sprint 7 · Week 14)

**Definition:** All V1 features are complete and functional. The system is feature-complete for the MVP scope.

**Ready when:**
- [ ] Case File compilation and PDF export working.
- [ ] GeoJSON export working.
- [ ] Operational Dashboard populated with real data.
- [ ] Email notifications delivered for high-severity alerts.
- [ ] All 20 V1 screens implemented.
- [ ] No P1 (critical) or P2 (major) bugs open.

**Audience:** Full stakeholder group including Ministry of Mines and Forest Department representatives. Formal UAT begins.

---

### Milestone 4 — Version 1.0 General Availability (End of Sprint 8 · Week 16)

**Definition:** The system is production-deployed, security-hardened, performance-verified, and accessible to all designated users.

**Ready when:**
- [ ] All NFR acceptance criteria pass (NFR-001 through NFR-012).
- [ ] All SRS acceptance criteria pass (AC-001 through AC-018).
- [ ] Security audit passed (RBAC, JWT, encryption at rest and in transit).
- [ ] User onboarding completed for all designated analyst accounts.
- [ ] Learnability test passed (NFR-012) — 5 representative users.
- [ ] Production monitoring and backup procedures operational.
- [ ] No P1 bugs. Maximum 3 known P3 bugs (cosmetic/minor).
- [ ] Formal sign-off from NRSC technical lead.

---

## SECTION 12 — Development Order

The following sequence specifies exactly what is built first, with dependencies made explicit. Teams should not start an item until its dependencies are marked complete.

```
ORDER  ITEM                                           TEAM     DEPENDENCY
──────────────────────────────────────────────────────────────────────────────
01     Docker Compose environment                     DO1      None
02     CI/CD GitHub Actions pipeline                  DO1      01
03     Monorepo scaffold + shared-types               TL       01
04     Database migration runner + core tables        BE1      01, 03
05     Drizzle schema definitions                     BE1      04
06     GSE FastAPI + Celery scaffold                  GS1      01, 03
07     Authentication module (login/JWT/RBAC)         BE2      04, 05
08     Login page UI                                  FE2      03, 07
09     India boundary seed data + reference tables    BE1      04
10     CesiumJS integration + GlobeViewer             FE1      03
11     Camera transition system                       FE1      10
12     Mission Control shell layout                   FE2      08, 10
13     State/District navigation + hover/click        FE1      09, 11, 12
14     Splash screen animation                        FE2      12
15     AOI backend CRUD endpoints                     BE1      05, 07
16     AOI polygon layer (Cesium)                     FE1      13, 15
17     AOI Drawing Mode                               FE1      16
18     AOI Confirmation form                          FE2      17
19     AOI Management admin page                      FE2      15, 18
20     Copernicus imagery ingestion pipeline          GS1      06
21     Object storage (MinIO) client                  GS1      01
22     Imagery sync Celery task                       GS1      20, 21
23     Imagery scene DB endpoints                     BE2      05, 07
24     Scene display on Cesium terrain                FE1      16, 23
25     Band selector + composite crossfade            FE1      24
26     Imagery Config Panel                           FE2      23, 24
27     Boundary import backend                        BE1      05, 07
28     Boundary polygon Cesium layer                  FE1      16, 27
29     Boundary Dataset Management page               FE2      27, 28
30     Analysis backend dispatch (GSE client)         BE1      05, 07, 23
31     NDVI + Change Detection pipeline (GSE)         GS1      20, 21, 22
32     Zone extraction + classification (GSE)         GS1      31
33     Boundary intersection PostGIS queries          GS1      31, 27
34     Severity scoring engine                        GS1      32, 33
35     Analysis result DB writes + alert generation   BE1      30, 34
36     WebSocket analysis progress events             BE2      30
37     Change zone Cesium overlay layer               FE1      24, 30
38     Analysis Config Panel + Results Panel          FE2      37
39     Alert CRUD backend                             BE2      35, 05
40     Timeline Panel + compare mode                  FE1      24, 37
41     Alert Queue page + triage workflow             FE2      39
42     Alert status audit trail                       BE2      39
43     Case File backend + PDF generation             BE1      39, 42
44     Report Assembly Panel                          FE2      43
45     GeoJSON export                                 BE1      43
46     Operational Dashboard backend                  BE2      35, 39
47     Operational Dashboard UI                       FE1      46
48     Email notification worker                      BE2      35
49     In-platform notifications                      BE2      39
50     Security hardening + 2FA                       BE2      07
51     Accessibility audit + keyboard navigation      FE1,FE2  All UI complete
52     Performance testing + optimization             ALL      All backend complete
53     Production deployment + monitoring             DO1      52
```

---

## SECTION 13 — Technical Risks

### Risk Matrix

| ID | Risk | Probability | Impact | Mitigation Strategy |
|---|---|---|---|---|
| **TR-01** | Copernicus Open Access Hub API rate limits or downtime | HIGH | HIGH | Implement exponential backoff + retry in `copernicus_client.py`. Cache the latest available scene list locally. For prolonged outages, surface a clear `DATA_FEED_OFFLINE` indicator per PXD §25. Maintain 24-month historical baseline so analysis can proceed on cached data. |
| **TR-02** | Cesium terrain rendering performance on lower-end government hardware | MEDIUM | HIGH | Test on minimum spec hardware (Intel integrated graphics, 8GB RAM) in Sprint 2. If performance is inadequate, implement `useLowPerformanceMode()` hook that reduces terrain detail level and disables atmosphere rendering. |
| **TR-03** | Cloud cover during Indian monsoon season (June–September) renders optical imagery unusable | HIGH | MEDIUM | Sentinel-1 SAR imagery is cloud-penetrating. Ensure Sentinel-1 ingestion is complete by Sprint 4. The GSE pipeline must fall back to SAR-based change detection (different thresholds; requires research in Sprint 5). |
| **TR-04** | PostGIS spatial query performance degrading at scale (>50 AOIs, >10,000 zones) | LOW | HIGH | All geometry columns indexed with GiST. All intersection queries filter by AOI bounding box first (`&&` operator hits GiST index before `ST_Intersects`). Validate with 50-AOI load test in Sprint 8. |
| **TR-05** | PDF generation (Puppeteer) fails on evidence images loaded from object storage | MEDIUM | MEDIUM | In Sprint 7: implement pre-fetch of all evidence images as base64 before Puppeteer renders. Set a 120-second job timeout. Implement retry logic. Test with cases having 6 evidence images. |
| **TR-06** | India state/district administrative boundary data licensing restricts use | MEDIUM | HIGH | Verify licensing of Survey of India boundary data before Sprint 2. Alternative: use GADM (Global Administrative Areas) dataset which is freely licensed for non-commercial use. |
| **TR-07** | Alert deduplication false merges (two separate nearby mining sites merged) | MEDIUM | MEDIUM | The deduplication overlap threshold (60%) is configurable as a system setting. Include a mandatory analyst confirmation step — automatic merges are never performed (BR-006). Tune threshold based on Beta testing feedback in Sprint 6. |
| **TR-08** | JWTs with 8-hour expiry cause session loss mid-analysis for long-running analysis sessions | LOW | MEDIUM | Implement silent refresh: frontend detects token expiry approaching (15 minutes remaining) and automatically refreshes via a `/auth/refresh` endpoint using a long-lived refresh token stored in an httpOnly cookie. |
| **TR-09** | Python GDAL/Rasterio dependency version conflicts in Docker container | MEDIUM | LOW | Pin all Python dependency versions in `requirements.txt`. Use the official `osgeo/gdal` Docker base image, which provides a pre-compiled GDAL environment. Test the Docker build in Sprint 1 before any pipeline code is written. |
| **TR-10** | Sentinel-2 scene file sizes (110–800MB per tile) create processing memory pressure | MEDIUM | HIGH | Use Rasterio **windowed reads** — load only the AOI extent of each band, not the full tile. For a 10km² AOI on a 100km² Sentinel-2 tile, this reduces memory from 800MB to approximately 8MB per band. Validate memory usage in Sprint 5 load tests. |
| **TR-11** | MinIO object storage disk capacity exceeded by accumulated imagery tiles | LOW | HIGH | Implement imagery retention policy: scenes older than 36 months that are not linked to a Case File evidence record are automatically deleted. A purge job runs monthly. Configurable via system settings. |
| **TR-12** | RBAC bypass via horizontal privilege escalation (analyst accessing another analyst's case files) | LOW | CRITICAL | Every data query is scoped to `req.user.id` or `req.user.role` at the service layer, not just the route layer. Integration test suite includes a permission matrix test: every endpoint is tested from every role, verifying 403 on unauthorized access. This test runs in CI on every PR. |

---

## SECTION 14 — Definition of Done

### 14.1 Universal DoD (applies to every task/story)

A task is considered DONE only when ALL of the following are true:

- [ ] Code is written and self-reviewed by the author.
- [ ] All TypeScript / Python type checks pass (`tsc --noEmit` / `mypy`).
- [ ] All linting rules pass (`eslint` / `ruff`) with zero warnings.
- [ ] Unit tests written for all new business logic functions (coverage ≥ 80% on new code).
- [ ] Integration test written for all new API endpoints (happy path + 3 error paths minimum).
- [ ] No secrets, API keys, or credentials are present in committed code.
- [ ] Pull Request opened with description referencing the task/story.
- [ ] At least 1 peer review approval received.
- [ ] CI pipeline (lint + typecheck + tests) is green.
- [ ] Merged to `develop` branch.

### 14.2 Module-Level DoD

**Authentication Module — DONE when:**
- Login, logout, and JWT refresh work end-to-end.
- All 4 roles (Field Ranger, Analyst, Director, Admin) enforce correct access boundaries across all endpoints (verified by permission matrix integration test).
- 2FA enforcement active for all roles.
- Session expiry at 8 hours verified (NFR-010).
- Rate limiting on login endpoint verified (10 attempts/15 min).
- Audit log entry created on every login and logout event.

**AOI Module — DONE when:**
- CRUD endpoints pass all integration tests.
- PostGIS polygon stored and retrieved correctly in WGS84.
- AOI polygon renders correctly on Cesium terrain at all camera altitudes.
- Drawing mode: vertex placement, undo, close, and confirm flow works without errors.
- Area calculation matches PostGIS `ST_Area` result to within 0.1%.
- Minimum 50 simultaneous AOIs loadable without performance degradation (NFR-004 partial).
- AOI Management admin page renders and functions for all CRUD operations.

**Imagery Module — DONE when:**
- Sentinel-2 scene ingested from Copernicus Hub to MinIO without data corruption (MD5 hash verified).
- Sentinel-1 scene ingested from Copernicus Hub to MinIO.
- Ingestion log entry created for every successful and failed acquisition.
- Scene renders as draped imagery on Cesium terrain within AOI boundary.
- Progressive loading (coarse → fine) observable within 1 second for initial low-res preview.
- Band composite switching (Natural Color / False Color / SWIR / SAR) triggers 400ms crossfade.
- Signed scene URLs expire after the configured period and return 403 thereafter.

**Boundary Module — DONE when:**
- GeoJSON, KML, and Shapefile imports all succeed and correctly store polygon data.
- Invalid file format returns `400 INVALID_FILE_FORMAT` before any data is modified.
- Dataset diff comparison is accurate (added/removed/modified counts correct).
- Activated dataset supersedes previous; old dataset remains accessible in archive.
- Staleness warning appears for all alerts in an AOI with dataset > 180 days old (BR-003, AC-017).
- Boundary polygons render on Cesium terrain and are layered correctly with AOI polygons.

**Analysis Module — DONE when:**
- Full pipeline (NDVI → change detection → zone extraction → scoring) executes without error on a real Sentinel-2 scene pair.
- Detection zones rendered correctly on terrain as terrain-clamped polygons.
- Severity score matches manual calculation of weighted factors to within ±1 point.
- Protected Area Incursion zones receive minimum score of 75 (BR-010, AC-018).
- Alert generated for all runs where max zone severity ≥ configured threshold.
- MTTD from imagery ingestion to alert creation ≤ 72 hours verified under synthetic load (NFR-001, AC-013).
- Analysis failure state returns correct error message and marks run as FAILED.
- WebSocket progress events stream correctly from 0% to 100% during execution.

**Alert Module — DONE when:**
- All 7 alert statuses transition correctly per the state machine.
- Invalid status transitions return `400 INVALID_STATUS_TRANSITION`.
- Justification note < 50 characters returns `400 JUSTIFICATION_TOO_SHORT` (BR-005, AC-007).
- Status transitions written to `alert_status_log` immutably.
- Alert queue filters (status, severity, intersection category, AOI, date range) all function correctly.
- Deduplication prompt shown when overlap ratio > 60% with an existing open alert.
- Merged alerts retain full history in audit trail (BR-006, AC-008).
- Field Ranger cannot access Case File export (NFR-008, AC-015).

**Case File Module — DONE when:**
- Case file created only for alerts in `CONFIRMED_ILLEGAL` or `ESCALATED_TO_ENFORCEMENT` status.
- PDF report generated and downloadable, containing all required sections per PXD §22.4.
- PDF renders evidence imagery, change polygons, and metadata correctly.
- GeoJSON export contains all zone geometries with correct properties.
- Case file audit trail records: VIEW, EDIT, EXPORT actions with actor identity and timestamp.
- Audit trail immutable: no UPDATE or DELETE SQL succeeds on `case_file_audit` table.
- Audit trail retained verifiably (10-year retention policy configured on DB backup schedule).

**Dashboard Module — DONE when:**
- Summary endpoint returns correct aggregated metrics for all configurable date ranges and filters.
- Alert trend chart data matches direct SQL count queries (regression test).
- Deforestation area total matches sum of confirmed `change_zones.area_ha` for CONFIRMED_ILLEGAL alerts.
- Dashboard renders within 5 seconds under typical data load (NFR-002 partial, AC-012).

**Geospatial Engine — DONE when:**
- NDVI values for a known cloud-free scene match expected values (validated against reference NDVI maps from ISRO or USGS).
- Cloud masking correctly excludes cloud pixels (verified on scenes with known cloud positions).
- Zone area computed by GSE matches PostGIS `ST_Area` to within 2% error margin.
- Intersection classification matches manual GIS analysis of 10 test zones against known concession boundaries.
- Analysis pipeline completes within 30 minutes for a 100 km² AOI at 10m resolution.

**Frontend (All Screens) — DONE when:**
- All 20 V1 screens (SCR-01 through SCR-20) render without JavaScript console errors.
- Keyboard navigation works for all primary actions on all screens.
- ARIA labels present on all interactive elements.
- All panels animate per the motion specifications in PXD §11.2 (duration and easing).
- Reduced motion mode: all animations replaced with opacity fades.
- Minimum contrast ratios verified (WCAG 2.1 AA) on all text/background combinations.
- `NFR-012` learnability test: 5 representative Field Ranger users complete the 3 target tasks within 30 minutes of tutorial completion.

**Production Infrastructure — DONE when:**
- Application deployed and reachable at the designated production URL over HTTPS.
- TLS certificate installed and auto-renewing.
- Database daily backup running and restorable to < 1-hour recovery point.
- MinIO bucket policies configured (private access; signed URLs only).
- System availability ≥ 99.5% verified over 30-day measurement period (NFR-006, AC-014).
- All production secrets stored in secrets manager — zero secrets in repository.
- CI/CD pipeline deploys automatically on merge to `main`.

---

*End of Document — IBP-SATMSS-001 v1.0.0*

*This document represents the final planning artifact for SAT-MSS Version 1.0. Development may begin upon stakeholder sign-off. Changes to scope, architecture, or requirements discovered during development must be formally logged as Engineering Change Requests and reviewed by the Tech Lead and Principal Architect before implementation.*

*Next document to be produced: Sprint 1 Task Board (Jira/Linear backlog import from Section 10 of this document).*
