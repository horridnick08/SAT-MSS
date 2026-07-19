'use client';

import React, { useMemo } from 'react';
import { Entity, PolygonGraphics, PolylineGraphics, PointGraphics } from 'resium';
import * as Cesium from 'cesium';
import { useAoiStore } from '@/stores/useAoiStore';

export default function AoiDrawingLayer() {
  const aois = useAoiStore((state) => state.aois);
  const activePoints = useAoiStore((state) => state.activePoints);
  const tempPoint = useAoiStore((state) => state.tempPoint);
  const isDrawing = useAoiStore((state) => state.isDrawing);
  const selectedAoiId = useAoiStore((state) => state.selectedAoiId);
  const validationError = useAoiStore((state) => state.validationError);

  // Cache immutable Cesium objects to avoid constant re-allocations
  const savedMaterial = useMemo(() => Cesium.Color.fromCssColorString('#1AABB0').withAlpha(0.15), []);
  const savedOutlineColor = useMemo(() => Cesium.Color.fromCssColorString('#1AABB0'), []);

  const editingMaterial = useMemo(() => Cesium.Color.fromCssColorString('#E88C30').withAlpha(0.15), []);
  const editingOutlineColor = useMemo(() => Cesium.Color.fromCssColorString('#E88C30'), []);

  const errorMaterial = useMemo(() => Cesium.Color.fromCssColorString('#C94040').withAlpha(0.15), []);
  const errorOutlineColor = useMemo(() => Cesium.Color.fromCssColorString('#C94040'), []);

  const activeMaterial = useMemo(() => Cesium.Color.fromCssColorString('#E88C30').withAlpha(0.15), []);
  const vertexColor = useMemo(() => Cesium.Color.fromCssColorString('#E88C30'), []);
  const vertexOutlineColor = useMemo(() => Cesium.Color.fromCssColorString('#FFFFFF'), []);
  const activePolylineMaterial = useMemo(() => new Cesium.PolylineDashMaterialProperty({
    color: Cesium.Color.fromCssColorString('#E88C30'),
    dashLength: 16,
  }), []);

  // 1. Render finalized, in-memory AOI polygons using precomputed center coordinates
  const renderedSavedAois = aois.map((aoi) => {
    const isSelected = aoi.id === selectedAoiId;
    const isInvalid = isSelected && !!validationError;

    const material = isSelected
      ? (isInvalid ? errorMaterial : editingMaterial)
      : savedMaterial;

    const outlineColor = isSelected
      ? (isInvalid ? errorOutlineColor : editingOutlineColor)
      : savedOutlineColor;

    return (
      <Entity
        key={`saved-aoi-${aoi.id}`}
        id={`saved-aoi-${aoi.id}`}
        name={aoi.name}
        position={aoi.center}
      >
        <PolygonGraphics
          hierarchy={aoi.points}
          material={material}
          outline={true}
          outlineColor={outlineColor}
          outlineWidth={isSelected ? 3 : 2}
        />
      </Entity>
    );
  });

  // 2. Render active drawing guides
  const showPolygonPreview = activePoints.length >= 3;

  // Polyline positions connect all placed vertices + cursor pointer (tempPoint) + loop close back to start
  const polylinePositions = [...activePoints];
  if (tempPoint) {
    polylinePositions.push(tempPoint);
  }
  if (polylinePositions.length >= 2) {
    polylinePositions.push(polylinePositions[0]);
  }

  return (
    <>
      {/* Finalized vector boundary layer */}
      {renderedSavedAois}

      {/* Active interactive session layer */}
      {isDrawing && (
        <>
          {/* Active polygon area preview */}
          {showPolygonPreview && (
            <Entity id="active-aoi-polygon-preview">
              <PolygonGraphics
                hierarchy={activePoints}
                material={activeMaterial}
              />
            </Entity>
          )}

          {/* Active dash line guides */}
          {polylinePositions.length >= 2 && (
            <Entity id="active-aoi-outline-preview">
              <PolylineGraphics
                positions={polylinePositions}
                width={2}
                material={activePolylineMaterial}
              />
            </Entity>
          )}

          {/* Vertex point markers */}
          {activePoints.map((point, index) => (
            <Entity
              key={`drawing-vertex-${index}`}
              position={point}
            >
              <PointGraphics
                pixelSize={8}
                color={vertexColor}
                outlineColor={vertexOutlineColor}
                outlineWidth={2}
                disableDepthTestDistance={Number.POSITIVE_INFINITY}
              />
            </Entity>
          ))}
        </>
      )}
    </>
  );
}
