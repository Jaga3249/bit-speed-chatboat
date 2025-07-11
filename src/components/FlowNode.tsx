
import React, { useState, useRef } from 'react';
import { FlowNode as FlowNodeType } from '../types/flow';
import { MessageSquare, Trash2, Link } from 'lucide-react';

interface FlowNodeProps {
  node: FlowNodeType;
  isSelected: boolean;
  isConnecting: boolean;
  onSelect: () => void;
  onMove: (position: { x: number; y: number }) => void;
  onDelete: () => void;
  onConnect: () => void;
}

export const FlowNode: React.FC<FlowNodeProps> = ({
  node,
  isSelected,
  isConnecting,
  onSelect,
  onMove,
  onDelete,
  onConnect
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y
    });
    onSelect();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };
    onMove(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, node.position]);

  return (
    <div
      ref={nodeRef}
      className={`absolute bg-white rounded-lg shadow-lg border-2 transition-all duration-200 cursor-move select-none ${
        isSelected ? 'border-blue-500 shadow-xl' : 'border-gray-200'
      } ${isConnecting ? 'ring-4 ring-orange-400 ring-opacity-50 border-orange-400' : ''}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: '240px',
        minHeight: '80px'
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Node Header */}
      <div className="bg-blue-500 text-white px-3 py-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-medium">Message</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConnect();
            }}
            className={`p-1 hover:bg-white/20 rounded transition-colors ${
              isConnecting ? 'bg-white/30' : ''
            }`}
            title={isConnecting ? "Click another node to connect" : "Connect to another node"}
          >
            <Link className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Delete node"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Node Content */}
      <div className="p-3">
        <div className="text-sm text-gray-700 break-words">
          {node.data.message || 'Click to edit message'}
        </div>
      </div>

      {/* Connection Points */}
      <div 
        className={`absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-pointer transition-all ${
          isHovering || isConnecting ? 'scale-125 shadow-lg' : ''
        }`} 
        title="Source Handle - Drag from here to connect"
        onClick={(e) => {
          e.stopPropagation();
          onConnect();
        }}
      />
      <div 
        className={`absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-400 border-2 border-white rounded-full transition-all ${
          isHovering ? 'bg-green-500 scale-125 shadow-lg' : ''
        }`}
        title="Target Handle - Connect to here"
      />

      {/* Connection mode indicator */}
      {isConnecting && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Click another node to connect
        </div>
      )}
    </div>
  );
};
