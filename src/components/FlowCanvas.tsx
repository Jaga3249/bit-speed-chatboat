
import React, { useRef, useState, useCallback } from 'react';
import { FlowNode as FlowNodeType, Connection } from '../types/flow';
import { FlowNode } from './FlowNode';
import { ConnectionLine } from './ConnectionLine';

interface FlowCanvasProps {
  nodes: FlowNodeType[];
  connections: Connection[];
  selectedNodeId: string | null;
  draggedNodeType: string | null;
  onNodeSelect: (nodeId: string | null) => void;
  onNodeAdd: (type: string, position: { x: number; y: number }) => void;
  onNodeMove: (nodeId: string, position: { x: number; y: number }) => void;
  onNodeDelete: (nodeId: string) => void;
  onConnectionAdd: (source: string, target: string) => void;
  onDragEnd: () => void;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  connections,
  selectedNodeId,
  draggedNodeType,
  onNodeSelect,
  onNodeAdd,
  onNodeMove,
  onNodeDelete,
  onConnectionAdd,
  onDragEnd
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onNodeSelect(null);
      setConnectingFrom(null);
    }
  }, [onNodeSelect]);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNodeType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left - dragOffset.x,
      y: e.clientY - rect.top - dragOffset.y
    };

    onNodeAdd(draggedNodeType, position);
    onDragEnd();
  }, [draggedNodeType, dragOffset, onNodeAdd, onDragEnd]);

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleNodeConnect = useCallback((nodeId: string) => {
    if (!connectingFrom) {
      setConnectingFrom(nodeId);
    } else if (connectingFrom !== nodeId) {
      onConnectionAdd(connectingFrom, nodeId);
      setConnectingFrom(null);
    } else {
      // Clicking the same node cancels connection mode
      setConnectingFrom(null);
    }
  }, [connectingFrom, onConnectionAdd]);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full relative bg-white overflow-hidden cursor-grab active:cursor-grabbing"
      onClick={handleCanvasClick}
      onDrop={handleCanvasDrop}
      onDragOver={handleCanvasDragOver}
      style={{
        backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }}
    >
      {/* Connection mode overlay */}
      {connectingFrom && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="text-sm font-medium">Connection Mode Active</div>
          <div className="text-xs opacity-90">Click another node to connect, or click the same node to cancel</div>
        </div>
      )}

      {/* Render connections */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full">
        {/* Arrow marker definition */}
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
        
        {connections.map((connection) => {
          const sourceNode = nodes.find(n => n.id === connection.source);
          const targetNode = nodes.find(n => n.id === connection.target);
          
          if (!sourceNode || !targetNode) return null;
          
          return (
            <ConnectionLine
              key={connection.id}
              from={{
                x: sourceNode.position.x + 240,
                y: sourceNode.position.y + 40
              }}
              to={{
                x: targetNode.position.x,
                y: targetNode.position.y + 40
              }}
            />
          );
        })}
      </svg>

      {/* Render nodes */}
      {nodes.map((node) => (
        <FlowNode
          key={node.id}
          node={node}
          isSelected={selectedNodeId === node.id}
          isConnecting={connectingFrom === node.id}
          onSelect={() => onNodeSelect(node.id)}
          onMove={(position) => onNodeMove(node.id, position)}
          onDelete={() => onNodeDelete(node.id)}
          onConnect={() => handleNodeConnect(node.id)}
        />
      ))}
    </div>
  );
};
