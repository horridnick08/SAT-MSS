# Software Requirements Specification (SRS)
## Satellite-based Illegal Mining Detection System
### Earth Observation Enforcement Intelligence Platform

---

| Document Control | |
|---|---|
| **Document ID** | SRS-SIMDS-001 |
| **Version** | 1.0.0 |
| **Status** | Draft — Pending Stakeholder Review |
| **Prepared By** | Principal Software Architect — Earth Observation Systems |
| **Review Authority** | Head of Product, Head of Engineering, Legal Counsel |
| **Classification** | Internal — Restricted Distribution |
| **Source PRD** | `problem_definition.md` — Product Discovery Phase |
| **Date Issued** | 2026-07-18 |
| **Standard** | IEEE 29148:2018 — Systems and Software Engineering |

---

## Document Revision History

| Version | Date | Author | Change Summary |
|---|---|---|---|
| 0.1 | 2026-07-18 | Principal Architect | Initial draft from PRD baseline |
| 1.0 | 2026-07-18 | Principal Architect | Complete SRS draft for stakeholder review |

---

## Table of Contents

1. Introduction
2. Purpose
3. Scope
4. Definitions, Acronyms, and Abbreviations
5. Stakeholders
6. Actors
7. Assumptions
8. Constraints
9. Functional Requirements
10. Non-Functional Requirements
11. Business Rules
12. User Stories
13. Use Cases
14. Acceptance Criteria
15. Requirement Traceability Matrix

---

## 1. Introduction

This Software Requirements Specification (SRS) formally describes the requirements for the **Satellite-based Illegal Mining Detection System (SIMDS)**, hereafter referred to as "the System" or "SIMDS." This document constitutes the engineering contract between the product, engineering, legal, and operational stakeholders before any software design or development activity commences.

This SRS is authored in accordance with **IEEE 29148:2018** — the international standard for systems and software engineering life cycle processes relating to requirements. It supersedes all informal notes, verbal agreements, and preliminary product sketches made prior to its issuance. Any change to the requirements defined herein must follow the formal change control process as governed by the project's Change Management Protocol.

This SRS was derived from the approved **Problem Definition Document** (`SRS-SIMDS-PRD-001`) completed during Product Discovery.

---

## 2. Purpose

The purpose of this document is to:

- Define all **functional and non-functional requirements** for SIMDS with unambiguous, verifiable, and testable specificity.
- Serve as the authoritative specification against which software design, development, quality assurance, and user acceptance testing activities will be planned and measured.
- Establish a traceable link between the business problem, stakeholder needs, user stories, use cases, and individual requirements.
- Provide the legal and contractual baseline for engagement between all delivery parties, including internal engineering teams, third-party data providers, and partner enforcement agencies.

This document does **not** describe implementation details, architectural decisions, or any technology selections. Those concerns are deferred to the System Architecture Document (SAD) and the Software Design Document (SDD), which are produced in subsequent project phases after this SRS is formally approved.

---

## 3. Scope

### 3.1 System Name
**SIMDS** — Satellite-based Illegal Mining Detection System

### 3.2 System Description
SIMDS is an Earth Observation (EO) intelligence platform that enables government enforcement agencies, environmental regulatory bodies, and conservation organizations to detect, monitor, triage, and document unauthorized surface mining activities within designated geographic regions. The system operates by continuously ingesting and analyzing multi-temporal satellite imagery to identify land-cover changes characteristic of illegal mining activity, crossing those changes against official concession and protected area boundaries, and generating prioritized, evidence-grade alert packages for human review and field response.

### 3.3 System Boundaries
The system boundary includes:
- Ingestion of open-access Earth observation datasets covering user-defined geographic regions of interest.
- Analysis of multi-temporal imagery to detect land-cover change signatures consistent with illegal surface mining.
- Cross-referencing of detected changes against authoritative concession and protected boundary registers.
- Alert triage, scoring, and queue management workflow for human review.
- Case file generation and export of geospatially precise, legally formatted evidence packages.
- A role-based web interface supporting distinct analyst, ranger, and director-level user experiences.

The system boundary explicitly excludes:
- Underground or subsurface mining detection.
- Direct operational command or dispatch of field enforcement personnel or vehicles.
- Automated issuance of legal penalties, fines, or license sanctions.
- Spectral identification of specific subsurface mineral commodity types.
- Procurement or default ingestion of sub-meter commercial satellite imagery.

### 3.4 Relation to Other Documents
| Document | Relationship |
|---|---|
| `problem_definition.md` (PRD) | Parent — requirements derived from this document |
| System Architecture Document (SAD) | Child — to be authored post-SRS approval |
| Software Design Document (SDD) | Child — to be authored post-SAD approval |
| Test Plan & QA Strategy | Child — derived from acceptance criteria in this SRS |
| Data Management Plan | Sibling — governs data lifecycle and retention policies |

---

## 4. Definitions, Acronyms, and Abbreviations

