# 🌍 SAT-MSS
## Satellite Mining Surveillance System

> **An AI-Assisted Earth Observation & Geospatial Intelligence Platform for Satellite-Based Land Disturbance Monitoring**

<p align="center">

![Status](https://img.shields.io/badge/Status-Sprint%201%20Complete-success)
![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Express](https://img.shields.io/badge/Express-4.x-green)
![PostGIS](https://img.shields.io/badge/PostGIS-Enabled-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)
![License](https://img.shields.io/badge/License-MIT-yellow)

</p>

---

# 📖 About

SAT-MSS (Satellite Mining Surveillance System) is an enterprise-grade Earth Observation platform designed to assist analysts in monitoring land disturbances using multispectral satellite imagery, geospatial analytics, and AI-assisted workflows.

Instead of acting as a traditional dashboard, SAT-MSS provides a Mission Control experience where analysts navigate the Earth in 3D, select Areas of Interest (AOIs), analyze satellite imagery, and generate evidence-based reports.

The platform focuses on detecting **land disturbances** rather than determining the legality of mining activities.

---

# 🎯 Project Vision

Build an intelligent Earth Observation platform capable of combining:

- Satellite Remote Sensing
- GIS
- Computer Vision
- Artificial Intelligence
- Interactive 3D Visualization

into a single analyst-friendly workflow.

---

# 🚀 Current Status

## Sprint 1 ✅ Completed

- Monorepo Architecture
- Authentication
- Docker Infrastructure
- PostgreSQL + PostGIS
- Redis
- MinIO
- Express API
- Next.js Frontend
- FastAPI Geospatial Engine Scaffold
- Shared Packages
- CI Pipeline

---

## Sprint 2 🚧

- CesiumJS Mission Control
- 3D Globe
- India Navigation
- AOI Drawing

---

## Sprint 3

- Google Earth Engine
- Sentinel-2 Imagery
- Raster Processing

---

## Sprint 4

- NDVI
- Change Detection
- AI-assisted Analysis

---

# 🛰 Core Domains

- Earth Observation
- Remote Sensing
- Geographic Information Systems (GIS)
- Artificial Intelligence
- Computer Vision
- Geospatial Data Processing
- Full Stack Engineering

---

# 🏗 System Architecture

```
                Mission Control UI
                     Next.js
                        │
                        ▼
               Express API Gateway
                        │
        ┌───────────────┴──────────────┐
        │                              │
        ▼                              ▼
 FastAPI Geospatial Engine       PostgreSQL + PostGIS
        │                              │
        │                              ▼
        │                        Spatial Database
        ▼
Google Earth Engine
        │
        ▼
Satellite Processing
        │
        ▼
AI / Remote Sensing Pipeline
```

---

# 🛠 Technology Stack

## AI & Geospatial

- Python
- FastAPI
- Google Earth Engine *(Upcoming Integration)*
- GDAL *(Planned)*
- Rasterio *(Planned)*
- GeoPandas *(Planned)*
- Shapely *(Planned)*
- PyProj *(Planned)*
- NumPy *(Planned)*
- OpenCV *(Planned)*
- PyTorch *(Future AI Module)*

---

## Remote Sensing

- Sentinel-2 *(Upcoming)*
- Sentinel-1 *(Future)*
- NDVI *(Upcoming)*
- NDWI *(Future)*
- Change Detection *(Upcoming)*

---

## Backend

- Node.js
- Express.js
- TypeScript
- JWT Authentication
- Socket.IO
- Drizzle ORM
- Zod

---

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand
- TanStack Query
- React Hook Form
- Framer Motion
- CesiumJS *(Sprint 2)*

---

## Database

- PostgreSQL
- PostGIS
- Redis
- MinIO

---

## Infrastructure

- Docker
- Docker Compose
- Nginx
- GitHub Actions

---

# 📂 Repository Structure

```
SAT-MSS/

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

# 📚 Documentation

This project follows a Documentation-First Software Engineering approach.

| Document | Status |
|----------|--------|
| Product Requirements Document | ✅ |
| Software Requirements Specification | ✅ |
| Product Experience Design | ✅ |
| Implementation Blueprint | ✅ |
| Sprint 1 | ✅ |
| Sprint 2 | 🚧 |

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

# 🛣 Roadmap

- [x] Sprint 1 – Foundation
- [ ] Sprint 2 – Mission Control UI
- [ ] Sprint 3 – Satellite Integration
- [ ] Sprint 4 – AI & Remote Sensing
- [ ] Sprint 5 – Reports & Timeline

---

# 🤝 Contributing

Contributions, ideas, and discussions are welcome.

Please open an Issue before submitting large feature changes.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Nilesh Bokhare**

- GitHub: https://github.com/horridnick08

---

⭐ If you like this project, consider giving it a star.
