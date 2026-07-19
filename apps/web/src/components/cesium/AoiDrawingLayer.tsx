'use client';

import React from 'react';
import { Entity, PolygonGraphics, PolylineGraphics, PointGraphics } from 'resium';
import * as Cesium from 'cesium';
import { useAoiStore } from '@/stores/useAoiStore';

export default function AoiDrawingLayer() {
  const aois = useAoiStore((state) => state.aois);
  const activePoints = useAoiStore((state) => state.activePoints);
  const tempPoint = useAoiStore((state) => state.tempPoint);
  const isDrawing = useAoiStore((state) => state.isDrawing);

  // 1. Render finalized, in-memory AOI polygons
  const renderedSavedAois = aois.map((aoi) => {
    const boundingSphere = Cesium.BoundingSphere.fromPoints(aoi.points);
    const center = boundingSphere.center;

    return (
      <Entity
        key={`saved-aoi-${aoi.id}`}
        id={`saved-aoi-${aoi.id}`}
        name={aoi.name}
        position={center}
      >
        <PolygonGraphics
          hierarchy={aoi.points}
          material={Cesium.Color.fromCssColorString('#1AABB0').withAlpha(0.15)}
          outline={true}
          outlineColor={Cesium.Color.fromCssColorString('#1AABB0')}
          outlineWidth={2}
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
                material={Cesium.Color.fromCssColorString('#E88C30').withAlpha(0.15)}
              />
            </Entity>
          )}

          {/* Active dash line guides */}
          {polylinePositions.length >= 2 && (
            <Entity id="active-aoi-outline-preview">
              <PolylineGraphics
                positions={polylinePositions}
                width={2}
                material={
                  new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.fromCssColorString('#E88C30'),
                    dashLength: 16,
                  })
                }
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
                color={Cesium.Color.fromCssColorString('#E88C30')}
                outlineColor={Cesium.Color.fromCssColorString('#FFFFFF')}
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
