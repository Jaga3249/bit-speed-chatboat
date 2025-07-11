
import React from 'react';
import { MessageSquare, Grip } from 'lucide-react';

interface ToolbarProps {
  onDragStart: (nodeType: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onDragStart }) => {
  const handleDragStart = (e: React.DragEvent, nodeType: string) => {
    onDragStart(nodeType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Nodes Panel</h2>
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Drag to add nodes</h3>
        
        {/* Message Node - Primary node type */}
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, 'message')}
          className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg cursor-move hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
        >
          <div className="bg-blue-500 p-2 rounded text-white flex-shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">Message</div>
            <div className="text-xs text-gray-500">Send a text message</div>
          </div>
          <Grip className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Drag the Message node to canvas</li>
          <li>• Click nodes to select and edit</li>
          <li>• Connect nodes by clicking the link button</li>
          <li>• Edit messages in the settings panel</li>
        </ul>
      </div>
    </div>
  );
};