| Term | Definition |
|---|---|
| **Alert** | A system-generated notification indicating a detected land-cover change within a monitored region that meets or exceeds the configured detection threshold for suspected illegal mining activity. |
| **Alert Precision Rate** | The ratio of alerts confirmed by human analysts or field teams to be genuine illegal mining events versus the total number of alerts generated within a given period. Expressed as a percentage. |
| **AOI (Area of Interest)** | A user-defined geographic polygon or multi-polygon representing a specific region designated for active monitoring by the system. |
| **Artisanal Mining** | Small-scale, low-capital mineral extraction typically conducted by individuals or small groups using manual or rudimentary mechanical equipment. Often informal or unlicensed. |
| **Case File** | A formally structured, exportable evidence package generated by the system for a confirmed or high-confidence alert, containing all associated geospatial coordinates, imagery comparisons, change history, area estimates, and metadata required for administrative or legal use. |
| **Change Detection** | The process of identifying statistically significant differences in land-cover characteristics between two or more time-ordered observations of the same geographic area. |
| **Concession** | A formally licensed geographic area in which a company or individual has been legally granted the right to explore for or extract specific mineral resources under regulatory conditions. |
| **EO (Earth Observation)** | The acquisition of information about Earth's physical, chemical, and biological systems via remote sensing instruments aboard satellites or aircraft. |
| **False Positive** | An alert generated by the system for a land-cover change that, upon investigation, is determined to not be attributable to illegal mining activity. |
| **GIS (Geographic Information System)** | A framework for gathering, managing, and analyzing spatial and geographic data. |
| **GeoJSON** | An open standard format for encoding geographic data structures using JavaScript Object Notation (JSON), commonly used in geospatial workflows. |
| **KML (Keyhole Markup Language)** | An XML-based file format used to display geographic data in mapping applications. |
| **Land-Cover Change** | A detectable alteration in the type, extent, or condition of the surface cover within a monitored geographic area, such as forest-to-bare-earth conversion. |
| **MTTD (Mean Time to Detect)** | The average time elapsed between the initiation of an illegal mining activity and its formal detection and alert generation by the system. |
| **Multi-Spectral Imagery** | Satellite imagery captured across multiple distinct wavelength bands of the electromagnetic spectrum, enabling analysis beyond visible light (e.g., near-infrared, short-wave infrared). |
| **Protected Area** | A geographically defined region formally designated by governmental authority for the purpose of biodiversity conservation, including national parks, nature reserves, wildlife sanctuaries, and indigenous territories. |
| **Radar Imagery (SAR)** | Satellite imagery produced using Synthetic Aperture Radar, which is capable of penetrating cloud cover and acquiring surface data in all weather conditions. |
| **Region of Interest (ROI)** | Synonymous with AOI for this document. A defined geographic region submitted by a user for monitoring. |
| **Severity Score** | A normalized numerical score assigned by the system to each alert, calculated using configurable factors including detected change area, rate of expansion, proximity to protected areas, and proximity to water bodies. |
| **Shapefile** | A geospatial vector data format for GIS software, storing geometric location and attribute information. |
| **Tailings Pond** | An engineered containment structure used to store the by-products (waste slurry) of mining operations, often containing toxic chemicals and heavy metals. |
| **True Positive** | An alert generated by the system that is subsequently confirmed by analyst review or field verification to represent genuine illegal mining activity. |
| **Wildcat Mining** | Unregulated, unlicensed large-scale mining conducted without government authorization, often by organized groups with heavy machinery. |
| **ASM** | Artisanal and Small-scale Mining |
| **CRUD** | Create, Read, Update, Delete — standard data management operations |
| **FR** | Functional Requirement |
| **NFR** | Non-Functional Requirement |
| **RBAC** | Role-Based Access Control |
| **ROI** | Region of Interest |
| **RTM** | Requirement Traceability Matrix |
| **SIMDS** | Satellite-based Illegal Mining Detection System |
| **SRS** | Software Requirements Specification |

---

## 5. Stakeholders

Stakeholders are those individuals, groups, or organizations with a legitimate interest in the outcomes produced by SIMDS, whether through direct use, organizational mandate, legal jurisdiction, or impact to their rights.

| ID | Stakeholder | Role & Interest |
|---|---|---|
| **SH-01** | National and Regional Environmental Ministries | Primary regulatory clients. Responsible for environmental enforcement. Use SIMDS to support legal action and concession management. |
| **SH-02** | National and Regional Forestry Commissions | Manage national forest estate. Use SIMDS to detect deforestation events attributable to mining within designated forest reserves. |
| **SH-03** | Mineral Resources Regulatory Authorities | Govern legal concession issuance and enforcement. Require SIMDS data to identify mining outside licensed boundaries. |
| **SH-04** | Environmental Criminal Justice / Prosecution Departments | Require legally credible, timestamped evidence packages produced by the system to support criminal prosecutions. |
| **SH-05** | Indigenous and Forest Community Representatives | Interest groups whose territorial rights, water access, and health are directly impacted. Provide qualitative legitimacy and can supply qualitative field intelligence. |
| **SH-06** | Conservation NGOs | International and national organizations that monitor ecological integrity. May act as secondary alert reviewers or funding partners requiring reporting data. |
| **SH-07** | International Climate and Conservation Funding Bodies | Bodies such as REDD+ program administrators and multilateral environmental funds that require quantitative impact metrics to validate fund disbursement. |
| **SH-08** | Legitimate Mining Concessionaires | Legal operators whose concession boundaries must be correctly registered to avoid incorrect false-positive alerts on their licensed activities. |
| **SH-09** | Deploying Organization / System Owner | The organization responsible for operating, maintaining, and governing SIMDS on behalf of client agencies. |

---

## 6. Actors

Actors are the specific user roles who directly interact with the system through its interface or automated data feeds. Actors represent categories of people, not individuals.

| ID | Actor | Description | Primary Access Mode |
|---|---|---|---|
| **AC-01** | Field Ranger / Enforcement Officer | Operational enforcement personnel who receive and act upon alert notifications. They require simple, map-centric views of high-priority alerts and the ability to generate field briefing packages. | Web interface; future mobile companion |
| **AC-02** | Environmental Analyst / GIS Investigator | Specialist who performs detailed technical review of alerts, validates severity scores, constructs evidence timelines, and compiles formal case files. | Full web interface |
| **AC-03** | Operations Director / Regional Manager | Senior official responsible for oversight of monitoring activities across one or more geographic jurisdictions. Requires macro-level dashboards and trend reporting. | Web interface — reporting views |
| **AC-04** | System Administrator | Internal technical operator responsible for managing user accounts, defining AOIs, updating concession boundary datasets, configuring alert thresholds, and maintaining system health. | Full administrative web interface |
| **AC-05** | Satellite Data Feed (External System Actor) | An automated, external data delivery channel that provides the raw Earth observation imagery into the system's ingestion pipeline. Not a human actor. | Data ingestion endpoint |
| **AC-06** | Concession Registry (External System Actor) | An external authoritative database or file source maintained by the relevant regulatory authority, containing legal mining concession and protected area boundaries. | Data import / scheduled sync |

---

## 7. Assumptions

The following assumptions are accepted as true for the purposes of this SRS. If any assumption is invalidated during development, the affected requirements must be reviewed and this document updated.

| ID | Assumption |
|---|---|
| **A-01** | Open-access satellite imagery with sufficient spectral bands and spatial resolution to identify surface-level land-cover changes at a scale of 10 meters or finer will be continuously and reliably available for the target pilot region throughout the system's operational lifespan. |
| **A-02** | Client government agencies possess the legal authority and institutional willingness to provide SIMDS with access to their official, digital concession boundary and protected area boundary datasets in a consumable geographic format. |
| **A-03** | Client environmental and enforcement agencies have staff with sufficient computer literacy to operate a web-based interface following appropriate onboarding and training. No specialized GIS software expertise is assumed for Field Ranger or Operations Director roles. |
| **A-04** | The deploying organization has established data sharing and data processing agreements with satellite data providers that comply with all applicable international and national data sovereignty regulations. |
| **A-05** | The pilot deployment region will be formally defined and scoped to a single geographic biome before the system enters development, to constrain initial data volumes and validation scope. |
| **A-06** | Cloud-cover obstruction is accepted as an environmental constraint for optical imagery channels. The system's detection obligations apply only to periods when cloud-free or partially cloud-free imagery is available. Radar-based (SAR) data will supplement coverage where feasible. |
| **A-07** | Human expert review by a qualified analyst is a mandatory step in the workflow before any alert is converted to a Case File or submitted to law enforcement. The system does not operate autonomously without human-in-the-loop confirmation for enforcement actions. |
| **A-08** | Legal admissibility standards for geospatial evidence are defined by the laws of the client government jurisdiction and are the responsibility of the client's legal counsel to verify. The system is responsible for producing evidence packages consistent with internationally recognized forensic documentation standards. |

