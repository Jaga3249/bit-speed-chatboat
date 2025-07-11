import React, { useState, useCallback, useRef } from "react";
import { FlowCanvas } from "../components/FlowCanvas";
import { SettingsPanel } from "../components/SettingsPanel";
import { Toolbar } from "../components/Toolbar";
import { FlowNode, Connection } from "../types/flow";

const Index = () => {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const validTypes = ["start", "message", "condition", "action"] as const;
  type NodeType = (typeof validTypes)[number]; // 'start' | 'message' | 'condition' | 'action'

  const isValidType = (t: string): t is NodeType => {
    return (validTypes as readonly string[]).includes(t);
  };

  // const addNode = useCallback((type: string, position: { x: number; y: number }) => {
  //   // Ensure type is one of the valid node types
  //   const validTypes = ['start', 'message', 'condition', 'action'] as const;
  //   const nodeType = validTypes.includes(type as any) ? type as FlowNode['type'] : 'message';

  //   const newNode: FlowNode = {
  //     id: `${nodeType}-${Date.now()}`,
  //     type: nodeType,
  //     position,
  //     data: {
  //       message: nodeType === 'message' ? 'Text Message' :
  //               nodeType === 'condition' ? 'Condition' :
  //               nodeType === 'action' ? 'Action' : 'Welcome Message'
  //     }
  //   };
  //   setNodes(prev => [...prev, newNode]);
  // }, []);

  const addNode = useCallback(
    (type: string, position: { x: number; y: number }) => {
      const nodeType: FlowNode["type"] = isValidType(type) ? type : "message";

      const newNode: FlowNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          message:
            nodeType === "message"
              ? "Text Message"
              : nodeType === "condition"
              ? "Condition"
              : nodeType === "action"
              ? "Action"
              : "Welcome Message",
        },
      };
      setNodes((prev) => [...prev, newNode]);
    },
    []
  );
  const updateNode = useCallback(
    (nodeId: string, data: Partial<FlowNode["data"]>) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
    },
    []
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((prev) => prev.filter((node) => node.id !== nodeId));
      setConnections((prev) =>
        prev.filter((conn) => conn.source !== nodeId && conn.target !== nodeId)
      );
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
      }
    },
    [selectedNodeId]
  );

  const addConnection = useCallback(
    (source: string, target: string) => {
      // Check if source already has a connection (source handle can only have one edge)
      const existingConnection = connections.find(
        (conn) => conn.source === source
      );
      if (existingConnection) {
        // Remove existing connection from this source
        setConnections((prev) => prev.filter((conn) => conn.source !== source));
      }

      const newConnection: Connection = {
        id: `${source}-${target}`,
        source,
        target,
      };
      setConnections((prev) => [...prev, newConnection]);
    },
    [connections]
  );

  const moveNode = useCallback(
    (nodeId: string, position: { x: number; y: number }) => {
      setNodes((prev) =>
        prev.map((node) => (node.id === nodeId ? { ...node, position } : node))
      );
    },
    []
  );

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Toolbar */}
      <Toolbar onDragStart={setDraggedNodeType} />

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <FlowCanvas
          nodes={nodes}
          connections={connections}
          selectedNodeId={selectedNodeId}
          draggedNodeType={draggedNodeType}
          onNodeSelect={setSelectedNodeId}
          onNodeAdd={addNode}
          onNodeMove={moveNode}
          onNodeDelete={deleteNode}
          onConnectionAdd={addConnection}
          onDragEnd={() => setDraggedNodeType(null)}
        />
      </div>

      {/* Settings Panel */}
      {selectedNode && (
        <SettingsPanel
          node={selectedNode}
          onUpdate={updateNode}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
};

export default Index;
