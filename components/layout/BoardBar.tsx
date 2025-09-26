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
              <svg width="56" height="20" viewBox="0 0 56 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M31.9945 11.4614V19.4017H35.2676V11.9483C35.2676 8.62867 39.8145 8.62328 39.8145 8.62328V5.39276C39.8145 5.39276 38.5432 5.44886 37.5387 5.6736C34.6904 6.31024 31.9945 7.7067 31.9945 11.4614ZM7.32144 5.2322C8.59634 5.2322 10.1895 5.94917 11.057 7.20999C11.955 6.06328 13.4319 5.28931 15.2567 5.25992C17.5749 5.23041 20.4412 6.66424 20.4412 10.9647V19.3919H17.1674V10.9647C17.1674 9.531 16.1242 8.5002 14.5625 8.5002C13.0008 8.5002 11.9567 9.531 11.9567 10.9647V19.3919H8.68373V10.9647C8.68373 9.531 7.6414 8.5002 6.07792 8.5002C4.51455 8.5002 3.44253 9.531 3.44253 10.9647V19.3919H0V5.65935H3.44242V7.03877C4.37026 5.92146 5.72995 5.23231 7.32313 5.23231L7.32144 5.2322ZM27.9679 5.83417V19.402H24.639V5.83417H27.9679ZM26.3031 3.67551C27.3294 3.67551 28.1614 2.85262 28.1614 1.83764C28.1614 0.822889 27.3294 0 26.3031 0C25.2768 0 24.4448 0.822777 24.4448 1.83776C24.4448 2.85262 25.2768 3.67551 26.3031 3.67551ZM48.7029 5.20281C44.6726 5.20281 41.4059 8.43332 41.4059 12.4191C41.4059 16.4048 44.6726 19.6353 48.7029 19.6353C52.7334 19.6353 56 16.4048 56 12.4191C56 8.43332 52.7334 5.20281 48.7029 5.20281ZM48.7029 16.3906C46.4219 16.3906 44.5716 14.5618 44.5716 12.305C44.5716 10.0481 46.4209 8.21935 48.7029 8.21935C50.9851 8.21935 52.8343 10.0481 52.8343 12.305C52.8343 14.5618 50.9851 16.3906 48.7029 16.3906Z" fill="#222428"/>
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
                <path d="M7.83362 11.0103L7.34631 10.9976C3.88828 10.9073 1.16663 7.73575 1.16663 3.9165V3.37354L1.70667 2.8335H2.16663C4.50312 2.8335 6.50722 4.22471 7.60901 6.29736L8.10999 7.23975L8.51331 6.25146C9.73477 3.25828 12.4588 1.1665 15.6666 1.1665H16.2926L16.8336 1.70654V2.4165C16.8336 7.12768 13.3538 10.9995 8.99963 10.9995H8.49963V16.8335H7.83362V11.0103Z" fill="url(#paint0_linear_2483_31751)" stroke="#22883F"/>
                <defs>
                  <linearGradient id="paint0_linear_2483_31751" x1="8.99996" y1="0.666504" x2="8.99996" y2="17.3332" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4EBE6C"/>
                    <stop offset="1" stopColor="#6BD98B"/>
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
          color: #856404;
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