'use client';

import React from 'react';
import {
  IconActivity,
  IconVideoCameraSimple,
  IconFactoryHouse
} from '@mirohq/design-system-icons';

export default function CollaborationBar() {
  // Example avatar data - you can modify these
  const avatars = [
    { id: 1, text: 'JD', color: '#FF6B6B' },
    { id: 2, text: 'AS', color: '#4ECDC4' },
    { id: 3, text: 'MK', color: '#45B7D1' },
    { id: 4, text: 'ME', color: '#8B2500', isMe: true },
    { id: 5, text: '7', color: '#E0E0E0', isCounter: true }
  ];

  return (
    <>
      <div className="collaboration-bar-container">
        <div className="collaboration-bar">
          {/* Left section - Tools */}
          <div className="tools-section">
            {/* Facilitation Tools - wider button */}
            <button className="facilitation-tools-button" title="Facilitation Tools">
              <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.6626 21.6583C18.673 21.1252 16.985 20.0281 15.7246 18.5852C16.3056 18.2287 16.8037 17.7672 17.2 17.2336C18.2115 18.4049 19.5728 19.2957 21.1803 19.7265C25.448 20.87 29.8347 18.3373 30.9782 14.0696C32.1218 9.80189 29.5891 5.41519 25.3214 4.27166C21.9603 3.37106 18.5254 4.75061 16.6591 7.46212L16.0225 5.08618C18.4655 2.5362 22.1871 1.36128 25.839 2.33981C31.1737 3.76922 34.3395 9.25259 32.9101 14.5873C31.4807 19.9219 25.9973 23.0877 20.6626 21.6583Z" fill="#1A1B1E"/>
                <path d="M22.2953 11.7587L23.6953 6.53402L25.6271 7.05166L24.486 11.3105L27.874 12.2183L27.3564 14.1501L23.0024 12.9835L22.2953 11.7587Z" fill="#1A1B1E"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M6.11552 8.08321L8.46344 16.8458L8.46716 16.8595C8.93732 18.6142 7.89602 20.4178 6.14134 20.888C4.38665 21.3581 2.58306 20.3168 2.11289 18.5622C1.64273 16.8075 2.68403 15.0039 4.43872 14.5337C4.88069 14.4153 5.32576 14.3928 5.75184 14.4534L3.96789 7.79555L4.50545 6.63312L12.1712 2.99911L13.5655 3.6439L16.1296 13.2132L16.1329 13.2256C16.6031 14.9803 15.5618 16.7839 13.8071 17.2541C12.0524 17.7242 10.2488 16.6829 9.77867 14.9282C9.3085 13.1736 10.3498 11.37 12.1045 10.8998C12.5465 10.7814 12.9915 10.7588 13.4176 10.8195L11.9441 5.32013L6.11552 8.08321ZM14.199 13.7355C14.0114 13.0524 13.3073 12.6481 12.6221 12.8317C11.9344 13.0159 11.5262 13.7229 11.7105 14.4106C11.8948 15.0984 12.6017 15.5065 13.2895 15.3222C13.9755 15.1384 14.3833 14.4346 14.2025 13.7485L14.2011 13.7434L14.199 13.7355ZM6.53535 17.3774L6.53297 17.3686C6.34512 16.686 5.64123 16.2821 4.95635 16.4656C4.2686 16.6498 3.86046 17.3568 4.04475 18.0445C4.22903 18.7323 4.93595 19.1404 5.6237 18.9561C6.3095 18.7724 6.71728 18.0689 6.53686 17.383L6.53535 17.3774Z" fill="#1A1B1E"/>
                <path d="M33.746 18.5759L33.4742 18.2884C33.842 17.6901 34.1606 17.0529 34.4232 16.381L35.1993 17.2019C35.5807 17.6053 36.0665 17.895 36.6028 18.0387L39.8471 18.908C41.2737 19.2902 42.7401 18.4436 43.1223 17.017L43.9309 13.9995C44.2167 12.9326 43.5836 11.8359 42.5167 11.55L39.4993 10.7415L38.9133 9.24052L40.7575 6.3288C41.0287 5.90074 40.8757 5.33235 40.4264 5.09815C40.0242 4.8885 39.5283 5.02495 39.29 5.41088L38.5034 6.68451C38.0751 7.378 37.511 7.97771 36.845 8.44759L35.0358 9.72397C34.9007 9.02674 34.7042 8.34592 34.4508 7.68903L35.692 6.81337C36.1377 6.49895 36.5151 6.09764 36.8017 5.63359L37.5883 4.35996C38.3774 3.08226 40.0191 2.6305 41.3508 3.32459C42.8384 4.09996 43.3448 5.98176 42.4471 7.39898L41.3306 9.1617L43.0343 9.61819C45.1682 10.19 46.4345 12.3833 45.8627 14.5172L45.0542 17.5347C44.386 20.0282 41.823 21.508 39.3295 20.8398L36.0852 19.9705C35.1914 19.731 34.3816 19.2482 33.746 18.5759Z" fill="#1A1B1E"/>
              </svg>
            </button>

            {/* Activity */}
            <button className="tool-button" title="Activity">
              <IconActivity />
            </button>

            {/* Video Camera */}
            <button className="tool-button" title="Video">
              <IconVideoCameraSimple />
            </button>
          </div>

          {/* Center section - Avatars */}
          <div className="avatars-section">
            {avatars.map((avatar, index) => (
              <div
                key={avatar.id}
                className={`avatar ${avatar.isMe ? 'me-avatar' : ''} ${avatar.isCounter ? 'counter-avatar' : ''}`}
                style={{
                  backgroundColor: avatar.color,
                  zIndex: avatars.length - index
                }}
              >
                {avatar.text}
              </div>
            ))}
          </div>

          {/* Right section - Action buttons */}
          <div className="actions-section">
            {/* Present button */}
            <button className="present-button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 2L13 8L3 14V2Z" fill="currentColor"/>
              </svg>
              Present
            </button>

            {/* Share button */}
            <button className="share-button">
              <IconFactoryHouse />
              Share
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .collaboration-bar-container {
          position: fixed;
          top: 8px;
          right: 8px;
          z-index: 1001;
        }

        .collaboration-bar {
          display: flex;
          align-items: center;
          height: 48px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 0 16px;
          gap: 12px;
          font-family: 'Noto Sans', system-ui, sans-serif;
        }

        .tools-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .facilitation-tools-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 32px;
          background: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .facilitation-tools-button:hover {
          background-color: #f4f5f7;
        }

        .facilitation-tools-button svg {
          width: 24px;
          height: 24px;
          fill: #222428;
        }

        .tool-button {
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

        .tool-button:hover {
          background-color: #f4f5f7;
        }

        .tool-button svg {
          width: 24px;
          height: 24px;
          fill: #222428;
        }

        .avatars-section {
          display: flex;
          align-items: center;
          position: relative;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: white;
          border: 2px solid white;
          margin-left: -8px;
          position: relative;
        }

        .avatar:first-child {
          margin-left: 0;
        }

        .me-avatar {
          color: white;
        }

        .counter-avatar {
          color: #666;
          font-size: 11px;
        }

        .actions-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .present-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f4f5f7;
          color: #222428;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .present-button:hover {
          background-color: #e8eaed;
        }

        .share-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .share-button:hover {
          background-color: #3367d6;
        }

        .share-button svg {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }
      `}</style>
    </>
  );
}