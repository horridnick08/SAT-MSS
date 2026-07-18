export type UserRole = 'FIELD_RANGER' | 'ANALYST' | 'DIRECTOR' | 'ADMIN';
export type AoiPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type AoiStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
export type SatelliteSource = 'SENTINEL_2A' | 'SENTINEL_2B' | 'SENTINEL_1A' | 'SENTINEL_1B';
export type BandComposite = 'NATURAL_COLOR' | 'FALSE_COLOR_NIR' | 'SWIR' | 'SAR';
export type BoundaryDatasetType = 'CONCESSION' | 'PROTECTED_AREA';
export type AnalysisStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export type AnalysisSensitivity = 'STANDARD' | 'HIGH';
export type AnalysisPhase = 'SCENE_LOAD' | 'PREPROCESSING' | 'NDVI_CALCULATION' | 'CHANGE_DETECTION' | 'ZONE_EXTRACTION' | 'CLASSIFICATION' | 'INTERSECTION_CHECK' | 'SEVERITY_SCORING' | 'FINALIZING';
export type ChangeType = 'VEGETATION_LOSS' | 'BARE_EARTH' | 'WATER_BODY' | 'ACCESS_ROAD';
export type IntersectionCategory = 'FULLY_WITHIN_CONCESSION' | 'CONCESSION_VIOLATION' | 'PROTECTED_AREA_INCURSION' | 'NO_CONCESSION_OVERLAP';
export type AlertStatus = 'PENDING_REVIEW' | 'UNDER_REVIEW' | 'CONFIRMED_ILLEGAL' | 'CONFIRMED_LEGAL' | 'FALSE_POSITIVE_NATURAL' | 'FALSE_POSITIVE_DATA_ERROR' | 'ESCALATED_TO_ENFORCEMENT';
export type CaseFileStatus = 'DRAFT' | 'COMPLETE' | 'EXPORTED';
export type NotificationType = 'IN_PLATFORM' | 'EMAIL';
export type ExportFormat = 'PDF' | 'GEOJSON';
export type ExportJobStatus = 'QUEUED' | 'GENERATING' | 'READY' | 'FAILED';
export type AuditAction = 'VIEW' | 'EDIT' | 'EXPORT_PDF' | 'EXPORT_GEOJSON' | 'STATUS_CHANGE';
export interface GeoJSONPoint {
    type: 'Point';
    coordinates: [number, number];
}
export interface GeoJSONPolygon {
    type: 'Polygon';
    coordinates: Array<Array<[number, number]>>;
}
export interface GeoJSONMultiPolygon {
    type: 'MultiPolygon';
    coordinates: Array<Array<Array<[number, number]>>>;
}
export type GeoJSONGeometry = GeoJSONPoint | GeoJSONPolygon | GeoJSONMultiPolygon;
export interface GeoJSONFeature<G extends GeoJSONGeometry = GeoJSONGeometry, P = Record<string, unknown>> {
    type: 'Feature';
    geometry: G;
    properties: P;
}
export interface GeoJSONFeatureCollection<G extends GeoJSONGeometry = GeoJSONGeometry, P = Record<string, unknown>> {
    type: 'FeatureCollection';
    features: Array<GeoJSONFeature<G, P>>;
}
export interface ApiSuccessResponse<T> {
    data: T;
}
export interface ApiPaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}
export interface ApiErrorResponse {
    error: {
        code: string;
        message: string;
        details?: Array<{
            field: string;
            message: string;
        }>;
    };
}
export interface IUser {
    id: string;
    email: string;
    name: string;
    organization: string;
    role: UserRole;
    isActive: boolean;
    notificationThreshold: number;
    lastLoginAt: string | null;
    createdAt: string;
}
export interface IAuthUser extends IUser {
}
export interface ILoginRequest {
    email: string;
    password: string;
}
export interface ILoginResponse {
    token: string;
    refreshToken: string;
    user: IUser;
}
export interface IAoi {
    id: string;
    name: string;
    geometry: GeoJSONPolygon;
    stateCode: string;
    stateName: string;
    districtName: string;
    priority: AoiPriority;
    isActive: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}
