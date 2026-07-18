// =============================================================================
// SAT-MSS Shared Constants
// All enums, status codes, business rule constants, and configuration constants.
// =============================================================================

// -----------------------------------------------------------------------------
// User Roles & Permissions
// -----------------------------------------------------------------------------

export const USER_ROLES = {
  FIELD_RANGER: 'FIELD_RANGER',
  ANALYST: 'ANALYST',
  DIRECTOR: 'DIRECTOR',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/** Role hierarchy — higher index = more permissions */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  FIELD_RANGER: 0,
  ANALYST: 1,
  DIRECTOR: 2,
  ADMIN: 3,
};

/** Minimum role required per action */
export const REQUIRED_ROLES = {
  CREATE_AOI: USER_ROLES.ADMIN,
  EDIT_AOI: USER_ROLES.ADMIN,
  DELETE_AOI: USER_ROLES.ADMIN,
  RUN_ANALYSIS: USER_ROLES.ANALYST,
  UPDATE_ALERT_STATUS: USER_ROLES.ANALYST,
  CREATE_CASE_FILE: USER_ROLES.ANALYST,
  EXPORT_CASE_FILE: USER_ROLES.ANALYST,
  VIEW_DASHBOARD: USER_ROLES.DIRECTOR,
  MANAGE_USERS: USER_ROLES.ADMIN,
  MANAGE_BOUNDARIES: USER_ROLES.ADMIN,
  CONFIGURE_SEVERITY: USER_ROLES.ADMIN,
} as const;

// -----------------------------------------------------------------------------
// AOI
// -----------------------------------------------------------------------------

export const AOI_PRIORITY = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;

export const AOI_PRIORITY_COLORS = {
  HIGH: '#C94040',
  MEDIUM: '#E88C30',
  LOW: '#2D8653',
} as const;

export const AOI_MIN_VERTICES = 3;
export const AOI_MAX_ACTIVE_COUNT = 100; // System-wide maximum
export const AOI_NAME_MAX_LENGTH = 100;

// -----------------------------------------------------------------------------
// Analysis
// -----------------------------------------------------------------------------

export const ANALYSIS_SENSITIVITY = {
  STANDARD: 'STANDARD',
  HIGH: 'HIGH',
} as const;

