
import React from 'react';

interface ConnectionLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({ from, to }) => {
  const midX = (from.x + to.x) / 2;
  
  const pathData = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;

  return (
    <g>
      <path
        d={pathData}
        stroke="#6b7280"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead)"
        className="transition-all duration-200"
      />
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
        </marker>
      </defs>
    </g>
  );
};
