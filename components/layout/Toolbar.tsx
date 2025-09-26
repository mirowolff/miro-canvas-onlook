'use client';

import React, { useState } from 'react';
import {
  IconCursorFilled,
  IconArrowCurvesBottomRight,
  IconArticle,
  IconDiagramming,
  IconTable,
  IconPrototypeFormat,
  IconSlideFormat,
  IconImage,
  IconStickyNote,
  IconPlusSquare,
  IconSingleSparksFilled,
  IconSparksFilled,
  IconLayout,
  IconTextT,
  IconShapesLines,
  IconPenTip,
  IconFrame,
  IconSmileySticker,
  IconChatLinesTwo,
  IconArrowArcLeft,
  IconArrowArcRight
} from '@mirohq/design-system-icons';

interface ToolbarProps {
  selectedTool?: string;
  onToolSelect?: (tool: string) => void;
}

export default function Toolbar({ selectedTool = 'cursor', onToolSelect }: ToolbarProps) {
  const [isAiMode, setIsAiMode] = useState(false);

  const aiModeTools = [
    { id: 'cursor', icon: IconCursorFilled, label: 'Select' },
    { id: 'arrow', icon: IconArrowCurvesBottomRight, label: 'Arrow' },
    { id: 'text', icon: IconArticle, label: 'Text' },
    { id: 'shapes', icon: IconDiagramming, label: 'Shapes' },
    { id: 'table', icon: IconTable, label: 'Table' },
    { id: 'prototype', icon: IconPrototypeFormat, label: 'Prototype' },
    { id: 'slides', icon: IconSlideFormat, label: 'Slides' },
    { id: 'image', icon: IconImage, label: 'Image' },
    { id: 'sticky', icon: IconStickyNote, label: 'Sticky Note' },
    { id: 'more', icon: IconPlusSquare, label: 'More tools' },
  ];

  const normalModeTools = [
    { id: 'cursor', icon: IconCursorFilled, label: 'Select' },
    { id: 'layout', icon: IconLayout, label: 'Layout' },
    { id: 'sticky', icon: IconStickyNote, label: 'Sticky Note' },
    { id: 'text', icon: IconTextT, label: 'Text' },
    { id: 'shapes', icon: IconShapesLines, label: 'Shapes' },
    { id: 'pen', icon: IconPenTip, label: 'Pen' },
    { id: 'frame', icon: IconFrame, label: 'Frame' },
    { id: 'sticker', icon: IconSmileySticker, label: 'Sticker' },
    { id: 'chat', icon: IconChatLinesTwo, label: 'Chat' },
    { id: 'more', icon: IconPlusSquare, label: 'More tools' },
  ];

  const tools = isAiMode ? aiModeTools : normalModeTools;

  const handleToolClick = (toolId: string) => {
    onToolSelect?.(toolId);
  };

  const handleSwitchToggle = () => {
    setIsAiMode(!isAiMode);
  };

  return (
    <>
      <div className="toolbar-container">
        {/* AI FAB Button */}
        <button className="ai-fab-button" title="AI Assistant">
          <IconSparksFilled />
        </button>

        <div className={`toolbar ${isAiMode ? 'ai-mode' : 'normal-mode'}`}>
          {/* AI Mode Switch */}
          <button
            className="switch-container"
            onClick={handleSwitchToggle}
            title={isAiMode ? "AI Mode Active" : "AI Mode Inactive"}
          >
            <div className={`switch-track ${isAiMode ? 'active' : 'inactive'}`}>
              <div className={`switch-thumb ${isAiMode ? 'active' : 'inactive'}`}>
                <IconSingleSparksFilled />
              </div>
            </div>
          </button>

          {/* Divider */}
          <div className="divider"></div>

          {/* Tool buttons */}
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            const isSelected = selectedTool === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className={`tool-button ${isSelected ? 'selected' : ''}`}
                title={tool.label}
              >
                <div className="icon-container">
                  <IconComponent />
                </div>
              </button>
            );
          })}
        </div>

        {/* Undo/Redo Panel */}
        <div className={`undo-redo-panel ${isAiMode ? 'ai-mode' : 'normal-mode'}`}>
          <button className="undo-button" title="Undo">
            <div className="icon-container">
              <IconArrowArcLeft />
            </div>
          </button>
          <button className="redo-button" title="Redo">
            <div className="icon-container">
              <IconArrowArcRight />
            </div>
          </button>
        </div>
      </div>

      {/* SVG Gradient Definitions */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="toolbar-sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(42.9)">
            <stop offset="13.33%" stopColor="#314CD9" />
            <stop offset="27.99%" stopColor="#6355E3" />
            <stop offset="57.31%" stopColor="#975EED" />
            <stop offset="86.64%" stopColor="#C966F6" />
          </linearGradient>
          <linearGradient id="ai-fab-gradient" x1="15.2857" y1="49.4286" x2="49.1429" y2="13" gradientUnits="userSpaceOnUse">
            <stop stopColor="#314CD9" />
            <stop offset="0.2" stopColor="#6355E3" />
            <stop offset="0.6" stopColor="#975EED" />
            <stop offset="1" stopColor="#C966F6" />
          </linearGradient>
        </defs>
      </svg>

      <style>{`
        .toolbar-container {
          position: fixed;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .ai-fab-button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 0.5px solid #e9eaef;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 8px rgba(34, 36, 40, 0.05);
          transition: transform 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .ai-fab-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #314CD9 0%, #6355E3 20%, #975EED 60%, #C966F6 100%);
          border-radius: 50%;
          transition: transform 0.5s ease;
          z-index: 1;
        }

        .ai-fab-button:hover {
          transform: scale(1.05);
        }

        .ai-fab-button:hover::before {
          transform: rotate(180deg);
        }

        .ai-fab-button svg {
          width: 24px;
          height: 24px;
          fill: white !important;
          position: relative;
          z-index: 2;
        }

        .ai-fab-button svg * {
          fill: white !important;
        }

        .toolbar {
          display: flex;
          flex-direction: column;
          border-radius: 8px;
          box-shadow: 0 4px 12px var(--colors-alpha-black200);
          padding: 8px 4px 4px 4px;
        }

        .toolbar.ai-mode {
          background: linear-gradient(to bottom, white, #cbc6ff);
        }

        .toolbar.normal-mode {
          background: white;
        }

        .tool-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: transparent;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          margin: 2px 0;
          transition: all 0.2s ease-in-out;
        }

        .toolbar.ai-mode .tool-button:hover {
          background-color: #eae7ff;
        }

        .toolbar.ai-mode .tool-button.selected {
          background-color: #eae7ff;
          color: #6631d8;
        }

        .toolbar.normal-mode .tool-button:hover {
          background-color: #e8ecfc;
        }

        .toolbar.normal-mode .tool-button.selected {
          background-color: #e8ecfc;
          color: #3859ff;
        }

        .icon-container {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .switch-container {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          margin: 2px 0;
        }

        .switch-track {
          width: 36px;
          height: 24px;
          border-radius: 12px;
          position: relative;
          transition: all 0.3s ease;
        }

        .switch-track.inactive {
          background-color: #e9eaef;
        }

        .switch-track.active {
          background: linear-gradient(135deg, #314cd9 0%, #6355e3 20%, #975eed 60%, #c966f6 100%);
        }

        .switch-thumb {
          width: 20px;
          height: 20px;
          border-radius: 10px;
          background-color: white;
          position: absolute;
          top: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(34, 36, 40, 0.08);
        }

        .switch-thumb.inactive {
          left: 2px;
        }

        .switch-thumb.active {
          left: 14px;
        }

        .switch-thumb svg {
          width: 12px;
          height: 12px;
        }

        .switch-thumb.inactive svg {
          fill: #212428 !important;
          color: #212428 !important;
        }

        .switch-thumb.inactive svg * {
          fill: #212428 !important;
          color: #212428 !important;
        }

        .switch-thumb.active svg {
          fill: url(#toolbar-sparkle-gradient) !important;
          color: url(#toolbar-sparkle-gradient) !important;
        }

        .switch-thumb.active svg * {
          fill: url(#toolbar-sparkle-gradient) !important;
          color: url(#toolbar-sparkle-gradient) !important;
        }

        .divider {
          height: 1px;
          background-color: #e0e0e0;
          margin: 8px 4px;
        }

        .undo-redo-panel {
          display: flex;
          flex-direction: column;
          border-radius: 8px;
          box-shadow: 0 4px 12px var(--colors-alpha-black200);
          padding: 4px;
        }

        .undo-redo-panel.ai-mode {
          background: white;
        }

        .undo-redo-panel.normal-mode {
          background: white;
        }

        .undo-button, .redo-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: transparent;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          margin: 2px 0;
          transition: all 0.2s ease-in-out;
        }

        .undo-redo-panel.ai-mode .undo-button:hover,
        .undo-redo-panel.ai-mode .redo-button:hover {
          background-color: #eae7ff;
        }

        .undo-redo-panel.normal-mode .undo-button:hover,
        .undo-redo-panel.normal-mode .redo-button:hover {
          background-color: #e8ecfc;
        }
      `}</style>
    </>
  );
}
