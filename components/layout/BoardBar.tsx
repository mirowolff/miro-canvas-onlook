'use client';

import React from 'react';
import {
  IconLinesThreeHorizontal,
  IconDotsThreeVertical
} from '@mirohq/design-system-icons';

export default function BoardBar() {
  return (
    <>
      <div className="board-bar-container">
        <div className="board-bar">
          {/* Left section */}
          <div className="left-section">
            {/* Hamburger menu */}
            <button className="menu-button" title="Menu">
              <IconLinesThreeHorizontal />
            </button>

            {/* Miro logo */}
            <div className="logo-container">
              <svg width="65" height="24" viewBox="0 0 65 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_994_9618)">
                  <path d="M36.4104 13.9198V22.8876H40.084V14.4696C40.084 10.7204 45.1876 10.7144 45.1876 10.7144V7.0658C45.1876 7.0658 43.7606 7.12925 42.6333 7.38303C39.4363 8.10206 36.4104 9.67911 36.4104 13.9198Z" fill="#222428" />
                  <path d="M8.71746 6.88446C10.1484 6.88446 11.9366 7.69413 12.9102 9.11811C13.9181 7.82304 15.5758 6.94891 17.6241 6.91568C20.226 6.88245 23.4431 8.5018 23.4431 13.3588V22.8765H19.7685V13.3588C19.7685 11.7395 18.5976 10.5753 16.8448 10.5753C15.092 10.5753 13.9201 11.7395 13.9201 13.3588V22.8765H10.2466V13.3588C10.2466 11.7395 9.07671 10.5753 7.3219 10.5753C5.56709 10.5753 4.36382 11.7395 4.36382 13.3588V22.8765H0.5V7.36685H4.36382V8.92476C5.40517 7.66292 6.93127 6.88446 8.71947 6.88446H8.71746Z" fill="#222428" />
                  <path d="M31.8909 7.56433V22.8877H28.1545V7.56433H31.8909Z" fill="#222428" />
                  <path d="M30.0225 5.12624C31.1744 5.12624 32.1083 4.197 32.1083 3.0507C32.1083 1.90441 31.1744 0.975159 30.0225 0.975159C28.8706 0.975159 27.9368 1.90441 27.9368 3.0507C27.9368 4.197 28.8706 5.12624 30.0225 5.12624Z" fill="#222428" />
                  <path d="M55.164 6.85126C50.6403 6.85126 46.9739 10.4998 46.9739 15.0014C46.9739 19.5029 50.6403 23.1515 55.164 23.1515C59.6876 23.1515 63.354 19.5029 63.354 15.0014C63.354 10.4998 59.6876 6.85126 55.164 6.85126ZM55.164 19.4868C52.6035 19.4868 50.5269 17.4213 50.5269 14.8724C50.5269 12.3236 52.6026 10.2581 55.164 10.2581C57.7253 10.2581 59.801 12.3236 59.801 14.8724C59.801 17.4213 57.7253 19.4868 55.164 19.4868Z" fill="#222428" />
                </g>
                <defs>
                  <clipPath id="clip0_994_9618">
                    <rect width="64" height="23.2727" fill="white" transform="translate(0.5 0.363647)" />
                  </clipPath>
                </defs>
              </svg>
            </div>

            {/* AI Beta badge */}
            <div className="ai-beta-badge">
              AI Beta
            </div>
          </div>

          {/* Center section */}
          <div className="center-section">
            {/* Leaf icon */}
            <div className="leaf-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.83362 11.0103L7.34631 10.9976C3.88828 10.9073 1.16663 7.73575 1.16663 3.9165V3.37354L1.70667 2.8335H2.16663C4.50312 2.8335 6.50722 4.22471 7.60901 6.29736L8.10999 7.23975L8.51331 6.25146C9.73477 3.25828 12.4588 1.1665 15.6666 1.1665H16.2926L16.8336 1.70654V2.4165C16.8336 7.12768 13.3538 10.9995 8.99963 10.9995H8.49963V16.8335H7.83362V11.0103Z" fill="url(#paint0_linear_2483_31751)" stroke="#22883F" />
                <defs>
                  <linearGradient id="paint0_linear_2483_31751" x1="8.99996" y1="0.666504" x2="8.99996" y2="17.3332" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4EBE6C" />
                    <stop offset="1" stopColor="#6BD98B" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Board title */}
            <span className="board-title">Roadmap brainstorm</span>

            {/* Internal badge */}
            <div className="internal-badge">
              Internal
            </div>
          </div>

          {/* Right section */}
          <div className="right-section">
            {/* Kebab menu */}
            <button className="kebab-button" title="More options">
              <IconDotsThreeVertical />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .board-bar-container {
          position: fixed;
          top: 8px;
          left: 8px;
          z-index: 1001;
        }

        .board-bar {
          display: flex;
          align-items: center;
          height: 48px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 0 16px;
          width: auto;
          font-family: 'Noto Sans', system-ui, sans-serif;
          gap: 20px;
        }

        .left-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .center-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .right-section {
          display: flex;
          align-items: center;
        }

        .menu-button, .kebab-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .menu-button:hover, .kebab-button:hover {
          background-color: #f4f5f7;
        }

        .menu-button svg, .kebab-button svg {
          width: 20px;
          height: 20px;
          fill: #222428;
        }

        .logo-container {
          display: flex;
          align-items: center;
          height: 32px;
          padding-bottom: 5px;
        }

        .ai-beta-badge {
          background: #dedaff;
          color: var(--text-neutrals);
          font-size: 12px;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 4px;
          white-space: nowrap;
        }

        .leaf-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .board-title {
          font-size: 16px;
          font-weight: 600;
          color: #222428;
          white-space: nowrap;
        }

        .internal-badge {
          background: #fff3cd;
          color: var(--sunshine-text);
          font-size: 12px;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 4px;
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}