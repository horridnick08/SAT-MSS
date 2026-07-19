import { create } from 'zustand';
import * as Cesium from 'cesium';

export interface DraftAoi {
  id: string;
  name: string;
  points: Cesium.Cartesian3[]; // Cartesian coordinates for rendering in Cesium
  coordinates: [number, number][]; // Geographic [longitude, latitude] coordinates
}

interface AoiState {
  aois: DraftAoi[];
  isDrawing: boolean;
  activePoints: Cesium.Cartesian3[];
  tempPoint: Cesium.Cartesian3 | null;

  startDrawing: () => void;
  addVertex: (point: Cesium.Cartesian3) => void;
  updateTempPoint: (point: Cesium.Cartesian3 | null) => void;
  completeDrawing: () => void;
  cancelDrawing: () => void;
  deleteAoi: (id: string) => void;
}

export const useAoiStore = create<AoiState>((set, get) => ({
  aois: [],
  isDrawing: false,
  activePoints: [],
  tempPoint: null,

  startDrawing: () => {
    set({
      isDrawing: true,
      activePoints: [],
      tempPoint: null,
    });
  },

  addVertex: (point) => {
    const { activePoints } = get();
    // Prevent consecutive identical points (e.g. from double click events)
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

    // Convert Cartesian3 coordinates to WGS84 [longitude, latitude] for mapping data representation
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

    const newAoi: DraftAoi = {
      id: crypto.randomUUID(),
      name: `Area of Interest ${get().aois.length + 1}`,
      points: [...activePoints],
      coordinates,
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
    }));
  },
}));