export const ANALYSIS_STATUS = {
  QUEUED: 'QUEUED',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export const ANALYSIS_PHASES = {
  SCENE_LOAD: 'SCENE_LOAD',
  PREPROCESSING: 'PREPROCESSING',
  NDVI_CALCULATION: 'NDVI_CALCULATION',
  CHANGE_DETECTION: 'CHANGE_DETECTION',
  ZONE_EXTRACTION: 'ZONE_EXTRACTION',
  CLASSIFICATION: 'CLASSIFICATION',
  INTERSECTION_CHECK: 'INTERSECTION_CHECK',
  SEVERITY_SCORING: 'SEVERITY_SCORING',
  FINALIZING: 'FINALIZING',
} as const;

export const ANALYSIS_PHASE_PROGRESS: Record<string, number> = {
  SCENE_LOAD: 10,
  PREPROCESSING: 20,
  NDVI_CALCULATION: 35,
  CHANGE_DETECTION: 55,
  ZONE_EXTRACTION: 70,
  CLASSIFICATION: 80,
  INTERSECTION_CHECK: 88,
  SEVERITY_SCORING: 95,
  FINALIZING: 100,
};

// -----------------------------------------------------------------------------
// Change Detection
// -----------------------------------------------------------------------------

export const CHANGE_TYPE = {
  VEGETATION_LOSS: 'VEGETATION_LOSS',
  BARE_EARTH: 'BARE_EARTH',
  WATER_BODY: 'WATER_BODY',
  ACCESS_ROAD: 'ACCESS_ROAD',
} as const;

export const CHANGE_TYPE_COLORS = {
  VEGETATION_LOSS: '#FF4C29',
  BARE_EARTH: '#FF8C42',
  WATER_BODY: '#FFD166',
  ACCESS_ROAD: '#06D6A0',
} as const;

export const CHANGE_TYPE_LABELS = {
  VEGETATION_LOSS: 'Vegetation Loss',
  BARE_EARTH: 'Exposed Bare Earth',
  WATER_BODY: 'New Water / Tailings Pond',
  ACCESS_ROAD: 'Access Road Construction',
} as const;

// -----------------------------------------------------------------------------
// Intersection Category
// -----------------------------------------------------------------------------

export const INTERSECTION_CATEGORY = {
  FULLY_WITHIN_CONCESSION: 'FULLY_WITHIN_CONCESSION',
  CONCESSION_VIOLATION: 'CONCESSION_VIOLATION',
  PROTECTED_AREA_INCURSION: 'PROTECTED_AREA_INCURSION',
  NO_CONCESSION_OVERLAP: 'NO_CONCESSION_OVERLAP',
} as const;

export const INTERSECTION_CATEGORY_LABELS = {
  FULLY_WITHIN_CONCESSION: 'Within Licensed Concession',
  CONCESSION_VIOLATION: 'Concession Boundary Violation',
  PROTECTED_AREA_INCURSION: 'Protected Area Incursion',
  NO_CONCESSION_OVERLAP: 'No Concession Overlap',
} as const;

export const INTERSECTION_CATEGORY_COLORS = {
  FULLY_WITHIN_CONCESSION: '#2D8653',
  CONCESSION_VIOLATION: '#E88C30',
  PROTECTED_AREA_INCURSION: '#C94040',
  NO_CONCESSION_OVERLAP: '#8A9BBB',
} as const;

// -----------------------------------------------------------------------------
// Alert Status
// -----------------------------------------------------------------------------

export const ALERT_STATUS = {
  PENDING_REVIEW: 'PENDING_REVIEW',
  UNDER_REVIEW: 'UNDER_REVIEW',
  CONFIRMED_ILLEGAL: 'CONFIRMED_ILLEGAL',
  CONFIRMED_LEGAL: 'CONFIRMED_LEGAL',
  FALSE_POSITIVE_NATURAL: 'FALSE_POSITIVE_NATURAL',
  FALSE_POSITIVE_DATA_ERROR: 'FALSE_POSITIVE_DATA_ERROR',
  ESCALATED_TO_ENFORCEMENT: 'ESCALATED_TO_ENFORCEMENT',
} as const;

export type AlertStatus = (typeof ALERT_STATUS)[keyof typeof ALERT_STATUS];

/** Valid status transitions — key: current status, value: allowed next statuses */
export const ALERT_STATUS_TRANSITIONS: Record<AlertStatus, AlertStatus[]> = {
  PENDING_REVIEW: ['UNDER_REVIEW'],
  UNDER_REVIEW: [
    'CONFIRMED_ILLEGAL',
    'CONFIRMED_LEGAL',
    'FALSE_POSITIVE_NATURAL',
    'FALSE_POSITIVE_DATA_ERROR',
    'ESCALATED_TO_ENFORCEMENT',
  ],
  CONFIRMED_ILLEGAL: ['ESCALATED_TO_ENFORCEMENT'],
  CONFIRMED_LEGAL: [],
  FALSE_POSITIVE_NATURAL: [],
  FALSE_POSITIVE_DATA_ERROR: [],
  ESCALATED_TO_ENFORCEMENT: [],
};

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  PENDING_REVIEW: 'Pending Review',
  UNDER_REVIEW: 'Under Review',
  CONFIRMED_ILLEGAL: 'Confirmed — Illegal Activity',
  CONFIRMED_LEGAL: 'Confirmed — Legal Activity',
  FALSE_POSITIVE_NATURAL: 'False Positive — Natural Event',
  FALSE_POSITIVE_DATA_ERROR: 'False Positive — Data Error',
  ESCALATED_TO_ENFORCEMENT: 'Escalated to Enforcement',
};

