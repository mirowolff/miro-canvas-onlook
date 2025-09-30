'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface StickyNoteData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text: string;
  selected?: boolean;
}

interface StickyNoteProps {
  sticky: StickyNoteData;
  isSelected: boolean;
  hasMultipleSelected: boolean;
  zoom: number;
  panX: number;
  panY: number;
  onEdit: (id: string, text: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onMultiMove: (draggedId: string, newX: number, newY: number, startX: number, startY: number) => void;
  onMultiDragStart: () => void;
  onResize: (id: string, width: number, height: number) => void;
  onSelect: (id: string) => void;
}

export default function StickyNote({
  sticky,
  isSelected,
  hasMultipleSelected,
  zoom,
  panX,
  panY,
  onEdit,
  onMove,
  onMultiMove,
  onMultiDragStart,
  onResize,
  onSelect
}: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(sticky.text);
  const [localPos, setLocalPos] = useState({ x: sticky.x, y: sticky.y });
  const [localSize, setLocalSize] = useState({ width: sticky.width, height: sticky.height });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);

  // Update local state when props change (but not during drag/resize)
  useEffect(() => {
    if (!isDraggingRef.current && !isResizingRef.current) {
      setLocalPos({ x: sticky.x, y: sticky.y });
    }
  }, [sticky.x, sticky.y, sticky.id]);

  useEffect(() => {
    if (!isResizingRef.current) {
      setLocalSize({ width: sticky.width, height: sticky.height });
    }
  }, [sticky.width, sticky.height]);

  // Calculate font size to fit text without scrolling
  const calculateFontSize = () => {
    const textLength = sticky.text.length;

    if (textLength === 0) return 20;

    // Calculate available area (accounting for padding)
    const availableWidth = localSize.width - 32; // 16px padding on each side
    const availableHeight = localSize.height - 32;
    const availableArea = availableWidth * availableHeight;

    // Estimate characters per line and number of lines needed
    // Average character width is roughly 0.6 * fontSize
    // Line height is 1.4 * fontSize

    // Start with a larger font and work down if needed
    let fontSize = 24;
    const minFontSize = 12;
    const maxFontSize = 48;

    // Binary search for the right font size
    while (fontSize > minFontSize) {
      const charWidth = fontSize * 0.6;
      const lineHeight = fontSize * 1.4;
      const charsPerLine = Math.floor(availableWidth / charWidth);
      const estimatedLines = Math.ceil(textLength / charsPerLine);
      const estimatedHeight = estimatedLines * lineHeight;

      if (estimatedHeight <= availableHeight) {
        break;
      }

      fontSize -= 1;
    }

    return Math.max(minFontSize, Math.min(maxFontSize, fontSize));
  };

  const fontSize = calculateFontSize();

