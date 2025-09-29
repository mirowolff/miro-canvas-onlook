'use client';

import React from 'react';

interface AvatarProps {
  text: string;
  bgColor: string;
  textColor: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: React.CSSProperties;
}

export default function Avatar({
  text,
  bgColor,
  textColor,
  size = 'medium',
  className = '',
  style = {}
}: AvatarProps) {
  const baseClasses = `
    avatar-base
    ${size === 'small' ? 'avatar-small' : ''}
    ${size === 'medium' ? 'avatar-medium' : ''}
    ${size === 'large' ? 'avatar-large' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <>
      <div
        className={baseClasses}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          ...style
        }}
      >
        {text}
      </div>

      <style>{`
        .avatar-base {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          border: 2px solid var(--colors-white);
          margin-left: -5px;
          position: relative;
          font-family: 'Noto Sans', system-ui, sans-serif;
        }

        .avatar-base:first-child {
          margin-left: 0;
        }

        /* Sizes */
        .avatar-small {
          width: 24px;
          height: 24px;
          font-size: 10px;
        }

        .avatar-medium {
          width: 32px;
          height: 32px;
          font-size: 12px;
        }

        .avatar-large {
          width: 40px;
          height: 40px;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}