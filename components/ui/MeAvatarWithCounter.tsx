'use client';

import React from 'react';

interface MeAvatarWithCounterProps {
  text: string;
  bgColor: string;
  textColor: string;
  counterText: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function MeAvatarWithCounter({
  text,
  bgColor,
  textColor,
  counterText,
  size = 'medium',
  className = ''
}: MeAvatarWithCounterProps) {
  const baseClasses = `
    me-avatar-container
    ${size === 'medium' ? 'me-avatar-container-medium' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <>
      <div className={baseClasses}>
        {/* Inner ME avatar - smaller */}
        <div
          className="me-avatar-inner me-avatar-inner-medium"
          style={{
            backgroundColor: bgColor,
            color: textColor
          }}
        >
          {text}
        </div>

        {/* Counter text on the right */}
        <div className="counter-text counter-text-medium">
          {counterText}
        </div>
      </div>

      <style>{`
        .me-avatar-container {
          display: flex;
          align-items: center;
          background: var(--colors-gray100);
          border-radius: 16px;
          padding: 2px 8px 2px 4px;
          margin-left: -6px;
          position: relative;
          gap: 6px;
        }

        .me-avatar-container:first-child {
          margin-left: 0;
        }

        .me-avatar-inner {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          position: relative;
          flex-shrink: 0;
        }

        .counter-text {
          color: var(--colors-gray500);
          font-weight: 500;
          flex-shrink: 0;
        }

        /* Container sizes */

        .me-avatar-container-medium {
          height: 32px;
          border-radius: 16px;
          padding: 2px 8px 2px 4px;
          gap: 6px;
        }

        /* Inner avatar sizes - account for 2px padding inside pill */

        .me-avatar-inner-medium {
          width: 24px;
          height: 24px;
          font-size: 12px;
        }
        .counter-text-medium {
          font-size: 12px;
        }
      `}</style>
    </>
  );
}