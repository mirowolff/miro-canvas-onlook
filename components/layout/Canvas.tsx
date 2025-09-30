'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import ZoomPanel from './ZoomPanel';
import Toolbar from './Toolbar';
import BoardBar from './BoardBar';
import CollaborationBar from './CollaborationBar';

interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
}

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.1;

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    panX: 0,
    panY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [lastMousePos, setLastMousePos] = useState<Point>({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [selectedTool, setSelectedTool] = useState('cursor');

  // Handle window resize
  const updateCanvasSize = useCallback(() => {
    if (containerRef.current && canvasRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = rect.width;
      const newHeight = rect.height;

      setCanvasSize({ width: newWidth, height: newHeight });

      const canvas = canvasRef.current;
      canvas.width = newWidth * window.devicePixelRatio;
      canvas.height = newHeight * window.devicePixelRatio;
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    }
  }, []);

  // Draw grid background
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;


    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Set background color
    ctx.fillStyle = '#f2f2f2';
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Calculate grid parameters
    const scaledGridSize = GRID_SIZE * canvasState.zoom;

    // Only draw grid if it's visible enough
    if (scaledGridSize > 4) {
      // Calculate grid offset
      const offsetX = (canvasState.panX % scaledGridSize + scaledGridSize) % scaledGridSize;
      const offsetY = (canvasState.panY % scaledGridSize + scaledGridSize) % scaledGridSize;

      ctx.fillStyle = '#c7c7c8';

      // Calculate visible range with padding
      const startX = Math.max(0, offsetX);
      const endX = canvasSize.width;
      const startY = Math.max(0, offsetY);
      const endY = canvasSize.height;

      // Draw dots (optimized to only render visible area)
      ctx.beginPath();
      for (let x = startX; x < endX; x += scaledGridSize) {
        for (let y = startY; y < endY; y += scaledGridSize) {
          ctx.moveTo(x + 1, y);
          ctx.arc(x, y, 1, 0, 2 * Math.PI);
        }
      }
      ctx.fill();
    }
  }, [canvasState, canvasSize]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpacePressed) {
        e.preventDefault();
        setIsSpacePressed(true);
      }

      if (e.key === 'r' || e.key === 'R') {
        setCanvasState(prev => ({ ...prev, zoom: 1 }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
        setIsDragging(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSpacePressed]);

  // Handle mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isSpacePressed) {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  }, [isSpacePressed]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && isSpacePressed) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      setCanvasState(prev => ({
        ...prev,
        panX: prev.panX + deltaX,
        panY: prev.panY + deltaY,
      }));

      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, isSpacePressed, lastMousePos]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  // Handle wheel zoom with native event listener
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomDelta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, canvasState.zoom + zoomDelta));

      if (newZoom !== canvasState.zoom) {
        // Calculate zoom center offset
        const zoomRatio = newZoom / canvasState.zoom;
        const newPanX = mouseX - (mouseX - canvasState.panX) * zoomRatio;
        const newPanY = mouseY - (mouseY - canvasState.panY) * zoomRatio;

        setCanvasState({
          zoom: newZoom,
          panX: newPanX,
          panY: newPanY,
        });

      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        canvas.removeEventListener('wheel', handleWheel);
      };
    }
  }, [canvasState]);

  // Update canvas size on mount and resize
  useEffect(() => {
    updateCanvasSize();

    const handleResize = () => updateCanvasSize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [updateCanvasSize]);

  // Draw grid when canvas state changes
  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  // Zoom control functions for ZoomPanel
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(MAX_ZOOM, canvasState.zoom + ZOOM_STEP);
    setCanvasState(prev => ({ ...prev, zoom: newZoom }));
  }, [canvasState.zoom]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(MIN_ZOOM, canvasState.zoom - ZOOM_STEP);
    setCanvasState(prev => ({ ...prev, zoom: newZoom }));
  }, [canvasState.zoom]);

  const handleFitToScreen = useCallback(() => {
    // Reset to center and 100% zoom
    setCanvasState({
      zoom: 1,
      panX: 0,
      panY: 0,
    });
  }, []);

  const handleZoomToPercentage = useCallback((targetZoom: number) => {
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, targetZoom));
    setCanvasState(prev => ({ ...prev, zoom: newZoom }));
  }, []);

  // Handle tool selection
  const handleToolSelect = useCallback((tool: string) => {
    setSelectedTool(tool);
  }, []);

  return (
    <>
      {/* Board Bar */}
      <BoardBar />

      {/* Collaboration Bar */}
      <CollaborationBar />

      <div
        ref={containerRef}
        className="w-full h-full overflow-hidden"
        style={{
          cursor: isSpacePressed ? (isDragging ? 'grabbing' : 'grab') : 'default',
          height: '100vh',
          width: '100vw'
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full"
        />
      </div>

      {/* Toolbar */}
      <Toolbar
        selectedTool={selectedTool}
        onToolSelect={handleToolSelect}
      />

      {/* Zoom Panel */}
      <ZoomPanel
        zoom={canvasState.zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitToScreen={handleFitToScreen}
        onZoomToPercentage={handleZoomToPercentage}
      />
    </>
  );
}