export const ALERT_JUSTIFICATION_MIN_LENGTH = 50;

// Alerts in these statuses are eligible for Case File creation
export const CASE_FILE_ELIGIBLE_STATUSES: AlertStatus[] = [
  'CONFIRMED_ILLEGAL',
  'ESCALATED_TO_ENFORCEMENT',
];

// -----------------------------------------------------------------------------
// Severity Score
// -----------------------------------------------------------------------------

export const SEVERITY_BANDS = [
  { min: 1, max: 30, label: 'Low', color: '#2D8653' },
  { min: 31, max: 55, label: 'Moderate', color: '#8BC34A' },
  { min: 56, max: 70, label: 'Elevated', color: '#E88C30' },
  { min: 71, max: 85, label: 'High', color: '#D4541A' },
  { min: 86, max: 100, label: 'Critical', color: '#C94040' },
] as const;

/** Business rule BR-010: Protected Area Incursion zones receive minimum severity of 75 */
export const PROTECTED_AREA_INCURSION_MIN_SEVERITY = 75;

export const DEFAULT_ALERT_SEVERITY_THRESHOLD = 40;
export const DEFAULT_EMAIL_NOTIFICATION_THRESHOLD = 70;

/** Default severity factor weights — must sum to 100 */
export const DEFAULT_SEVERITY_WEIGHTS = [
  { factorName: 'change_area', factorLabel: 'Detected Change Area', weightPct: 25 },
  { factorName: 'change_velocity', factorLabel: 'Rate of Change Expansion', weightPct: 20 },
  { factorName: 'dist_protected_area', factorLabel: 'Distance to Protected Area', weightPct: 20 },
  { factorName: 'dist_water_body', factorLabel: 'Distance to Water Body', weightPct: 10 },
  { factorName: 'intersection_category', factorLabel: 'Intersection Category', weightPct: 15 },
  { factorName: 'proximity_known_site', factorLabel: 'Proximity to Known Sites', weightPct: 10 },
] as const;

// -----------------------------------------------------------------------------
// Satellite / Imagery
// -----------------------------------------------------------------------------

export const SATELLITE_SOURCE = {
  SENTINEL_2A: 'SENTINEL_2A',
  SENTINEL_2B: 'SENTINEL_2B',
  SENTINEL_1A: 'SENTINEL_1A',
  SENTINEL_1B: 'SENTINEL_1B',
} as const;

export const SATELLITE_LABELS = {
  SENTINEL_2A: 'Sentinel-2A · MSI',
  SENTINEL_2B: 'Sentinel-2B · MSI',
  SENTINEL_1A: 'Sentinel-1A · SAR-C',
  SENTINEL_1B: 'Sentinel-1B · SAR-C',
} as const;

export const BAND_COMPOSITE = {
  NATURAL_COLOR: 'NATURAL_COLOR',
  FALSE_COLOR_NIR: 'FALSE_COLOR_NIR',
  SWIR: 'SWIR',
  SAR: 'SAR',
} as const;

export const BAND_COMPOSITE_LABELS = {
  NATURAL_COLOR: 'Natural Color (4-3-2)',
  FALSE_COLOR_NIR: 'False Color NIR (8-4-3)',
  SWIR: 'SWIR (12-8-4)',
  SAR: 'SAR Backscatter',
} as const;

export const MAX_CLOUD_COVER_DEFAULT = 30;
export const IMAGERY_HISTORICAL_MONTHS = 24;

// -----------------------------------------------------------------------------
// Boundary
// -----------------------------------------------------------------------------

export const BOUNDARY_DATASET_TYPE = {
  CONCESSION: 'CONCESSION',
  PROTECTED_AREA: 'PROTECTED_AREA',
} as const;

/** Boundary dataset staleness threshold in days */
export const BOUNDARY_STALENESS_THRESHOLD_DAYS = 180;

