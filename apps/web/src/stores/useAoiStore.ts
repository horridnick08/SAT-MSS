import { create } from 'zustand';
import * as Cesium from 'cesium';
import * as turf from '@turf/turf';
import { aoiApi } from '../lib/api/aoi.api';

export interface DraftAoi {
  id: string;
  name: string;
  points: Cesium.Cartesian3[]; // Cartesian coordinates for rendering in Cesium
  coordinates: [number, number][]; // Geographic [longitude, latitude] coordinates
  center: Cesium.Cartesian3; // Precomputed polygon centroid
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  stateCode?: string;
  stateName?: string;
  districtName?: string;
  notes?: string | null;
  areaHa?: number | null;
  alertCount?: number;
  pendingAlertCount?: number;
  lastAnalysisDate?: string | null;
  lastImageryDate?: string | null;
}

interface AoiState {
  aois: DraftAoi[];
  isDrawing: boolean;
  isEditing: boolean;
  activePoints: Cesium.Cartesian3[];
  tempPoint: Cesium.Cartesian3 | null;
  selectedAoiId: string | null;
  originalPoints: Cesium.Cartesian3[];
  validationError: string | null;
  pendingDraft: DraftAoi | null;
  isLoading: boolean;
  error: string | null;

  startDrawing: () => void;
  addVertex: (point: Cesium.Cartesian3) => void;
  updateTempPoint: (point: Cesium.Cartesian3 | null) => void;
  completeDrawing: () => void;
  cancelDrawing: () => void;
  deleteAoi: (id: string) => void;
  selectAoi: (id: string | null) => void;
  startEditing: () => void;
  updateVertex: (index: number, newPoint: Cesium.Cartesian3) => void;
  validateAoi: () => void;
  cancelEditing: () => void;

  // Persistence methods
  loadAois: () => Promise<void>;
  saveDraft: (details: {
    name: string;
    stateCode: string;
    districtName: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    notes?: string;
  }) => Promise<void>;
  discardDraft: () => void;
  deletePersistedAoi: (id: string) => Promise<void>;
}