---

## 8. Constraints

The following constraints are fixed conditions under which the system must operate. Constraints cannot be modified through design decisions.

| ID | Constraint | Rationale |
|---|---|---|
| **C-01** | The system must operate exclusively on open-access satellite imagery within its default data pipeline. Acquisition of commercial, sub-meter imagery is outside the system's funded operational budget baseline. | Budget and procurement constraint. |
| **C-02** | The system must not automatically trigger any legal enforcement action, penalty, or notification to external parties without a formal analyst review and manual confirmation step. | Legal liability and human-rights due process constraint. |
| **C-03** | All data processed and stored by the system must comply with the data sovereignty and personal data regulations applicable to the jurisdictions of the client government agencies. | Legal and regulatory compliance constraint. |
| **C-04** | The system must produce case file exports in at least one open, nonproprietary GIS-compatible format (GeoJSON, KML, or Shapefile) so that client agencies are not locked into proprietary formats. | Interoperability and data sovereignty constraint. |
| **C-05** | The system must implement Role-Based Access Control (RBAC) with a minimum of four distinct roles: Field Ranger, Analyst, Operations Director, and System Administrator. No actor may exceed the access permissions defined for their assigned role. | Security and operational security constraint. |
| **C-06** | The system must not store personally identifiable information about individuals suspected of illegal mining, as the system's role is geographic observation only. Criminal investigation of individuals remains the exclusive function of law enforcement agencies. | Legal, privacy, and rights constraint. |
| **C-07** | The system interface must be operable within a modern web browser without requiring the installation of any client-side software, plugin, or GIS application by end users. | Operational deployment constraint for remote-region government agencies. |
| **C-08** | The maximum allowable MTTD from satellite data availability to system alert generation must not exceed 72 hours during the system's normal operational mode. | Operational performance constraint. |

---

## 9. Functional Requirements

Each requirement is assigned a unique identifier in the format **FR-XXX**. Requirements are organized by functional domain.

---

### 9.1 Domain: Data Ingestion and Management

**FR-001 — Satellite Imagery Ingestion**
> The system shall automatically ingest newly available multi-spectral and radar satellite imagery covering each registered Area of Interest (AOI) upon the imagery becoming available from the configured data feed.

**FR-002 — Multi-Source Ingestion Support**
> The system shall support the ingestion of imagery from a minimum of two distinct open-access satellite constellations to ensure continuous coverage and mitigate single-source data gaps.

**FR-003 — Ingestion Acknowledgement and Audit**
> The system shall record a timestamped ingestion log entry for every imagery acquisition, capturing the source satellite identifier, acquisition date, scene coverage footprint, cloud cover percentage, and ingestion status. This log shall be immutable and retained for the duration of the system's operational lifecycle.

**FR-004 — AOI Registration and Management**
> The system shall allow System Administrators to create, modify, and deactivate geographic Areas of Interest (AOIs) defined by polygonal boundaries expressed in standard geographic coordinates (WGS84). A minimum of 50 simultaneous active AOIs must be supported.

**FR-005 — Concession and Protected Area Boundary Import**
> The system shall allow System Administrators to import, update, and version-control concession boundary and protected area boundary datasets in GeoJSON, KML, or Shapefile formats. All imported boundary datasets must carry a documented date-of-validity timestamp.

**FR-006 — Historical Imagery Baseline Establishment**
> The system shall maintain a stored baseline of historical imagery for each AOI sufficient to enable temporal change comparison spanning at minimum 24 months prior to the AOI's registration date, using historically archived open-access imagery.

---

### 9.2 Domain: Change Detection and Analysis

**FR-007 — Land-Cover Change Detection**
> The system shall detect and flag statistically significant land-cover changes between temporally consecutive imagery acquisitions within each active AOI. Detection must identify, at minimum, the following change signatures:
> - (a) Rapid vegetation canopy loss (deforestation clearing)
> - (b) Bare soil or exposed earth formation in previously vegetated areas
> - (c) Formation or expansion of standing water bodies or sediment pools inconsistent with seasonal hydrological patterns
> - (d) Formation of linear clearings consistent with access road construction in forested terrain

**FR-008 — Change Area Quantification**
> The system shall calculate and record the estimated affected area (in square meters and hectares) for each detected change event.

**FR-009 — Change Velocity Measurement**
> The system shall calculate and record the rate of change expansion expressed as area change per observation interval, enabling the detection of accelerating or decelerating activity.

**FR-010 — Concession Boundary Intersection**
> The system shall automatically cross-reference each detected change event against all registered concession and protected area boundaries. The system shall classify each change event into one of the following intersection categories:
> - (a) **Fully Within Licensed Concession:** Change is entirely within a currently valid licensed mining concession.
> - (b) **Concession Boundary Violation:** Change partially or wholly extends beyond a licensed concession boundary.
> - (c) **Protected Area Incursion:** Change occurs within or adjacent to (within a configurable buffer) a protected area.
> - (d) **No Concession Overlap:** Change occurs in an area with no registered concession or protected boundary.

**FR-011 — Severity Score Assignment**
> The system shall calculate and assign a severity score to each change event on a normalized scale of 1 to 100. The score shall incorporate, at minimum, the following weighted factors:
> - (a) Detected change area
> - (b) Rate of change expansion
> - (c) Distance to nearest protected area boundary
> - (d) Distance to nearest permanent water body
> - (e) Intersection category (FR-010)
> - (f) Proximity to previously confirmed illegal mining sites

**FR-012 — Severity Score Configurability**
> The system shall allow System Administrators to adjust the relative weighting of each severity score factor defined in FR-011, subject to the constraint that all weights sum to 100%.

---

### 9.3 Domain: Alert Management

**FR-013 — Alert Generation**
> The system shall automatically generate an Alert record for every change event whose calculated severity score meets or exceeds a configurable minimum threshold. Each alert shall contain, at minimum: a unique alert identifier, the associated AOI, geographic coordinates (centroid and bounding polygon) of the detected change, the calculated severity score, the intersection category, the affected area, the imagery acquisition dates used for comparison, and the system-generated timestamp.

**FR-014 — Alert Queue and Triage Workspace**
> The system shall provide Analysts with a unified triage workspace displaying all pending, under-review, and recently resolved alerts, sortable and filterable by severity score, intersection category, AOI, area size, date range, and current review status.

**FR-015 — Alert Status Management**
> The system shall support the following analyst-assignable statuses for each alert: **Pending Review, Under Review, Confirmed — Illegal Activity, Confirmed — Legal Activity, False Positive — Natural Event, False Positive — Data Error, Escalated to Enforcement.** Status transitions shall be logged with the acting analyst's identity and a mandatory free-text justification note of at least 50 characters.

