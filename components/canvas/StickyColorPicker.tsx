'use client';

import React from 'react';
import { IconStickyNoteStack } from '@mirohq/design-system-icons';

export const STICKY_COLORS = [
  { id: 'yellow-light', color: '#FEF59B' },
  { id: 'yellow', color: '#FFF179' },
  { id: 'orange', color: '#FFC996' },
  { id: 'pink', color: '#FFB3D7' },
  { id: 'pink-light', color: '#F5D0FE' },
  { id: 'purple', color: '#E9B3FF' },
  { id: 'blue-light', color: '#B3D7FF' },
  { id: 'blue-medium', color: '#CDB3FF' },
  { id: 'cyan', color: '#ADEFFF' },
  { id: 'blue', color: '#9DD7FF' },
  { id: 'teal', color: '#99F3DC' },
  { id: 'green', color: '#B3F5A3' },
  { id: 'lime-light', color: '#E5FFA3' },
  { id: 'lime', color: '#CFFF8D' },
  { id: 'white', color: '#FFFFFF' },
  { id: 'black', color: '#1A1A1A' },
];

interface StickyColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export default function StickyColorPicker({
  selectedColor,
  onColorSelect,
}: StickyColorPickerProps) {
  return (
    <>
      <div className="sticky-color-picker-container">
        <div className="sticky-color-picker">
          <div className="color-grid">
            {STICKY_COLORS.map((colorOption) => (
              <button
                key={colorOption.id}
                className={`color-swatch ${selectedColor === colorOption.color ? 'selected' : ''}`}
                style={{ backgroundColor: colorOption.color }}
                onClick={() => onColorSelect(colorOption.color)}
                title={colorOption.id}
              >
                {selectedColor === colorOption.color && (
                  <div className="check-mark">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.3333 4L6 11.3333L2.66667 8"
                        stroke={colorOption.id === 'black' ? '#FFFFFF' : colorOption.id === 'white' ? '#1A1A1A' : '#FFFFFF'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="picker-divider" />

          <button className="stack-button button-secondary">
            <IconStickyNoteStack />
            <span>Stack</span>
          </button>

          <button className="templates-button button-secondary">Templates</button>
          <button className="bulk-mode-button button-ghost">Bulk mode</button>
        </div>
      </div>

      <style>{`
        .sticky-color-picker-container {
          position: fixed;
          left: 64px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1002;
          user-select: none;
        }

        .sticky-color-picker {
          background: var(--colors-white);
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
          padding: 8px;
          width: 152px;
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
          margin-bottom: 6px;
        }

        .color-swatch {
          width: 100%;
          height: 64px;
          border-radius: 4px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 0;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
        }

        .color-swatch:hover {
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .color-swatch.selected {
          border-color: var(--colors-blue500);
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 0 2px var(--colors-blue500);
        }

        .check-mark {
          display: none;
        }

        .picker-divider {
          height: 1px;
          background: var(--colors-gray200);
          margin: 6px 0;
        }

        /* Button base styles */
        .button-secondary,
        .button-ghost {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.15s ease;
          font-family: var(--font-noto-sans), system-ui, sans-serif;
          margin-bottom: 4px;
        }

        /* Secondary button style */
        .button-secondary {
          background: var(--colors-gray100);
          color: var(--colors-gray900);
        }

        .button-secondary:hover {
          background: var(--colors-gray200);
        }

        .button-secondary:active {
          background: var(--colors-gray250);
        }

        /* Ghost button style */
        .button-ghost {
          background: transparent;
          color: var(--colors-gray900);
        }

        .button-ghost:hover {
          background: var(--colors-gray100);
        }

        .button-ghost:active {
          background: var(--colors-gray200);
        }

        /* Icon sizing */
        .stack-button svg,
        .templates-button svg,
        .bulk-mode-button svg {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }

        /* Remove margin from last button */
        .bulk-mode-button {
          margin-bottom: 0;
        }
      `}</style>
    </>
  );
}