export const useAoiStore = create<AoiState>((set, get) => ({
  aois: [],
  isDrawing: false,
  isEditing: false,
  activePoints: [],
  tempPoint: null,
  selectedAoiId: null,
  originalPoints: [],
  validationError: null,
  pendingDraft: null,
  isLoading: false,
  error: null,

  startDrawing: () => {
    set({
      isDrawing: true,
      isEditing: false,
      activePoints: [],
      tempPoint: null,
      selectedAoiId: null,
      validationError: null,
      pendingDraft: null,
    });
  },

  addVertex: (point) => {
    const { activePoints } = get();
    // Prevent consecutive identical points
    if (activePoints.length > 0) {
      const lastPoint = activePoints[activePoints.length - 1];
      if (Cesium.Cartesian3.equals(lastPoint, point)) {
        return;
      }
    }
    set({
      activePoints: [...activePoints, point],
      tempPoint: null,
    });
  },

  updateTempPoint: (point) => {
    set({ tempPoint: point });
  },

  completeDrawing: () => {
    const { activePoints } = get();
    // A valid polygon needs at least 3 vertices
    if (activePoints.length < 3) {
      set({
        isDrawing: false,
        isEditing: false,
        activePoints: [],
        tempPoint: null,
      });
      return;
    }

    // Convert Cartesian3 coordinates to WGS84 [longitude, latitude]
    const coordinates = activePoints.map((point) => {
      const cartographic = Cesium.Cartographic.fromCartesian(point);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      return [longitude, latitude] as [number, number];
    });

    // Ensure the polygon is closed for GeoJSON compliance
    if (coordinates.length > 0) {
      const first = coordinates[0];
      const last = coordinates[coordinates.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        coordinates.push([...first] as [number, number]);
      }
    }

    const boundingSphere = Cesium.BoundingSphere.fromPoints(activePoints);

    const draft: DraftAoi = {
      id: crypto.randomUUID(),
      name: '',
      points: [...activePoints],
      coordinates,
      center: boundingSphere.center,
    };

    set({
      pendingDraft: draft,
      isDrawing: false,
      isEditing: false,
      activePoints: [],
      tempPoint: null,
    });
  },

  cancelDrawing: () => {
    set({
      isDrawing: false,
      isEditing: false,
      activePoints: [],
      tempPoint: null,
    });
  },

  deleteAoi: (id) => {
    set((state) => ({
      aois: state.aois.filter((aoi) => aoi.id !== id),
      selectedAoiId: state.selectedAoiId === id ? null : state.selectedAoiId,
      isEditing: state.selectedAoiId === id ? false : state.isEditing,
      validationError: state.selectedAoiId === id ? null : state.validationError,
    }));
  },

  selectAoi: (id) => {
    if (id === null) {
      set({
        selectedAoiId: null,
        isEditing: false,
        originalPoints: [],
        validationError: null,
      });
      return;
    }
    const { aois } = get();
    const targetAoi = aois.find((a) => a.id === id);
    if (targetAoi) {
      set({
        selectedAoiId: id,
        isEditing: false, // Default to view-only mode on selection
        originalPoints: [],
        validationError: null,
      });
    }
  },

  startEditing: () => {
    const { selectedAoiId, aois } = get();
    if (!selectedAoiId) return;
    const targetAoi = aois.find((a) => a.id === selectedAoiId);
    if (targetAoi) {
      set({
        isEditing: true,
        originalPoints: [...targetAoi.points],
        validationError: null,
      });
      get().validateAoi();
    }
  },

  updateVertex: (index, newPoint) => {
    const { selectedAoiId, aois, isEditing } = get();
    if (!selectedAoiId || !isEditing) return;

    set({
      aois: aois.map((aoi) => {
        if (aoi.id === selectedAoiId) {
          const updatedPoints = [...aoi.points];
          updatedPoints[index] = newPoint;

          // Recalculate geographic coordinates
          const updatedCoordinates = updatedPoints.map((point) => {
            const cartographic = Cesium.Cartographic.fromCartesian(point);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            return [longitude, latitude] as [number, number];
          });

          // Ensure the polygon is closed for GeoJSON compliance
          if (updatedCoordinates.length > 0) {
            const first = updatedCoordinates[0];
            const last = updatedCoordinates[updatedCoordinates.length - 1];
            if (first[0] !== last[0] || first[1] !== last[1]) {
              updatedCoordinates.push([...first] as [number, number]);
            }
          }

          const boundingSphere = Cesium.BoundingSphere.fromPoints(updatedPoints);

          return {
            ...aoi,
            points: updatedPoints,
            coordinates: updatedCoordinates,
            center: boundingSphere.center,
          };
        }
        return aoi;
      }),
    });

    // Run validation immediately
    get().validateAoi();
  },

  validateAoi: () => {
    const { selectedAoiId, aois } = get();
    if (!selectedAoiId) return;

    const selectedAoi = aois.find((a) => a.id === selectedAoiId);
    if (!selectedAoi) return;

    // 1. Check minimum vertices
    if (selectedAoi.points.length < 3) {
      set({ validationError: 'Polygon must have at least 3 vertices.' });
      return;
    }

    // 2. Check duplicate vertices (distance < 1.0 meter)
    const points = selectedAoi.points;
    let hasDuplicates = false;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = Cesium.Cartesian3.distance(points[i], points[j]);
        if (dist < 1.0) {
          hasDuplicates = true;
          break;
        }
      }
      if (hasDuplicates) break;
    }

    if (hasDuplicates) {
      set({ validationError: 'Duplicate vertices detected.' });
      return;
    }

    // 3. Check self-intersections (kinks)
    try {
      const turfPoly = turf.polygon([selectedAoi.coordinates]);
      const kinkFeatures = turf.kinks(turfPoly);
      if (kinkFeatures.features.length > 0) {
        set({ validationError: 'Geometry self-intersects.' });
        return;
      }
    } catch (err) {
      set({ validationError: 'Invalid polygon geometry.' });
      return;
    }

    set({ validationError: null });
  },

  cancelEditing: () => {
    const { selectedAoiId, originalPoints, aois, isEditing } = get();
    if (!selectedAoiId || !isEditing) return;

    set({
      aois: aois.map((aoi) => {
        if (aoi.id === selectedAoiId) {
          const coordinates = originalPoints.map((point) => {
            const cartographic = Cesium.Cartographic.fromCartesian(point);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            return [longitude, latitude] as [number, number];
          });

          if (coordinates.length > 0) {
            const first = coordinates[0];
            const last = coordinates[coordinates.length - 1];
            if (first[0] !== last[0] || first[1] !== last[1]) {
              coordinates.push([...first] as [number, number]);
            }
          }

          const boundingSphere = Cesium.BoundingSphere.fromPoints(originalPoints);

          return {
            ...aoi,
            points: [...originalPoints],
            coordinates,
            center: boundingSphere.center,
          };
        }
        return aoi;
      }),
      isEditing: false,
      originalPoints: [],
      validationError: null,
    });
  },

  loadAois: async () => {
    set({ isLoading: true, error: null, selectedAoiId: null, isEditing: false });
    try {
      const response = await aoiApi.list();
      const loaded = response.data.map((savedAoi) => {
        const coords = savedAoi.geometry.coordinates[0];
        // slice(0, -1) to exclude duplicate closing vertex for rendering handle
        const points = coords.slice(0, -1).map(([lng, lat]: [number, number]) =>
          Cesium.Cartesian3.fromDegrees(lng, lat)
        );
        const boundingSphere = Cesium.BoundingSphere.fromPoints(points);

        return {
          id: savedAoi.id,
          name: savedAoi.name,
          points,
          coordinates: coords,
          center: boundingSphere.center,
          priority: savedAoi.priority,
          isActive: savedAoi.isActive,
          stateCode: savedAoi.stateCode,
          stateName: savedAoi.stateName,
          districtName: savedAoi.districtName,
          notes: savedAoi.notes ?? null,
          areaHa: savedAoi.areaHa,
          alertCount: savedAoi.alertCount ?? 0,
          pendingAlertCount: savedAoi.pendingAlertCount ?? 0,
          lastAnalysisDate: savedAoi.lastAnalysisDate ?? null,
          lastImageryDate: savedAoi.lastImageryDate ?? null,
        } as DraftAoi;
      });

      set({ aois: loaded, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.message || 'Failed to load AOIs';
      set({ error: msg, isLoading: false });
    }
  },

  saveDraft: async (details) => {
    const { pendingDraft } = get();
    if (!pendingDraft) return;

    set({ isLoading: true, error: null });
    try {
      const requestPayload: any = {
        name: details.name,
        geometry: {
          type: 'Polygon',
          coordinates: [pendingDraft.coordinates],
        },
        stateCode: details.stateCode,
        districtName: details.districtName,
        priority: details.priority,
      };

      if (details.notes) {
        requestPayload.notes = details.notes;
      }

      const response = await aoiApi.create(requestPayload);

      const savedAoi = response.data;
      const coords = savedAoi.geometry.coordinates[0];
      const points = coords.slice(0, -1).map(([lng, lat]: [number, number]) =>
        Cesium.Cartesian3.fromDegrees(lng, lat)
      );
      const boundingSphere = Cesium.BoundingSphere.fromPoints(points);

      const draftAoi: DraftAoi = {
        id: savedAoi.id,
        name: savedAoi.name,
        points,
        coordinates: coords,
        center: boundingSphere.center,
        priority: savedAoi.priority,
        isActive: savedAoi.isActive,
        stateCode: savedAoi.stateCode,
        stateName: savedAoi.stateName,
        districtName: savedAoi.districtName,
        notes: savedAoi.notes ?? null,
        areaHa: savedAoi.areaHa,
        alertCount: savedAoi.alertCount ?? 0,
        pendingAlertCount: savedAoi.pendingAlertCount ?? 0,
        lastAnalysisDate: savedAoi.lastAnalysisDate ?? null,
        lastImageryDate: savedAoi.lastImageryDate ?? null,
      };

      set((state) => ({
        aois: [...state.aois, draftAoi],
        pendingDraft: null,
        isEditing: false,
        isLoading: false,
      }));
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.message || 'Failed to save AOI';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  discardDraft: () => {
    set({ pendingDraft: null, isEditing: false });
  },

  deletePersistedAoi: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await aoiApi.delete(id);
      set((state) => ({
        aois: state.aois.filter((aoi) => aoi.id !== id),
        selectedAoiId: state.selectedAoiId === id ? null : state.selectedAoiId,
        isEditing: state.selectedAoiId === id ? false : state.isEditing,
        validationError: state.selectedAoiId === id ? null : state.validationError,
        isLoading: false,
      }));
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.message || 'Failed to delete AOI';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },
}));