**FR-016 — Alert Notification**
> The system shall issue configurable notifications to designated user accounts when a new alert is generated with a severity score above a user-specified threshold. Notification channels must include, at minimum, in-platform notification and email.

**FR-017 — Alert Deduplication**
> The system shall detect and merge overlapping or adjacent change events that correspond to the same geographic site across consecutive observation cycles, preventing duplicate alert generation for a single continuously evolving mining site.

---

### 9.4 Domain: Map Interface and Visualization

**FR-018 — Interactive Geospatial Map Interface**
> The system shall provide all authenticated users with an interactive map interface displaying, at minimum: active AOI boundaries, active alert locations, concession and protected area boundary overlays, and historical confirmed site markers. The interface shall support standard map navigation (pan, zoom, search by coordinates or place name).

**FR-019 — Multi-Temporal Image Comparison**
> The system shall provide Analysts with an in-interface, side-by-side or swipe-based image comparison view that displays the before and after satellite imagery for any selected alert, overlaid with the detected change boundary polygon.

**FR-020 — Change History Timeline**
> The system shall provide, for each alert or confirmed site, a chronological timeline view displaying all historical change events detected at that location, rendered on a temporal slider or chart, allowing analysts to assess the full progression of activity over time.

---

### 9.5 Domain: Case File Generation

**FR-021 — Case File Compilation**
> The system shall allow Analysts to compile a formal Case File for any alert with a status of **Confirmed — Illegal Activity** or **Escalated to Enforcement.** A Case File shall aggregate, at minimum: the alert summary, all multi-temporal imagery evidence, the change detection boundary polygons, the severity score rationale, the intersection classification, the estimated affected area, the analyst review notes, the full audit trail of alert status changes, and the relevant concession and protected area boundaries.

**FR-022 — Case File Export**
> The system shall allow Analysts to export a compiled Case File as a self-contained package in at minimum two formats:
> - (a) A human-readable PDF document containing maps, imagery, analysis notes, and all metadata.
> - (b) A machine-readable geospatial data package containing the boundary polygons in GeoJSON format.

**FR-023 — Case File Versioning and Audit**
> The system shall maintain a complete and immutable audit trail for each Case File, recording every access, edit, and export action performed on that file, including the timestamp, actor identity, and action type. This audit trail must be preserved for a minimum of 10 years.

---

### 9.6 Domain: Reporting and Analytics

**FR-024 — Operational Dashboard**
> The system shall provide Operations Directors with a dedicated reporting dashboard displaying, at minimum: total active alerts by AOI and by intersection category, alert trend lines over configurable time periods (week, month, quarter), breakdown of alert outcomes (confirmed illegal, legal, false positive), and total confirmed deforestation area attributed to illegal mining within each AOI over configurable time periods.

---

## 10. Non-Functional Requirements

Non-functional requirements define the quality attributes and operational characteristics of SIMDS. They constrain how the system delivers its functional requirements.

---

### 10.1 Performance

**NFR-001 — Alert Generation Latency**
> The system shall generate an alert for a qualifying change event within a maximum of 72 hours from the confirmed availability of the relevant satellite imagery in the ingestion pipeline. This is measured as: (Alert creation timestamp) − (Imagery confirmed-ingested timestamp) ≤ 72 hours.

**NFR-002 — Interface Responsiveness**
> Map interface load times for AOI overview views shall not exceed 5 seconds on a standard broadband connection. Alert triage list views shall load within 3 seconds under normal system load.

**NFR-003 — Change Detection Throughput**
> The system shall be capable of processing change detection analysis concurrently across all active AOIs without queuing delays that would cause any single AOI to exceed the 72-hour alert latency threshold defined in NFR-001.

---

### 10.2 Scalability

**NFR-004 — Geographic Coverage Scalability**
> The system shall be designed to support expansion of monitoring coverage to a cumulative area of at least 1,000,000 km² without requiring changes to the system's core data processing design.

**NFR-005 — User Concurrency**
> The system shall support a minimum of 200 concurrent authenticated users across all roles without degradation of response times below the thresholds defined in NFR-002.

---

### 10.3 Reliability and Availability

**NFR-006 — System Availability**
> The system shall maintain a minimum operational availability of 99.5% measured on a calendar-month basis, excluding scheduled maintenance windows that are communicated to users with at minimum 48 hours advance notice.

**NFR-007 — Data Durability**
> Ingested imagery metadata, alert records, case file data, and audit logs shall be stored with a durability guarantee equivalent to no more than 0.001% annual data loss probability across any rolling 12-month period.

---

### 10.4 Security

**NFR-008 — Role-Based Access Control**
> All system functions and data views shall be governed by RBAC, enforcing strict access boundaries between roles as documented in Constraint C-05. No actor shall be able to access data or perform operations not designated for their assigned role.

**NFR-009 — Data Encryption**
> All data transmitted between user clients and the system, and all data stored persistently within the system (including imagery metadata, alert records, and case files), shall be encrypted using currently accepted industry-standard encryption practices.

**NFR-010 — Authentication**
> Access to the system shall require authenticated login with a minimum of two factors of authentication for all user roles. Sessions shall automatically expire after a maximum of 8 hours of inactivity.

**NFR-011 — Audit Logging**
> The system shall maintain a comprehensive, tamper-evident audit log of all significant user interactions, including: login and logout events, AOI creation and modification, alert status changes, case file creation and export, and administrative configuration changes.

---

### 10.5 Usability

**NFR-012 — Learnability**
> A newly onboarded Field Ranger user (AC-01), assumed to have no prior GIS or remote sensing experience, shall be able to independently navigate to an active high-severity alert on the map, view the before-and-after imagery comparison, and generate a field briefing export within 30 minutes of completing the mandatory onboarding tutorial, without requiring assistance.

---

## 11. Business Rules

Business rules are organizational policies and domain constraints that govern how the system must behave, independent of specific use cases.