  // Calculate screen position
  const screenX = (localPos.x * zoom) + panX;
  const screenY = (localPos.y * zoom) + panY;
  const screenWidth = localSize.width * zoom;
  const screenHeight = localSize.height * zoom;

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging) {
      setIsEditing(true);
      setEditText(sticky.text);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.select();
        }
      }, 0);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    onSelect(sticky.id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;

    e.stopPropagation();
    onSelect(sticky.id);

    const startScreenX = e.clientX;
    const startScreenY = e.clientY;
    const startCanvasX = localPos.x;
    const startCanvasY = localPos.y;

    let hasMoved = false;
    let hasCalledOnMove = false; // Guard to prevent multiple calls
    let finalX = startCanvasX;
    let finalY = startCanvasY;

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasMoved) {
        isDraggingRef.current = true;
        setIsDragging(true);
        hasMoved = true;

        // Store initial positions for multi-select
        if (hasMultipleSelected && isSelected) {
          onMultiDragStart();
        }
      }

      // Calculate delta in screen space
      const deltaScreenX = e.clientX - startScreenX;
      const deltaScreenY = e.clientY - startScreenY;

      // Convert to canvas space
      const deltaCanvasX = deltaScreenX / zoom;
      const deltaCanvasY = deltaScreenY / zoom;

      finalX = startCanvasX + deltaCanvasX;
      finalY = startCanvasY + deltaCanvasY;

      setLocalPos({ x: finalX, y: finalY });
    };

    const handleMouseUp = () => {
      // Clean up listeners first
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Guard against duplicate calls
      if (hasCalledOnMove) {
        return;
      }
      hasCalledOnMove = true;

      if (hasMoved) {
        if (hasMultipleSelected && isSelected) {
          onMultiMove(sticky.id, finalX, finalY, startCanvasX, startCanvasY);
        } else {
          onMove(sticky.id, finalX, finalY);
        }
      }

      isDraggingRef.current = false;
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, corner: string) => {
    if (isEditing) return;
    e.stopPropagation();

    isResizingRef.current = true;
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = localSize.width;
    const startHeight = localSize.height;
    const startPosX = localPos.x;
    const startPosY = localPos.y;
    const aspectRatio = startWidth / startHeight;

    // Track final values in local variables
    let finalWidth = startWidth;
    let finalHeight = startHeight;
    let finalX = startPosX;
    let finalY = startPosY;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - startX) / zoom;
      const deltaY = (e.clientY - startY) / zoom;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      // Calculate size change based on corner, maintaining aspect ratio
      let sizeChange = 0;

      if (corner === 'se') {
        // Use the larger delta to determine size
        sizeChange = Math.max(deltaX, deltaY / aspectRatio);
        newWidth = Math.max(100, startWidth + sizeChange);
        newHeight = newWidth / aspectRatio;
      } else if (corner === 'sw') {
        sizeChange = Math.max(-deltaX, deltaY / aspectRatio);
        newWidth = Math.max(100, startWidth + sizeChange);
        newHeight = newWidth / aspectRatio;
        if (newWidth > 100) {
          newX = startPosX - sizeChange;
        }
      } else if (corner === 'ne') {
        sizeChange = Math.max(deltaX, -deltaY / aspectRatio);
        newWidth = Math.max(100, startWidth + sizeChange);
        newHeight = newWidth / aspectRatio;
        if (newHeight > 100) {
          newY = startPosY - (newHeight - startHeight);
        }
      } else if (corner === 'nw') {
        sizeChange = Math.max(-deltaX, -deltaY / aspectRatio);
        newWidth = Math.max(100, startWidth + sizeChange);
        newHeight = newWidth / aspectRatio;
        if (newWidth > 100 && newHeight > 100) {
          newX = startPosX - sizeChange;
          newY = startPosY - (newHeight - startHeight);
        }
      }

      // Update local variables with final values
      finalWidth = newWidth;
      finalHeight = newHeight;
      finalX = newX;
      finalY = newY;

      setLocalSize({ width: newWidth, height: newHeight });
      setLocalPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      // Use the final values from local variables instead of state
      onResize(sticky.id, finalWidth, finalHeight);
      if (finalX !== startPosX || finalY !== startPosY) {
        onMove(sticky.id, finalX, finalY);
      }
      isResizingRef.current = false;
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(e.target.value);
  };

  const handleTextBlur = () => {
    setIsEditing(false);
    onEdit(sticky.id, editText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(sticky.text);
    }
    e.stopPropagation();
  };

  return (
    <>
      <div
        ref={stickyRef}
        data-sticky-id={sticky.id}
        style={{
          position: 'absolute',
          left: `${screenX}px`,
          top: `${screenY}px`,
          width: `${screenWidth}px`,
          height: `${screenHeight}px`,
          pointerEvents: 'auto',
          cursor: isEditing ? 'text' : 'move',
          userSelect: 'none',
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: sticky.color,
            boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0px 4px 8px 0px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0px 2px 4px 0px rgba(0, 0, 0, 0.25)';
          }}
        >
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={editText}
              onChange={handleTextChange}
              onBlur={handleTextBlur}
              onKeyDown={handleKeyDown}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                height: '100%',
                padding: '16px',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                resize: 'none',
                fontFamily: 'var(--font-noto-sans), system-ui, sans-serif',
                fontWeight: 400,
                color: '#1a1a1a',
                lineHeight: 1.4,
                fontSize: `${fontSize * zoom}px`,
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                padding: '16px',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                overflow: 'hidden',
                fontFamily: 'var(--font-noto-sans), system-ui, sans-serif',
                fontWeight: 400,
                color: '#1a1a1a',
                lineHeight: 1.4,
                whiteSpace: 'pre-wrap',
                fontSize: `${fontSize * zoom}px`,
              }}
            >
              {sticky.text || ''}
            </div>
          )}
        </div>

        {isSelected && !isEditing && (
          <>
            {/* Selection border */}
            <div
              style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                border: '2px solid var(--colors-blue500)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />

            {/* Resize handles - only show on individual sticky if not in multi-select */}
            {!hasMultipleSelected && ['nw', 'ne', 'sw', 'se'].map((corner) => {
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
                  onMouseDown={(e) => handleResizeMouseDown(e, corner)}
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
                  }}
                />
              );
            })}
          </>
        )}
      </div>
    </>
  );
}