// -----------------------------------------------------------------------------
// Case File
// -----------------------------------------------------------------------------

export const CASE_FILE_STATUS = {
  DRAFT: 'DRAFT',
  COMPLETE: 'COMPLETE',
  EXPORTED: 'EXPORTED',
} as const;

export const CASE_FILE_MIN_EVIDENCE_IMAGES = 2;
export const CASE_FILE_MAX_EVIDENCE_IMAGES = 6;
export const CASE_FILE_MIN_ANALYST_NOTES_LENGTH = 100;
export const CASE_FILE_AUDIT_RETENTION_YEARS = 10;
export const CASE_FILE_REFERENCE_FORMAT = 'CF-YYYY-XXXX';

// -----------------------------------------------------------------------------
// Deduplication
// -----------------------------------------------------------------------------

/** Overlap ratio above which two alerts are flagged as potential duplicates */
export const DEDUPLICATION_OVERLAP_THRESHOLD = 0.6;
/** Look-back window for deduplication in days */
export const DEDUPLICATION_LOOKBACK_DAYS = 90;

// -----------------------------------------------------------------------------
// WebSocket Event Names
// -----------------------------------------------------------------------------

export const WS_EVENTS = {
  ANALYSIS_PROGRESS: 'analysis:progress',
  ANALYSIS_COMPLETE: 'analysis:complete',
  ANALYSIS_FAILED: 'analysis:failed',
  ALERT_NEW: 'alert:new',
  NOTIFICATION_NEW: 'notification:new',
  EXPORT_READY: 'export:ready',
} as const;

// -----------------------------------------------------------------------------
// Error Codes
// -----------------------------------------------------------------------------

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
  JUSTIFICATION_TOO_SHORT: 'JUSTIFICATION_TOO_SHORT',
  MISSING_REQUIRED_FIELDS: 'MISSING_REQUIRED_FIELDS',
  WEIGHTS_DO_NOT_SUM_TO_100: 'WEIGHTS_DO_NOT_SUM_TO_100',
  ANALYSIS_ALREADY_RUNNING: 'ANALYSIS_ALREADY_RUNNING',
  CASE_FILE_ALREADY_EXISTS: 'CASE_FILE_ALREADY_EXISTS',
  INVALID_ALERT_STATUS: 'INVALID_ALERT_STATUS',
  INVALID_FILE_FORMAT: 'INVALID_FILE_FORMAT',
  SYNC_ALREADY_IN_PROGRESS: 'SYNC_ALREADY_IN_PROGRESS',
  CANNOT_DEACTIVATE_SELF: 'CANNOT_DEACTIVATE_SELF',
  CANNOT_MERGE_INTO_SELF: 'CANNOT_MERGE_INTO_SELF',
} as const;

// -----------------------------------------------------------------------------
// India State Codes (ISO 3166-2:IN)
// -----------------------------------------------------------------------------

export const INDIA_STATE_CODES: Record<string, string> = {
  AN: 'Andaman and Nicobar Islands',
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CH: 'Chandigarh',
  CG: 'Chhattisgarh',
  DN: 'Dadra and Nagar Haveli and Daman and Diu',
  DL: 'Delhi',
  GA: 'Goa',
  GJ: 'Gujarat',
  HR: 'Haryana',
  HP: 'Himachal Pradesh',
  JK: 'Jammu and Kashmir',
  JH: 'Jharkhand',
  KA: 'Karnataka',
  KL: 'Kerala',
  LA: 'Ladakh',
  LD: 'Lakshadweep',
  MP: 'Madhya Pradesh',
  MH: 'Maharashtra',
  MN: 'Manipur',
  ML: 'Meghalaya',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OD: 'Odisha',
  PY: 'Puducherry',
  PB: 'Punjab',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TN: 'Tamil Nadu',
  TS: 'Telangana',
  TR: 'Tripura',
  UP: 'Uttar Pradesh',
  UK: 'Uttarakhand',
  WB: 'West Bengal',
} as const;