| ID | Business Rule |
|---|---|
| **BR-001** | No alert shall be automatically elevated to **Escalated to Enforcement** status without a confirmed manual status assignment by a user with Analyst or higher role. The system is prohibited from performing this transition autonomously. |
| **BR-002** | A change event that falls entirely within a currently valid licensed concession boundary shall not generate an alert unless the change area exceeds the licensed concession's maximum permitted disturbance area, if such a limit is registered in the concession boundary dataset. |
| **BR-003** | If an AOI's concession boundary dataset has not been refreshed within 180 calendar days, the system shall flag all alerts within that AOI with a **"Boundary Data May Be Stale"** warning, visible to all reviewing analysts. |
| **BR-004** | Case Files may only be exported by users holding the Analyst role or higher. Field Rangers may view alert summaries but may not export full evidentiary Case Files. |
| **BR-005** | Every alert status transition from **Pending Review** to any terminal status (Confirmed, False Positive, Escalated) must be accompanied by a mandatory analyst justification note. Notes must be a minimum of 50 characters in length. |
| **BR-006** | Alert deduplication (FR-017) shall never suppress or discard an alert record permanently. Suppressed alerts must be merged into the primary active alert record and remain accessible in the full audit trail. |
| **BR-007** | The severity score weighting configuration (FR-012) may only be modified by a System Administrator. All changes to weighting configurations shall be recorded in the audit log with the previous and new configuration values. |
| **BR-008** | A user's role assignment may only be created, modified, or revoked by a System Administrator. No user may self-assign or peer-assign role changes. |
| **BR-009** | All personally identifying metadata about analyst actions (analyst name, review notes) embedded within a Case File shall be subject to the access controls of the jurisdiction in which the Case File is to be used. The system shall make case file access logging available to authorized legal representatives upon formal request. |
| **BR-010** | Any alert associated with a Protected Area Incursion (intersection category from FR-010c) shall be automatically assigned a severity score floor of 75 out of 100, regardless of the weighted scoring outcome. |

---

## 12. User Stories

User stories are informal, natural-language descriptions of a feature from the perspective of the end user. They serve as the bridge between stakeholder needs and formal requirements.

| ID | Role | Story | Linked FR(s) |
|---|---|---|---|
| **US-001** | As a **Field Ranger**, I want to receive an immediate notification when a new high-severity alert is generated within my assigned region, so that I can plan a timely field response before the mining site expands further. | FR-013, FR-016 |
| **US-002** | As a **Field Ranger**, I want to view the exact coordinates and a visual map of a flagged site on my screen before departing for the field, so that I can safely plan my approach route without needing specialized GIS software. | FR-018 |
| **US-003** | As an **Environmental Analyst**, I want to compare before-and-after satellite images of a detected change event side-by-side, so that I can make a confident determination about whether the activity is illegal mining or a natural land-cover event. | FR-019 |
| **US-004** | As an **Environmental Analyst**, I want to review the full change history timeline of an alert site, so that I can determine how long the site has been active and assess its progression rate. | FR-020 |
| **US-005** | As an **Environmental Analyst**, I want to update the status of an alert and add a case note, so that I can record my findings and create a clear chain of custody for the investigation record. | FR-015 |
| **US-006** | As an **Environmental Analyst**, I want to compile and export a complete Case File from a confirmed alert, so that I can submit legally credible, well-structured evidence to the prosecution department without manually assembling the documents. | FR-021, FR-022 |
| **US-007** | As an **Environmental Analyst**, I want the system to automatically flag when a detected change crosses or extends beyond a legal concession boundary, so that I can immediately identify the most actionable violations without manually checking maps. | FR-010, FR-013 |
| **US-008** | As an **Operations Director**, I want to view a regional dashboard showing total active alerts, confirmed illegal mining sites, and total deforestation area over the past quarter, so that I can assess the effectiveness of enforcement operations and report to ministry leadership. | FR-024 |
| **US-009** | As an **Operations Director**, I want to see which Areas of Interest have the highest concentration of high-severity alerts this month, so that I can prioritize budget and personnel allocation toward the most critical regions. | FR-024, FR-011 |
| **US-010** | As a **System Administrator**, I want to import and update the concession boundary dataset when the government registry publishes new data, so that the system's intersection analysis always reflects the current legal state of mining concessions. | FR-005 |
| **US-011** | As a **System Administrator**, I want to define a new Area of Interest by drawing a polygon on a map, so that I can bring new high-risk regions under automated monitoring without requiring developer intervention. | FR-004 |
| **US-012** | As a **System Administrator**, I want to configure the severity score factor weightings to match our agency's current enforcement priorities (e.g., weight proximity to water bodies more heavily during dry season), so that the alerts most relevant to current operational conditions surface first. | FR-012 |
| **US-013** | As an **Environmental Analyst**, I want repeated detections of new activity at the same geographic site to be automatically merged into a single, evolving alert rather than generating duplicate entries, so that my triage queue remains manageable and clear. | FR-017 |
| **US-014** | As an **Environmental Analyst**, I want to filter my alert triage queue by intersection category and severity score range, so that I can efficiently focus my review time on the highest-priority protected area incursions. | FR-014 |
| **US-015** | As a **System Administrator**, I want the system to warn me when a concession boundary dataset for an AOI has not been updated in 180 days, so that I can request a fresh boundary file from the government registry before analysts make decisions on potentially outdated data. | BR-003 |

---

## 13. Use Cases

Use Cases describe the interaction sequences between an actor and the system to accomplish a specific goal. Each use case is presented at a system level without specifying implementation.

---

### UC-001 — Receive and Triage a New Alert

| Attribute | Detail |
|---|---|
| **Use Case ID** | UC-001 |
| **Title** | Receive and Triage a New Alert |
| **Primary Actor** | Environmental Analyst (AC-02) |
| **Secondary Actors** | System (generates alert), Field Ranger (AC-01, optional) |
| **Trigger** | The system generates a new alert with a severity score at or above the analyst's configured notification threshold. |
| **Pre-conditions** | (1) AOI is active and has ingested new imagery. (2) Change detection analysis is complete. (3) The generated alert meets the minimum threshold. (4) Analyst is authenticated. |
| **Main Flow** | 1. The system generates an Alert record and issues an in-platform and email notification to assigned Analysts. 2. The Analyst opens the triage workspace and locates the new alert in the queue. 3. The Analyst selects the alert and sets its status to **Under Review.** 4. The Analyst examines the alert detail view, including: coordinates, severity score, intersection category, change area estimate, and before-and-after image comparison. 5. The Analyst reviews the change history timeline for prior activity at the site. 6. Based on the review, the Analyst assigns a terminal status (Confirmed — Illegal, False Positive, etc.) and enters a mandatory justification note. 7. The system records the status transition, the analyst identity, and the timestamp in the immutable audit trail. |
| **Alternative Flow A** | If the Analyst determines the alert requires physical verification before confirmation: at step 6, the Analyst sets the status to **Escalated to Enforcement** and adds the justification note. A notification is issued to the assigned Field Ranger team. |
| **Alternative Flow B** | If the incoming alert's coordinates overlap an existing open alert, the system presents the deduplication prompt. The Analyst confirms or rejects the merge. |
| **Post-conditions** | Alert has a terminal or escalated status. Audit trail is updated. If escalated, Field Rangers are notified. |
| **Linked Requirements** | FR-013, FR-014, FR-015, FR-016, FR-017, FR-019, FR-020 |

---

### UC-002 — Compile and Export a Case File

