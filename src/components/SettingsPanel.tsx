// import React, { useState } from 'react';
// import { FlowNode } from '../types/flow';
// import { X, Save } from 'lucide-react';
// import { Button } from './ui/button';
// import { Textarea } from './ui/textarea';
// import { Label } from './ui/label';

// interface SettingsPanelProps {
//   node: FlowNode;
//   onUpdate: (nodeId: string, data: Partial<FlowNode['data']>) => void;
//   onClose: () => void;
// }

// export const SettingsPanel: React.FC<SettingsPanelProps> = ({
//   node,
//   onUpdate,
//   onClose
// }) => {
//   const [message, setMessage] = useState(node.data.message || '');

//   const handleSave = () => {
//     onUpdate(node.id, { message });
//   };

//   return (
//     <div className="w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col h-full">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 bg-gray-50">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-semibold text-gray-800">Message Settings</h3>
//           <Button variant="ghost" size="sm" onClick={onClose}>
//             <X className="w-4 h-4" />
//           </Button>
//         </div>
//         <p className="text-sm text-gray-600 mt-1">
//           Edit your text message content
//         </p>
//       </div>

//       {/* Content */}
//       <div className="flex-1 p-4 space-y-6 overflow-y-auto">
//         <div className="space-y-2">
//           <Label htmlFor="message">Text Message</Label>
//           <Textarea
//             id="message"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Enter your message text here..."
//             className="min-h-[120px] resize-none"
//           />
//           <p className="text-xs text-gray-500">
//             This text will be sent as a message to the user.
//           </p>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="p-4 border-t border-gray-200 bg-gray-50">
//         <Button onClick={handleSave} className="w-full">
//           <Save className="w-4 h-4 mr-2" />
//           Save Message
//         </Button>
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import { FlowNode } from "../types/flow";
import { X, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface SettingsPanelProps {
  node: FlowNode;
  onUpdate: (nodeId: string, data: Partial<FlowNode["data"]>) => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  node,
  onUpdate,
  onClose,
}) => {
  const [message, setMessage] = useState(node.data.message || "");

  const handleSave = () => {
    onUpdate(node.id, { message });
    onClose(); // Close after saving
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      handleSave(); // Save and close
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Message Settings
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Edit your text message content
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div className="space-y-2">
          <Label htmlFor="message">Text Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your message text here..."
            className="min-h-[120px] resize-none"
          />
          <p className="text-xs text-gray-500">
            Press <strong>Enter</strong> to save and close.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Message
        </Button>
      </div>
    </div>
  );
};