export interface IAoiWithStats extends IAoi {
    alertCount: number;
    pendingAlertCount: number;
    lastAnalysisDate: string | null;
    lastImageryDate: string | null;
    areaHa: number;
}
export interface ICreateAoiRequest {
    name: string;
    geometry: GeoJSONPolygon;
    stateCode: string;
    districtName: string;
    priority: AoiPriority;
}
export interface IUpdateAoiRequest {
    name?: string;
    priority?: AoiPriority;
    isActive?: boolean;
}
export interface IImageryScene {
    id: string;
    aoiId: string;
    satelliteSource: SatelliteSource;
    tileId: string;
    acquisitionDate: string;
    acquisitionDatetime: string;
    cloudCoverPct: number;
    processingLevel: string;
    storagePath: string;
    footprint: GeoJSONPolygon;
    availableBands: string[];
    solarElevationDeg: number | null;
    createdAt: string;
}
export interface ISceneTileUrl {
    url: string;
    expiresAt: string;
    composite: BandComposite;
}
export interface IBoundaryDataset {
    id: string;
    name: string;
    type: BoundaryDatasetType;
    stateCode: string;
    validityDate: string;
    isActive: boolean;
    polygonCount: number;
    importedBy: string;
    importedAt: string;
    isStale: boolean;
}
export interface IBoundaryPolygon {
    id: string;
    datasetId: string;
    name: string;
    permitNumber: string | null;
    permitStatus: string | null;
    geometry: GeoJSONMultiPolygon;
    maxDisturbanceHa: number | null;
}
export interface IAnalysisRun {
    id: string;
    aoiId: string;
    baselineSceneId: string;
    targetSceneId: string;
    sensitivityLevel: AnalysisSensitivity;
    status: AnalysisStatus;
    progressPct: number;
    currentPhase: AnalysisPhase | null;
    triggeredBy: string;
    startedAt: string | null;
    completedAt: string | null;
    errorMessage: string | null;
    createdAt: string;
}
export interface ICreateAnalysisRequest {
    baselineSceneId: string;
    targetSceneId: string;
    sensitivityLevel: AnalysisSensitivity;
}
export interface IChangeZone {
    id: string;
    runId: string;
    changeType: ChangeType;
    geometry: GeoJSONPolygon;
    areaSqm: number;
    areaHa: number;
    centroid: GeoJSONPoint;
    intersectionCategory: IntersectionCategory;
    distToProtectedAreaM: number;
    distToWaterBodyM: number;
    ndviDelta: number;
    severityScore: number;
    isFlaggedEvidence: boolean;
    isDismissed: boolean;
    dismissalReason: string | null;
}
export interface IAlert {
    id: string;
    aoiId: string;
    primaryZoneId: string;
    runId: string;
    severityScore: number;
    intersectionCategory: IntersectionCategory;
    totalAreaHa: number;
    zoneCount: number;
    status: AlertStatus;
    isDuplicate: boolean;
    parentAlertId: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface IAlertWithRelations extends IAlert {
    aoi: Pick<IAoi, 'id' | 'name' | 'stateCode' | 'stateName' | 'districtName'>;
    changeZones: IChangeZone[];
    statusLog: IAlertStatusLogEntry[];
}
export interface IAlertStatusLogEntry {
    id: string;
    alertId: string;
    previousStatus: AlertStatus | null;
    newStatus: AlertStatus;
    changedBy: string;
    changedByName: string;
    justificationNote: string;
    createdAt: string;
}
export interface IUpdateAlertStatusRequest {
    status: AlertStatus;
    justificationNote: string;
}
export interface IAlertTimelineEntry {
    runId: string;
    baselineDate: string;
    targetDate: string;
    changeAreaHa: number;
    severityScore: number;
    status: AlertStatus;
}
export interface ICaseFile {
    id: string;
    referenceNumber: string;
    alertId: string;
    status: CaseFileStatus;
    compiledBy: string;
    compiledByName: string;
    analystNotes: string | null;
    recommendation: string | null;
    recommendationDetail: string | null;
    pdfStoragePath: string | null;
    geojsonStoragePath: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface ICaseFileWithRelations extends ICaseFile {
    alert: IAlertWithRelations;
    evidenceImages: ICaseFileEvidenceImage[];
    auditTrail: ICaseFileAuditEntry[];
}
export interface ICaseFileEvidenceImage {
    id: string;
    caseFileId: string;
    sceneId: string;
    scene: Pick<IImageryScene, 'id' | 'satelliteSource' | 'acquisitionDate' | 'tileId'>;
    caption: string;
    displayOrder: number;
}
export interface ICaseFileAuditEntry {
    id: string;
    caseFileId: string;
    action: AuditAction;
    performedBy: string;
    performedByName: string;
    createdAt: string;
}
export interface IUpdateCaseFileRequest {
    analystNotes?: string;
    recommendation?: string;
    recommendationDetail?: string;
    evidenceImageIds?: string[];
    evidenceImageCaptions?: Record<string, string>;
}
export interface IExportCaseFileRequest {
    formats: ExportFormat[];
}
export interface IExportJobStatus {
    jobId: string;
    caseFileId: string;
    status: ExportJobStatus;
    pdfUrl: string | null;
    geojsonUrl: string | null;
    errorMessage: string | null;
}
export interface INotification {
    id: string;
    userId: string;
    alertId: string | null;
    type: NotificationType;
    title: string;
    body: string;
    isRead: boolean;
    sentAt: string;
}
export interface ISeverityConfigFactor {
    id: string;
    factorName: string;
    factorLabel: string;
    weightPct: number;
    updatedBy: string;
    updatedAt: string;
}
export interface IDashboardSummary {
    totalActiveAlerts: number;
    alertsByCategory: Record<IntersectionCategory, number>;
    confirmedIllegalCount: number;
    totalDeforestationHa: number;
    alertOutcomeBreakdown: {
        confirmed: number;
        legalActivity: number;
        falsePositive: number;
        pending: number;
        escalated: number;
    };
    alertTrend: Array<{
        date: string;
        count: number;
    }>;
    deforestationTrend: Array<{
        date: string;
        ha: number;
    }>;
}
export interface IAoiHeatmapEntry {
    aoiId: string;
    aoiName: string;
    centroid: GeoJSONPoint;
    alertCount: number;
    highestSeverityScore: number;
    totalChangeHa: number;
}
export interface IWsAnalysisProgress {
    runId: string;
    progressPct: number;
    currentPhase: AnalysisPhase;
}
export interface IWsAnalysisComplete {
    runId: string;
    alertId: string;
    zoneCount: number;
    severityScore: number;
}
export interface IWsAnalysisFailed {
    runId: string;
    errorMessage: string;
}
export interface IWsAlertNew {
    alertId: string;
    aoiId: string;
    aoiName: string;
    severityScore: number;
    intersectionCategory: IntersectionCategory;
}
export interface IWsNotificationNew {
    notificationId: string;
    title: string;
    body: string;
}
export interface IWsExportReady {
    jobId: string;
    caseFileId: string;
    pdfUrl: string | null;
    geojsonUrl: string | null;
}
export type WsEvent = {
    event: 'analysis:progress';
    payload: IWsAnalysisProgress;
} | {
    event: 'analysis:complete';
    payload: IWsAnalysisComplete;
} | {
    event: 'analysis:failed';
    payload: IWsAnalysisFailed;
} | {
    event: 'alert:new';
    payload: IWsAlertNew;
} | {
    event: 'notification:new';
    payload: IWsNotificationNew;
} | {
    event: 'export:ready';
    payload: IWsExportReady;
};
//# sourceMappingURL=index.d.ts.map