| Attribute | Detail |
|---|---|
| **Use Case ID** | UC-002 |
| **Title** | Compile and Export a Case File |
| **Primary Actor** | Environmental Analyst (AC-02) |
| **Secondary Actors** | System |
| **Trigger** | Analyst has confirmed an alert as **Confirmed — Illegal Activity** and intends to submit evidence to enforcement authorities. |
| **Pre-conditions** | (1) Alert is in **Confirmed — Illegal Activity** or **Escalated to Enforcement** status. (2) Analyst holds the required role for case file export. (3) Analyst is authenticated. |
| **Main Flow** | 1. Analyst navigates to the confirmed alert and selects the "Compile Case File" action. 2. The system pre-populates the case file with all available alert data, imagery evidence, change polygons, concession intersection results, severity rationale, and the full status audit trail. 3. The Analyst reviews the pre-populated case file, adds supplementary notes, and confirms compilation. 4. The Analyst selects the desired export format (PDF and/or GeoJSON). 5. The system generates and makes the export package available for download. 6. The system records the export event in the case file audit trail. |
| **Alternative Flow** | If the Analyst identifies missing imagery at step 2, the analyst may annotate the gap and proceed. The system flags the case file as having incomplete imagery coverage. |
| **Post-conditions** | A versioned Case File record exists in the system. An export event is logged. The Analyst has a downloaded evidence package. |
| **Linked Requirements** | FR-021, FR-022, FR-023 |

---

### UC-003 — Register a New Area of Interest

| Attribute | Detail |
|---|---|
| **Use Case ID** | UC-003 |
| **Title** | Register a New Area of Interest |
| **Primary Actor** | System Administrator (AC-04) |
| **Secondary Actors** | System |
| **Trigger** | An agency request is received to bring a new geographic region under active monitoring. |
| **Pre-conditions** | (1) Administrator is authenticated. (2) The requested region's geographic coordinates are known. |
| **Main Flow** | 1. Administrator navigates to the AOI management interface. 2. Administrator defines the AOI boundary by drawing a polygon on the map interface or by importing a GeoJSON boundary file. 3. Administrator assigns a human-readable name, a responsible agency identifier, and a monitoring priority level to the AOI. 4. Administrator submits the AOI for activation. 5. The system validates the polygon for geometric correctness and confirms there is no identical duplicate AOI already active. 6. The system activates the AOI and schedules the next available imagery acquisition and baseline establishment. 7. The system records the creation event in the audit log. |
| **Alternative Flow** | If the polygon overlaps an existing active AOI, the system displays a warning. The administrator may proceed (the system supports overlapping AOIs) or modify the boundary. |
| **Post-conditions** | The new AOI is active in the system and will be included in the next change detection processing cycle. |
| **Linked Requirements** | FR-004, FR-006 |

---

### UC-004 — Import and Update Concession Boundary Dataset

| Attribute | Detail |
|---|---|
| **Use Case ID** | UC-004 |
| **Title** | Import and Update Concession Boundary Dataset |
| **Primary Actor** | System Administrator (AC-04) |
| **Secondary Actors** | Concession Registry External System (AC-06) |
| **Trigger** | A government concession registry publishes a new or revised boundary dataset, or the system issues a staleness warning (BR-003). |
| **Pre-conditions** | (1) Administrator is authenticated. (2) A valid boundary dataset file (GeoJSON, KML, or Shapefile) is available. |
| **Main Flow** | 1. Administrator navigates to the boundary dataset management interface. 2. Administrator selects the relevant AOI and uploads the new boundary dataset file. 3. The system validates the file format and geographic coordinate system. 4. The system displays a diff preview showing added, removed, and modified boundaries relative to the current active dataset. 5. Administrator reviews the diff and confirms the import. 6. The system versions the existing dataset (marks it as superseded) and activates the new dataset with its validity timestamp. 7. The system clears any **"Boundary Data May Be Stale"** warnings for the affected AOI. 8. The system records the import in the audit log. |
| **Alternative Flow** | If file format validation fails, the system returns a descriptive error and no dataset is changed. |
| **Post-conditions** | The new boundary dataset is active. All future alert intersection analyses for that AOI use the new dataset. The old dataset is archived and remains accessible for historical audit purposes. |
| **Linked Requirements** | FR-005, BR-003, BR-007 |

---

### UC-005 — View Operational Reporting Dashboard

| Attribute | Detail |
|---|---|
| **Use Case ID** | UC-005 |
| **Title** | View Operational Reporting Dashboard |
| **Primary Actor** | Operations Director (AC-03) |
| **Secondary Actors** | System |
| **Trigger** | Operations Director requires a periodic situational overview for operational planning or ministerial reporting. |
| **Pre-conditions** | (1) Operations Director is authenticated. (2) The system has processed alerts within the requested reporting period. |
| **Main Flow** | 1. Operations Director navigates to the reporting dashboard. 2. Director selects the desired date range, AOI filter, and intersection category filters. 3. The system renders: total alert count by category, confirmed illegal mining site count, aggregate deforestation area estimate, alert outcome breakdown (confirmed, false positive rates), and a geographic heat map of alert concentration. 4. Director may drill down into a specific AOI to view its detail metrics. 5. Director may export the dashboard view as a summary PDF report. |
| **Alternative Flow** | If no alerts exist for the selected filter period, the system displays a zero-state message. |
| **Post-conditions** | Director has reviewed the requested metrics. If exported, a report PDF is available for download. |
| **Linked Requirements** | FR-024 |

---

### UC-006 — Manage User Accounts and Role Assignments

| Attribute | Detail |
|---|---|
| **Use Case ID** | UC-006 |
| **Title** | Manage User Accounts and Role Assignments |
| **Primary Actor** | System Administrator (AC-04) |
| **Secondary Actors** | System |
| **Trigger** | A new user joins the agency and requires system access, or an existing user's role must be changed or revoked. |
| **Pre-conditions** | (1) Administrator is authenticated. |
| **Main Flow** | 1. Administrator navigates to the user management interface. 2. To create a user: Administrator enters the new user's name, organizational email, assigned agency, and selects one of the permitted roles (Field Ranger, Analyst, Operations Director, System Administrator). 3. System generates a secure credential invitation and dispatches it to the new user's email. 4. To modify a role: Administrator searches for the existing user, selects the new role, and confirms. The system records the role change in the audit log. 5. To deactivate a user: Administrator selects the deactivate action. The user's active sessions are immediately terminated. The user's historical actions and audit records are preserved. |
| **Alternative Flow** | If the email address is already registered in the system, the system prevents duplicate account creation and displays an appropriate message. |
| **Post-conditions** | The user account reflects the intended state. All changes are recorded in the audit log. |
| **Linked Requirements** | NFR-008, NFR-010, NFR-011, BR-008, C-05 |

---

### UC-007 — View and Navigate Alert Map

