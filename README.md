# 🌍 SAT-MSS
### Satellite Mining Surveillance System

> **AI-Assisted Earth Observation Platform for Satellite-Based Land Disturbance Detection**

![Status](https://img.shields.io/badge/Status-Sprint%201%20Complete-success)
![Frontend](https://img.shields.io/badge/Frontend-Next.js-black)
![Backend](https://img.shields.io/badge/Backend-Express.js-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20PostGIS-blue)
![Docker](https://img.shields.io/badge/Deployment-Docker-2496ED)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📖 Overview

SAT-MSS (Satellite Mining Surveillance System) is an AI-assisted Earth Observation platform designed to monitor land disturbances using multispectral satellite imagery.

The platform enables analysts to:

- Detect land cover changes
- Monitor Areas of Interest (AOIs)
- Analyze satellite imagery
- Visualize changes on an interactive 3D globe
- Generate evidence-based reports

> **Note:** SAT-MSS detects **land disturbances**. It does **not** determine whether mining activity is legal or illegal.

---

# ✨ Features

### ✅ Sprint 1 (Completed)

- Monorepo Architecture
- Secure Authentication
- Dockerized Infrastructure
- PostgreSQL + PostGIS
- Redis
- MinIO Object Storage
- Express Backend API
- Next.js Frontend
- FastAPI Geospatial Engine (Scaffold)
- Shared Type Packages
- CI Pipeline

---

### 🚧 Upcoming

- 🌍 3D CesiumJS Mission Control
- 🇮🇳 India Navigation
- 🗺️ State & District Selection
- ✏️ AOI Drawing
- 🛰️ Sentinel-2 Integration
- 🌱 NDVI Analysis
- 📊 Change Detection
- 📄 Automated Report Generation

---

# 🏗 Project Architecture

```
                +------------------------+
                |   Next.js Frontend     |
                +-----------+------------+
                            |
                            |
                    REST / WebSocket
                            |
                +-----------v------------+
                |   Express API Server   |
                +-----------+------------+
                            |
          +-----------------+------------------+
          |                                    |
          |                                    |
+---------v---------+              +-----------v-----------+
| Geospatial Engine |              | PostgreSQL + PostGIS |
|     FastAPI       |              +-----------------------+
+---------+---------+
          |
          |
+---------v---------+
| Google Earth Engine|
+-------------------+
```

---

# 📂 Repository Structure

```
sat-mss/
│
├── apps/
│   ├── api/
│   └── web/
│
├── packages/
│   ├── shared-types/
│   ├── shared-constants/
│   └── geo-utils/
│
├── services/
│   └── gse/
│
├── infrastructure/
│
├── scripts/
│
└── docs/
```

---

# 🛠 Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- TailwindCSS
- Zustand
- React Query

---

## Backend

- Express.js
- TypeScript
- JWT Authentication
- Socket.IO
- Drizzle ORM

---

## Database

- PostgreSQL
- PostGIS
- Redis

---

## Geospatial

- FastAPI
- Google Earth Engine
- GDAL
- Rasterio
- GeoPandas

---

## Infrastructure

- Docker
- Docker Compose
- MinIO
- Nginx

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/horridnick08/SAT-MSS.git
cd SAT-MSS
```

## Install Dependencies

```bash
pnpm install
```

## Start Infrastructure

```bash
docker compose up -d
```

## Start Backend

```bash
pnpm --filter @satmss/api dev
```

## Start Frontend

```bash
pnpm --filter @satmss/web dev
```

Open:

```
http://localhost:3000
```

---

# 📚 Documentation

This project follows a documentation-first software engineering workflow.

| Document | Status |
|----------|--------|
| Product Requirements (PRD) | ✅ |
| Software Requirements (SRS) | ✅ |
| Product Experience Design (PXD) | ✅ |
| Implementation Blueprint | ✅ |
| Sprint 1 | ✅ |
| Sprint 2 | 🚧 |

---

# 🛣 Development Roadmap

### Sprint 1 ✅

- Infrastructure
- Authentication
- Backend
- Frontend
- Docker
- Database

### Sprint 2 🚧

- Mission Control UI
- CesiumJS Integration
- Earth Navigation
- AOI Selection

### Sprint 3

- Satellite Imagery
- Sentinel-2
- Image Processing

### Sprint 4

- NDVI
- Change Detection
- AI Analysis

### Sprint 5

- Reports
- Timeline
- Case Management

---

# 🤝 Contributing

Contributions, feature requests, and suggestions are welcome.

Feel free to open an Issue or submit a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Nilesh Bokhare**

- GitHub: https://github.com/horridnick08
- LinkedIn: *(Add your LinkedIn URL here)*

---

⭐ If you found this project interesting, consider giving it a star.
