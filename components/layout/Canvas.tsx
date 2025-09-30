'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import ZoomPanel from './ZoomPanel';
import Toolbar from './Toolbar';
import BoardBar from './BoardBar';
import CollaborationBar from './CollaborationBar';
import StickyNote, { StickyNoteData } from '../canvas/StickyNote';
import StickyColorPicker, { STICKY_COLORS } from '../canvas/StickyColorPicker';

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
const DEFAULT_STICKY_WIDTH = 200;
const DEFAULT_STICKY_HEIGHT = 200;

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

  // Sticky notes state
  const [stickies, setStickies] = useState<StickyNoteData[]>([]);
  const [selectedStickyIds, setSelectedStickyIds] = useState<Set<string>>(new Set());
  const [selectedStickyColor, setSelectedStickyColor] = useState(STICKY_COLORS[0].color);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Selection box state
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Point>({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState<Point>({ x: 0, y: 0 });
  const [justFinishedSelecting, setJustFinishedSelecting] = useState(false);

  // Store initial positions for multi-select drag
  const multiDragInitialPositions = useRef<Map<string, {x: number, y: number}>>(new Map());

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
      // Check if typing in an input
      const isTyping = e.target instanceof HTMLTextAreaElement ||
                       e.target instanceof HTMLInputElement;

      if (e.code === 'Space' && !isSpacePressed && !isTyping) {
        e.preventDefault();
        setIsSpacePressed(true);
      }

      if (e.key === 'r' || e.key === 'R') {
        setCanvasState(prev => ({ ...prev, zoom: 1 }));
      }

      // Tool shortcuts
      if (!isTyping) {
        if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          setSelectedTool('sticky');
          setShowColorPicker(true);
        }
        if (e.key === 'v' || e.key === 'V') {
          e.preventDefault();
          setSelectedTool('cursor');
          setShowColorPicker(false);
        }
      }

      // Delete selected stickies
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedStickyIds.size > 0 && !isTyping) {
        e.preventDefault();
        setStickies(prev => prev.filter(s => !selectedStickyIds.has(s.id)));
        setSelectedStickyIds(new Set());
      }

      // Escape key deselects all and cancels sticky tool
      if (e.key === 'Escape') {
        setSelectedStickyIds(new Set());
        if (selectedTool === 'sticky') {
          setSelectedTool('cursor');
          setShowColorPicker(false);
        }
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
  }, [isSpacePressed, selectedStickyIds, selectedTool]);

  // Handle canvas click (for placing stickies or deselecting)
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Don't process click if we just finished selecting
    if (justFinishedSelecting) {
      return;
    }

    // Check if we clicked on canvas or the container itself, not on a sticky
    const target = e.target as HTMLElement;
    const isCanvasClick = target === e.currentTarget || target.tagName === 'CANVAS';

    if (!isCanvasClick) {
      return;
    }

    if (selectedTool === 'sticky') {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      // Convert screen position to canvas position
      const canvasX = (screenX - canvasState.panX) / canvasState.zoom;
      const canvasY = (screenY - canvasState.panY) / canvasState.zoom;

      const newSticky: StickyNoteData = {
        id: `sticky-${Date.now()}-${Math.random()}`,
        x: canvasX,
        y: canvasY,
        width: DEFAULT_STICKY_WIDTH,
        height: DEFAULT_STICKY_HEIGHT,
        color: selectedStickyColor,
        text: '',
      };

      setStickies(prev => [...prev, newSticky]);
      setSelectedStickyIds(new Set([newSticky.id]));
      setSelectedTool('cursor');
      setShowColorPicker(false);
    } else if (selectedTool === 'cursor') {
      // Deselect all when clicking on canvas
      setSelectedStickyIds(new Set());
    }
  };

  // Handle panning with global mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    // Check if clicking on canvas background
    const target = e.target as HTMLElement;
    const isCanvasClick = target === e.currentTarget || target.tagName === 'CANVAS';

    if (isSpacePressed) {
      e.preventDefault();
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    } else if (isCanvasClick && selectedTool === 'cursor') {
      // Start selection box
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      setIsSelecting(true);
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;
      setSelectionStart({ x: startX, y: startY });
      setSelectionEnd({ x: startX, y: startY });
    }
  };

  // Global mouse events for panning and selection
  useEffect(() => {
    if (!isDragging && !isSelecting) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && isSpacePressed) {
        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;

        setCanvasState(prev => ({
          ...prev,
          panX: prev.panX + deltaX,
          panY: prev.panY + deltaY,
        }));

        setLastMousePos({ x: e.clientX, y: e.clientY });
      } else if (isSelecting) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        setSelectionEnd({ x: endX, y: endY });

        // Update selection in real-time
        const selBoxLeft = Math.min(selectionStart.x, endX);
        const selBoxRight = Math.max(selectionStart.x, endX);
        const selBoxTop = Math.min(selectionStart.y, endY);
        const selBoxBottom = Math.max(selectionStart.y, endY);

        const newSelected = new Set<string>();
        stickies.forEach(sticky => {
          // Convert sticky position to screen coordinates
          const stickyScreenX = (sticky.x * canvasState.zoom) + canvasState.panX;
          const stickyScreenY = (sticky.y * canvasState.zoom) + canvasState.panY;
          const stickyScreenWidth = sticky.width * canvasState.zoom;
          const stickyScreenHeight = sticky.height * canvasState.zoom;

          // Check intersection
          if (
            stickyScreenX < selBoxRight &&
            stickyScreenX + stickyScreenWidth > selBoxLeft &&
            stickyScreenY < selBoxBottom &&
            stickyScreenY + stickyScreenHeight > selBoxTop
          ) {
            newSelected.add(sticky.id);
          }
        });

        setSelectedStickyIds(newSelected);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
      if (isSelecting) {
        setIsSelecting(false);
        // Only set the flag if we actually selected something (dragged more than a few pixels)
        const draggedDistance = Math.abs(selectionEnd.x - selectionStart.x) + Math.abs(selectionEnd.y - selectionStart.y);
        if (draggedDistance > 5) {
          setJustFinishedSelecting(true);
          // Clear the flag after a brief delay
          setTimeout(() => {
            setJustFinishedSelecting(false);
          }, 100);
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isSelecting, isSpacePressed, lastMousePos, selectionStart, selectionEnd, stickies, canvasState]);

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
    if (tool === 'sticky') {
      setShowColorPicker(true);
    } else {
      setShowColorPicker(false);
    }
  }, []);

  // Sticky note handlers
  const handleStickyEdit = useCallback((id: string, text: string) => {
    setStickies(prev => prev.map(s => s.id === id ? { ...s, text } : s));
  }, []);

  const handleStickyMove = useCallback((id: string, x: number, y: number) => {
    setStickies(prev => prev.map(s => s.id === id ? { ...s, x, y } : s));
  }, []);

  const handleMultiStickyDragStart = useCallback(() => {
    // Store initial positions of all selected stickies at drag start
    const initialPos = new Map<string, {x: number, y: number}>();
    stickies.forEach(s => {
      if (selectedStickyIds.has(s.id)) {
        initialPos.set(s.id, { x: s.x, y: s.y });
      }
    });
    multiDragInitialPositions.current = initialPos;
  }, [stickies, selectedStickyIds]);

  const handleMultiStickyMove = useCallback((draggedId: string, newX: number, newY: number, startX: number, startY: number) => {
    const deltaX = newX - startX;
    const deltaY = newY - startY;

    setStickies(prev => prev.map(s => {
      if (!selectedStickyIds.has(s.id)) return s;

      const initialPos = multiDragInitialPositions.current.get(s.id);
      if (!initialPos) return s;

      // Apply delta to initial positions
      return { ...s, x: initialPos.x + deltaX, y: initialPos.y + deltaY };
    }));
  }, [selectedStickyIds]);

  const handleStickyResize = useCallback((id: string, width: number, height: number) => {
    setStickies(prev => prev.map(s => s.id === id ? { ...s, width, height } : s));
  }, []);

  const handleStickySelect = useCallback((id: string) => {
    setSelectedStickyIds(new Set([id]));
  }, []);

  const getCursor = () => {
    if (isSpacePressed) return isDragging ? 'grabbing' : 'grab';
    if (selectedTool === 'sticky') return 'crosshair';
    return 'default';
  };

  return (
    <>
      {/* Board Bar */}
      <BoardBar />

      {/* Collaboration Bar */}
      <CollaborationBar />

      {/* Sticky Color Picker */}
      {showColorPicker && (
        <StickyColorPicker
          selectedColor={selectedStickyColor}
          onColorSelect={setSelectedStickyColor}
        />
      )}

      <div
        ref={containerRef}
        className="w-full h-full overflow-hidden"
        style={{
          cursor: getCursor(),
          height: '100vh',
          width: '100vw',
          position: 'relative',
          userSelect: isSpacePressed ? 'none' : 'auto',
        }}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />

        {/* Sticky notes overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {stickies.map((sticky) => (
            <StickyNote
              key={sticky.id}
              sticky={sticky}
              isSelected={selectedStickyIds.has(sticky.id)}
              hasMultipleSelected={selectedStickyIds.size > 1}
              zoom={canvasState.zoom}
              panX={canvasState.panX}
              panY={canvasState.panY}
              onEdit={handleStickyEdit}
              onMove={handleStickyMove}
              onMultiMove={handleMultiStickyMove}
              onMultiDragStart={handleMultiStickyDragStart}
              onResize={handleStickyResize}
              onSelect={handleStickySelect}
            />
          ))}

          {/* Selection box */}
          {isSelecting && (
            <div
              style={{
                position: 'absolute',
                left: `${Math.min(selectionStart.x, selectionEnd.x)}px`,
                top: `${Math.min(selectionStart.y, selectionEnd.y)}px`,
                width: `${Math.abs(selectionEnd.x - selectionStart.x)}px`,
                height: `${Math.abs(selectionEnd.y - selectionStart.y)}px`,
                backgroundColor: 'rgba(66, 133, 244, 0.1)',
                border: '2px solid var(--colors-blue500)',
                pointerEvents: 'none',
                zIndex: 1001,
              }}
            />
          )}

          {/* Group selection bounding box */}
          {selectedStickyIds.size > 1 && (() => {
            // Get fresh sticky data from current state
            const selectedStickies = stickies.filter(s => selectedStickyIds.has(s.id));
            if (selectedStickies.length === 0) return null;

            // Calculate bounding box in screen space using current positions
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            selectedStickies.forEach(sticky => {
              const screenX = (sticky.x * canvasState.zoom) + canvasState.panX;
              const screenY = (sticky.y * canvasState.zoom) + canvasState.panY;
              const screenWidth = sticky.width * canvasState.zoom;
              const screenHeight = sticky.height * canvasState.zoom;

              minX = Math.min(minX, screenX);
              minY = Math.min(minY, screenY);
              maxX = Math.max(maxX, screenX + screenWidth);
              maxY = Math.max(maxY, screenY + screenHeight);
            });

            const padding = 4;

            const handleGroupResize = (e: React.MouseEvent, corner: string) => {
              e.stopPropagation();

              const startScreenX = e.clientX;
              const startScreenY = e.clientY;
              const startBoundingBox = { minX, minY, maxX, maxY };

              // Store initial positions and sizes of all selected stickies
              const initialStickies = selectedStickies.map(sticky => ({
                id: sticky.id,
                x: sticky.x,
                y: sticky.y,
                width: sticky.width,
                height: sticky.height
              }));

              const boundingWidth = maxX - minX;
              const boundingHeight = maxY - minY;
              const aspectRatio = boundingWidth / boundingHeight;

              const handleMouseMove = (e: MouseEvent) => {
                const deltaScreenX = e.clientX - startScreenX;
                const deltaScreenY = e.clientY - startScreenY;
                const deltaCanvasX = deltaScreenX / canvasState.zoom;
                const deltaCanvasY = deltaScreenY / canvasState.zoom;

                let scale = 1;
                let newMinX = startBoundingBox.minX;
                let newMinY = startBoundingBox.minY;

                // Calculate scale based on corner, maintaining aspect ratio
                if (corner === 'se') {
                  const sizeChange = Math.max(deltaScreenX, deltaScreenY / aspectRatio);
                  scale = (boundingWidth + sizeChange) / boundingWidth;
                } else if (corner === 'sw') {
                  const sizeChange = Math.max(-deltaScreenX, deltaScreenY / aspectRatio);
                  scale = (boundingWidth + sizeChange) / boundingWidth;
                  newMinX = startBoundingBox.minX - sizeChange;
                } else if (corner === 'ne') {
                  const sizeChange = Math.max(deltaScreenX, -deltaScreenY / aspectRatio);
                  scale = (boundingWidth + sizeChange) / boundingWidth;
                  newMinY = startBoundingBox.minY - (boundingWidth + sizeChange) / aspectRatio + boundingHeight;
                } else if (corner === 'nw') {
                  const sizeChange = Math.max(-deltaScreenX, -deltaScreenY / aspectRatio);
                  scale = (boundingWidth + sizeChange) / boundingWidth;
                  newMinX = startBoundingBox.minX - sizeChange;
                  newMinY = startBoundingBox.minY - (boundingWidth + sizeChange) / aspectRatio + boundingHeight;
                }

                // Minimum scale
                scale = Math.max(0.1, scale);

                // Convert screen bounding box origin to canvas space
                const originCanvasX = (startBoundingBox.minX - canvasState.panX) / canvasState.zoom;
                const originCanvasY = (startBoundingBox.minY - canvasState.panY) / canvasState.zoom;

                // Apply scale and position to all selected stickies
                setStickies(prev => prev.map(sticky => {
                  const initial = initialStickies.find(s => s.id === sticky.id);
                  if (!initial) return sticky;

                  // Calculate relative position from origin
                  const relX = initial.x - originCanvasX;
                  const relY = initial.y - originCanvasY;

                  // Apply scale
                  const newX = originCanvasX + (relX * scale);
                  const newY = originCanvasY + (relY * scale);
                  const newWidth = initial.width * scale;
                  const newHeight = initial.height * scale;

                  return {
                    ...sticky,
                    x: newX,
                    y: newY,
                    width: Math.max(100, newWidth),
                    height: Math.max(100, newHeight)
                  };
                }));
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            };

            return (
              <div
                style={{
                  position: 'absolute',
                  left: `${minX - padding}px`,
                  top: `${minY - padding}px`,
                  width: `${maxX - minX + padding * 2}px`,
                  height: `${maxY - minY + padding * 2}px`,
                  border: '2px solid var(--colors-blue500)',
                  pointerEvents: 'none',
                  zIndex: 999,
                }}
              >
                {/* Resize handles - only corners */}
                {['nw', 'ne', 'sw', 'se'].map((corner) => {
                  let top, left, right, bottom, cursor;

                  if (corner.includes('n')) {
                    top = '-6px';
                    cursor = corner.includes('w') ? 'nw-resize' : 'ne-resize';
                  }
                  if (corner.includes('s')) {
                    bottom = '-6px';
                    cursor = corner.includes('w') ? 'sw-resize' : 'se-resize';
                  }
                  if (corner.includes('w')) {
                    left = '-6px';
                  }
                  if (corner.includes('e')) {
                    right = '-6px';
                  }

                  return (
                    <div
                      key={corner}
                      onMouseDown={(e) => handleGroupResize(e, corner)}
                      style={{
                        position: 'absolute',
                        top,
                        left,
                        right,
                        bottom,
                        width: '12px',
                        height: '12px',
                        background: 'white',
                        border: '2px solid var(--colors-blue500)',
                        borderRadius: '50%',
                        cursor,
                        zIndex: 10,
                        pointerEvents: 'auto',
                      }}
                    />
                  );
                })}
              </div>
            );
          })()}
        </div>
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