| Attribute | Detail |
|---|---|
| **Use Case ID** | UC-007 |
| **Title** | View and Navigate Alert Map |
| **Primary Actor** | Field Ranger (AC-01) |
| **Secondary Actors** | System |
| **Trigger** | A Field Ranger receives an escalation notification and requires geographic situational awareness before departing for the field. |
| **Pre-conditions** | (1) Field Ranger is authenticated. (2) An alert with **Escalated to Enforcement** status is assigned to the ranger's region. |
| **Main Flow** | 1. Ranger opens the map interface and navigates to the alert marker. 2. The map displays the alert's geographic location, change boundary polygon, and concession intersection status overlaid on a base map. 3. The Ranger selects the alert to view the alert summary panel: coordinates, severity score, intersection category, estimated site area, and brief analyst notes. 4. The Ranger zooms in to assess surrounding terrain and identify nearest access points. 5. The Ranger selects "Generate Field Briefing" to produce a printable single-page summary. |
| **Post-conditions** | The Ranger has sufficient situational awareness to safely plan the field operation. A field briefing document is generated if requested. |
| **Linked Requirements** | FR-018, FR-013, NFR-012 |

---

### UC-008 — Configure Alert Severity Weighting

| Attribute | Detail |
|---|---|
| **Use Case ID** | UC-008 |
| **Title** | Configure Alert Severity Weighting |
| **Primary Actor** | System Administrator (AC-04) |
| **Secondary Actors** | System |
| **Trigger** | The agency's enforcement priorities change seasonally or by policy directive, requiring rebalancing of severity scoring factors. |
| **Pre-conditions** | (1) Administrator is authenticated. |
| **Main Flow** | 1. Administrator navigates to the severity score configuration interface. 2. The system displays the current weighting for each of the configured severity factors. 3. Administrator adjusts the weights for one or more factors. 4. The system validates that the sum of all weights equals 100%. 5. Administrator previews how the new weighting would have scored the last 20 historical alerts relative to the current weighting. 6. Administrator confirms the new configuration. 7. The system activates the new weighting for all future alert calculations and records the change in the audit log with both the previous and new configuration values. |
| **Alternative Flow** | If submitted weights do not sum to 100%, the system highlights the discrepancy and blocks confirmation until corrected. |
| **Post-conditions** | New severity weighting is active. All subsequent alerts will be scored using the updated configuration. Historical alert scores are not retroactively changed. |
| **Linked Requirements** | FR-012, BR-007 |

---

## 14. Acceptance Criteria

Acceptance Criteria define the verifiable conditions that must be met for a requirement or user story to be formally accepted as complete during quality assurance and user acceptance testing.

---

| ID | Linked Requirement / Use Case | Acceptance Criteria |
|---|---|---|
| **AC-001** | FR-001 / FR-003 | Given: An open-access imagery scene covering an active AOI is published by the data provider. When: The scene is ingested by the system. Then: A timestamped ingestion log entry exists with the correct source identifier, acquisition date, scene footprint, and cloud cover percentage. The log entry must appear within 4 hours of the scene's availability at the data source. |
| **AC-002** | FR-004 | Given: An Administrator draws a polygon on the AOI interface. When: The Administrator submits the new AOI. Then: The AOI is active in the system within 60 seconds. The polygon is persisted correctly in WGS84. The AOI appears on the map interface and in the AOI management list. |
| **AC-003** | FR-005 | Given: An Administrator uploads a valid GeoJSON concession boundary file. When: The import is confirmed. Then: The new boundary dataset is active. The previous dataset is versioned and marked superseded but remains accessible. A diff summary was presented prior to confirmation. The import is recorded in the audit log with a timestamp. |
| **AC-004** | FR-007 / FR-013 | Given: A new imagery pair is processed for an active AOI and a land-cover change event of a type listed in FR-007(a)–(d) is present. When: Change detection analysis completes. Then: An alert is generated within 72 hours of imagery ingestion. The alert record contains coordinates, change area, severity score, intersection category, and acquisition dates. |
| **AC-005** | FR-010 | Given: A change event is detected adjacent to or within a registered protected area. When: The intersection analysis runs. Then: The alert is classified as **Protected Area Incursion** and its severity score is set to a minimum floor of 75 (per BR-010), regardless of weighted scoring. |
| **AC-006** | FR-011 / FR-012 | Given: An Administrator modifies a severity score factor weight. When: A subsequent alert is generated. Then: The alert's severity score reflects the new weighting. The change to the configuration is recorded in the audit log with both old and new values. |
| **AC-007** | FR-014 / FR-015 | Given: An Analyst opens the triage workspace. When: The Analyst filters alerts by intersection category "Protected Area Incursion" and sets status to "Confirmed — Illegal Activity" with a justification note of at least 50 characters. Then: Only alerts matching the filter are displayed. The status transition is recorded in the audit trail with analyst identity, timestamp, and justification note. |
| **AC-008** | FR-017 | Given: The system detects change events in consecutive observation cycles that overlap geographically by more than a configurable threshold percentage. When: Processing runs. Then: A deduplication prompt is presented for analyst confirmation. Upon confirmation, the events are merged into a single evolving alert. No prior alert record is deleted — the merge history is retained in the audit trail. |
| **AC-009** | FR-019 | Given: An Analyst selects an alert and opens the image comparison view. When: The comparison loads. Then: The before-image (most recent pre-change acquisition) and the after-image (change acquisition) are displayed simultaneously or with a swipe interface. The detected change polygon is rendered as an overlay on both images. Load time is under 5 seconds. |
| **AC-010** | FR-021 / FR-022 | Given: An Analyst initiates case file compilation on a Confirmed — Illegal Activity alert. When: The Analyst confirms and selects PDF export. Then: A downloadable PDF is generated containing all required elements: imagery, change polygons, coordinates, severity rationale, intersection classification, analyst notes, and full status audit trail. The PDF must be legible and correctly formatted. |
| **AC-011** | FR-023 | Given: A Case File has been exported by an Analyst. When: An Administrator reviews the case file audit trail. Then: The audit trail contains an entry recording the export action, the exporting analyst's identity, the timestamp, and the format of the export. This record cannot be deleted or modified. |
| **AC-012** | FR-024 | Given: An Operations Director opens the reporting dashboard and selects a 90-day date range. When: The dashboard renders. Then: The view displays total alert counts by intersection category, confirmed illegal mining counts, total deforestation area estimate in hectares, and the alert outcome breakdown, all filtered to the selected date range. Render time is under 5 seconds. |
| **AC-013** | NFR-001 | Given: Imagery is confirmed ingested at timestamp T. When: The change detection pipeline processes the imagery. Then: If a qualifying change event is present, an alert is created by timestamp T + 72 hours or earlier. This must hold for 95% of qualifying events measured over any rolling 30-day period. |
| **AC-014** | NFR-006 | Given: The system is in normal operational mode. When: System availability is measured over any calendar month. Then: The system is accessible and functional for ≥ 99.5% of the hours in that month, excluding pre-announced maintenance windows. |
| **AC-015** | NFR-008 | Given: A user authenticated as Field Ranger attempts to access the Case File export function. When: The request is submitted. Then: The system denies access and presents an appropriate permission-denied message. No case file data is exposed. |
| **AC-016** | NFR-012 | Given: A new Field Ranger user with no prior GIS training completes the onboarding tutorial (≤ 30 minutes). When: The user independently attempts to locate a high-severity alert on the map, open the image comparison view, and generate a field briefing export. Then: The user completes all three tasks successfully without requesting external assistance, within 30 minutes of tutorial completion. This criterion must be validated by usability testing with a minimum of 5 representative users. |
| **AC-017** | BR-003 | Given: A concession boundary dataset for an AOI has not been updated for 180 calendar days. When: Any analyst views an alert in that AOI. Then: A visible, non-dismissible warning banner reading **"Boundary Data May Be Stale — Last Updated [date]"** appears on all alert views for that AOI. |
| **AC-018** | BR-010 | Given: A change event is detected within a registered Protected Area boundary. When: The severity score is calculated. Then: The final severity score for the resulting alert is no lower than 75 out of 100, regardless of individual weighted factor scores. |

