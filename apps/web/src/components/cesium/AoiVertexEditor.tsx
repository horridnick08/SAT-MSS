'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { useCesium, Entity, PointGraphics } from 'resium';
import * as Cesium from 'cesium';
import { useAoiStore } from '@/stores/useAoiStore';

export default function AoiVertexEditor() {
  const { viewer } = useCesium();
  const selectedAoiId = useAoiStore((state) => state.selectedAoiId);
  const isEditing = useAoiStore((state) => state.isEditing);
  const aois = useAoiStore((state) => state.aois);
  const updateVertex = useAoiStore((state) => state.updateVertex);

  // Retrieve selected AOI points dynamically
  const selectedAoi = aois.find((a) => a.id === selectedAoiId);
  const activePoints = selectedAoi ? selectedAoi.points : [];

  const draggedVertexIndexRef = useRef<number | null>(null);

  // Memoize handle colors to prevent allocations during real-time dragging
  const handleColor = useMemo(() => Cesium.Color.fromCssColorString('#E88C30'), []);
  const handleOutlineColor = useMemo(() => Cesium.Color.fromCssColorString('#FFFFFF'), []);

  useEffect(() => {
    if (!viewer || !selectedAoiId || !isEditing) return;

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    // LEFT_DOWN: Pick a vertex entity
    handler.setInputAction((event: { position: Cesium.Cartesian2 }) => {
      const pickedObject = viewer.scene.pick(event.position);
      if (
        Cesium.defined(pickedObject) &&
        pickedObject.id &&
        typeof pickedObject.id.id === 'string' &&
        pickedObject.id.id.startsWith('edit-vertex-')
      ) {
        const indexStr = pickedObject.id.id.split('-')[2];
        const index = parseInt(indexStr, 10);
        draggedVertexIndexRef.current = index;

        // Lock camera panning/zooming/rotating during drag
        const controller = viewer.scene.screenSpaceCameraController;
        controller.enableRotate = false;
        controller.enableTranslate = false;
        controller.enableZoom = false;
        controller.enableTilt = false;
        controller.enableLook = false;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    // MOUSE_MOVE: Update vertex coordinate on drag
    handler.setInputAction((event: { endPosition: Cesium.Cartesian2 }) => {
      if (draggedVertexIndexRef.current === null) return;

      const ray = viewer.camera.getPickRay(event.endPosition);
      if (!ray) return;

      let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      if (!Cesium.defined(cartesian)) {
        cartesian = viewer.camera.pickEllipsoid(event.endPosition, viewer.scene.globe.ellipsoid);
      }

      if (Cesium.defined(cartesian)) {
        updateVertex(draggedVertexIndexRef.current, cartesian);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // LEFT_UP: Release drag
    handler.setInputAction(() => {
      if (draggedVertexIndexRef.current !== null) {
        draggedVertexIndexRef.current = null;

        // Re-enable camera controls
        const controller = viewer.scene.screenSpaceCameraController;
        controller.enableRotate = true;
        controller.enableTranslate = true;
        controller.enableZoom = true;
        controller.enableTilt = true;
        controller.enableLook = true;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    return () => {
      handler.destroy();
      if (viewer && !viewer.isDestroyed()) {
        const controller = viewer.scene.screenSpaceCameraController;
        controller.enableRotate = true;
        controller.enableTranslate = true;
        controller.enableZoom = true;
        controller.enableTilt = true;
        controller.enableLook = true;
      }
    };
  }, [viewer, selectedAoiId, isEditing, updateVertex]);

  if (!selectedAoiId || !isEditing || activePoints.length === 0) return null;

  return (
    <>
      {activePoints.map((point, index) => (
        <Entity
          key={`edit-vertex-${index}`}
          id={`edit-vertex-${index}`}
          position={point}
        >
          <PointGraphics
            pixelSize={12}
            color={handleColor}
            outlineColor={handleOutlineColor}
            outlineWidth={2}
            disableDepthTestDistance={Number.POSITIVE_INFINITY}
          />
        </Entity>
      ))}
    </>
  );
}
