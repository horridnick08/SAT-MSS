import { create } from 'zustand';
import * as Cesium from 'cesium';
import * as turf from '@turf/turf';

export interface DraftAoi {
  id: string;
  name: string;
  points: Cesium.Cartesian3[]; // Cartesian coordinates for rendering in Cesium
  coordinates: [number, number][]; // Geographic [longitude, latitude] coordinates
  center: Cesium.Cartesian3; // Precomputed polygon centroid
}

interface AoiState {
  aois: DraftAoi[];
  isDrawing: boolean;
  activePoints: Cesium.Cartesian3[];
  tempPoint: Cesium.Cartesian3 | null;
  selectedAoiId: string | null;
  originalPoints: Cesium.Cartesian3[];
  validationError: string | null;

  startDrawing: () => void;
  addVertex: (point: Cesium.Cartesian3) => void;
  updateTempPoint: (point: Cesium.Cartesian3 | null) => void;
  completeDrawing: () => void;
  cancelDrawing: () => void;
  deleteAoi: (id: string) => void;
  selectAoi: (id: string | null) => void;
  updateVertex: (index: number, newPoint: Cesium.Cartesian3) => void;
  validateAoi: () => void;
  cancelEditing: () => void;
}

export const useAoiStore = create<AoiState>((set, get) => ({
  aois: [],
  isDrawing: false,
  activePoints: [],
  tempPoint: null,
  selectedAoiId: null,
  originalPoints: [],
  validationError: null,

  startDrawing: () => {
    set({
      isDrawing: true,
      activePoints: [],
      tempPoint: null,
      selectedAoiId: null,
      validationError: null,
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

    const newAoi: DraftAoi = {
      id: crypto.randomUUID(),
      name: `Area of Interest ${get().aois.length + 1}`,
      points: [...activePoints],
      coordinates,
      center: boundingSphere.center,
    };

    set((state) => ({
      aois: [...state.aois, newAoi],
      isDrawing: false,
      activePoints: [],
      tempPoint: null,
    }));
  },

  cancelDrawing: () => {
    set({
      isDrawing: false,
      activePoints: [],
      tempPoint: null,
    });
  },

  deleteAoi: (id) => {
    set((state) => ({
      aois: state.aois.filter((aoi) => aoi.id !== id),
      selectedAoiId: state.selectedAoiId === id ? null : state.selectedAoiId,
      validationError: state.selectedAoiId === id ? null : state.validationError,
    }));
  },

  selectAoi: (id) => {
    const { aois } = get();
    if (id === null) {
      set({
        selectedAoiId: null,
        originalPoints: [],
        validationError: null,
      });
      return;
    }
    const targetAoi = aois.find((a) => a.id === id);
    if (targetAoi) {
      set({
        selectedAoiId: id,
        originalPoints: [...targetAoi.points],
        validationError: null,
      });
      get().validateAoi();
    }
  },

  updateVertex: (index, newPoint) => {
    const { selectedAoiId, aois } = get();
    if (!selectedAoiId) return;

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
    const { selectedAoiId, originalPoints, aois } = get();
    if (!selectedAoiId) return;

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
      selectedAoiId: null,
      originalPoints: [],
      validationError: null,
    });
  },
}));