---

## 15. Requirement Traceability Matrix (RTM)

The RTM establishes bidirectional traceability between the Problem Definition (PRD), Functional Requirements (FR), Non-Functional Requirements (NFR), Business Rules (BR), User Stories (US), Use Cases (UC), and Acceptance Criteria (AC).

| Requirement ID | Requirement Title | PRD Source | Linked User Stories | Linked Use Cases | Acceptance Criteria |
|---|---|---|---|---|---|
| **FR-001** | Satellite Imagery Ingestion | PRD §8, §10 | — | UC-003 | AC-001 |
| **FR-002** | Multi-Source Ingestion Support | PRD §8, §13 (Risks) | — | — | — |
| **FR-003** | Ingestion Audit Log | PRD §9 | — | — | AC-001 |
| **FR-004** | AOI Registration and Management | PRD §8, §10 | US-011 | UC-003 | AC-002 |
| **FR-005** | Concession Boundary Import | PRD §8, §10 | US-010 | UC-004 | AC-003 |
| **FR-006** | Historical Imagery Baseline | PRD §8 | US-004 | UC-003 | — |
| **FR-007** | Land-Cover Change Detection | PRD §8 | US-003 | — | AC-004 |
| **FR-008** | Change Area Quantification | PRD §8, §12 | — | — | — |
| **FR-009** | Change Velocity Measurement | PRD §8 | US-004 | — | — |
| **FR-010** | Concession Boundary Intersection | PRD §8 | US-007 | — | AC-005 |
| **FR-011** | Severity Score Assignment | PRD §8 | US-009, US-014 | — | AC-006 |
| **FR-012** | Severity Score Configurability | PRD §8, §9 | US-012 | UC-008 | AC-006 |
| **FR-013** | Alert Generation | PRD §8 | US-001, US-007 | UC-001, UC-007 | AC-004 |
| **FR-014** | Alert Queue and Triage Workspace | PRD §8 | US-014 | UC-001 | AC-007 |
| **FR-015** | Alert Status Management | PRD §8 | US-005 | UC-001 | AC-007 |
| **FR-016** | Alert Notification | PRD §8 | US-001 | UC-001 | — |
| **FR-017** | Alert Deduplication | PRD §8 | US-013 | UC-001 | AC-008 |
| **FR-018** | Interactive Map Interface | PRD §8, §9 | US-002 | UC-007 | — |
| **FR-019** | Multi-Temporal Image Comparison | PRD §8 | US-003 | UC-001 | AC-009 |
| **FR-020** | Change History Timeline | PRD §8 | US-004 | UC-001 | — |
| **FR-021** | Case File Compilation | PRD §8, §12 | US-006 | UC-002 | AC-010 |
| **FR-022** | Case File Export | PRD §9, §12 | US-006 | UC-002 | AC-010 |
| **FR-023** | Case File Versioning and Audit | PRD §9, §12 | — | UC-002 | AC-011 |
| **FR-024** | Operational Dashboard | PRD §8 | US-008, US-009 | UC-005 | AC-012 |
| **NFR-001** | Alert Generation Latency | PRD §9 | — | — | AC-013 |
| **NFR-002** | Interface Responsiveness | PRD §9 | — | — | — |
| **NFR-003** | Change Detection Throughput | PRD §9 | — | — | — |
| **NFR-004** | Geographic Coverage Scalability | PRD §9, §10 | — | — | — |
| **NFR-005** | User Concurrency | PRD §9 | — | — | — |
| **NFR-006** | System Availability | PRD §9 | — | — | AC-014 |
| **NFR-007** | Data Durability | PRD §9 | — | — | — |
| **NFR-008** | Role-Based Access Control | PRD §9, C-05 | — | UC-006 | AC-015 |
| **NFR-009** | Data Encryption | PRD §9 | — | — | — |
| **NFR-010** | Authentication | PRD §9 | — | UC-006 | — |
| **NFR-011** | Audit Logging | PRD §9 | — | UC-006 | AC-011 |
| **NFR-012** | Learnability | PRD §9 | — | UC-007 | AC-016 |
| **BR-001** | No Autonomous Escalation | PRD §11 | US-005 | UC-001 | — |
| **BR-002** | In-Concession Alert Suppression | PRD §8, §10 | US-007 | — | — |
| **BR-003** | Boundary Dataset Staleness Warning | PRD §13 | US-015 | UC-004 | AC-017 |
| **BR-004** | Case File Export Role Restriction | PRD §9 | US-006 | UC-002 | AC-015 |
| **BR-005** | Mandatory Justification Note | PRD §8 | US-005 | UC-001 | AC-007 |
| **BR-006** | Alert Deduplication Audit Preservation | PRD §8 | US-013 | UC-001 | AC-008 |
| **BR-007** | Severity Weighting Change Logging | PRD §9 | US-012 | UC-008 | AC-006 |
| **BR-008** | Role Assignment by Admin Only | PRD §9 | — | UC-006 | — |
| **BR-009** | Case File Access Logging for Legal | PRD §12 | US-006 | UC-002 | AC-011 |
| **BR-010** | Protected Area Incursion Score Floor | PRD §8, §12 | US-007, US-014 | — | AC-018 |

---

*End of Document — SRS-SIMDS-001 v1.0.0*

*This document is subject to formal change control. Any modification must be submitted as a Change Request, reviewed by the Principal Architect and Head of Engineering, and re-versioned before distribution.*
