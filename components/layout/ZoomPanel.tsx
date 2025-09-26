'use client';

import React from 'react';
import { IconMinus, IconPlus, IconListBullets, IconQuestionMarkCircle } from '@mirohq/design-system-icons';

interface ZoomPanelProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onZoomToPercentage: (percentage: number) => void;
}

const ZOOM_PRESETS = [10, 25, 50, 75, 100, 125, 150, 200, 300, 400, 500];

export default function ZoomPanel({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onZoomToPercentage
}: ZoomPanelProps) {
  const zoomPercentage = Math.round(zoom * 100);

  const handleZoomDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const percentage = parseInt(e.target.value);
    onZoomToPercentage(percentage / 100);
  };

  return (
    <>
      <style jsx>{`
        .zoom-panel-container {
          position: fixed;
          bottom: 8px;
          right: 8px;
          z-index: 9999;
        }

        .zoom-panel {
          display: flex;
          align-items: center;
          background-color: var(--background-neutrals);
          border-radius: 8px;
          box-shadow: 0 4px 12px var(--colors-alpha-black200);
          border: 1px solid var(--border-neutrals);
          overflow: hidden;
          font-size: 14px;
          padding: 4px;
          transition: width 0.2s ease-in-out;
        }

        .zoom-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background-color: transparent;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s ease-in-out;
        }

        .zoom-button:hover {
          background-color: var(--background-neutrals-hover);
        }

        .zoom-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .zoom-button:disabled:hover {
          background-color: transparent;
        }

        .icon-container {
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .zoom-controls {
          display: flex;
          width: 0;
          overflow: hidden;
          transition: width 0.2s ease-in-out;
        }

        .zoom-panel:hover .zoom-controls {
          width: 48px;
        }

        .list-button {
          width: 0;
          overflow: hidden;
          transition: width 0.2s ease-in-out;
        }

        .zoom-panel:hover .list-button {
          width: 24px;
        }

        .zoom-dropdown-container {
          position: relative;
        }

        .zoom-dropdown {
          appearance: none;
          background-color: transparent;
          border: none;
          padding: 6px 8px;
          font-family: var(--font-noto-sans), system-ui, sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-neutrals);
          cursor: pointer;
          min-width: 60px;
          text-align: center;
          outline: none;
        }
      `}</style>

      <div className="zoom-panel-container">
        <div className="zoom-panel">
          {/* List/Menu button */}
          <button
            onClick={onFitToScreen}
            className="zoom-button list-button"
            title="Fit to screen"
          >
            <div className="icon-container">
              <IconListBullets />
            </div>
          </button>

          {/* Zoom controls - minus and plus together */}
          <div className="zoom-controls">
            {/* Zoom out button */}
            <button
              onClick={onZoomOut}
              disabled={zoom <= 0.1}
              className="zoom-button"
              title="Zoom out"
            >
              <div className="icon-container">
                <IconMinus />
              </div>
            </button>

            {/* Zoom in button */}
            <button
              onClick={onZoomIn}
              disabled={zoom >= 5}
              className="zoom-button"
              title="Zoom in"
            >
              <div className="icon-container">
                <IconPlus />
              </div>
            </button>
        </div>

          {/* Zoom percentage dropdown */}
          <div className="zoom-dropdown-container">
            <select
              value={zoomPercentage}
              onChange={handleZoomDropdown}
              className="zoom-dropdown"
              title="Zoom level"
            >
            {ZOOM_PRESETS.map(preset => (
              <option key={preset} value={preset}>
                {preset}%
              </option>
            ))}
            {!ZOOM_PRESETS.includes(zoomPercentage) && (
              <option value={zoomPercentage}>
                {zoomPercentage}%
              </option>
            )}
          </select>
        </div>

          {/* Help button */}
          <button
            className="zoom-button"
            title="Help"
          >
            <div className="icon-container">
              <IconQuestionMarkCircle />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}