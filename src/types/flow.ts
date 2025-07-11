export interface FlowNode {
  id: string;
  type: "start" | "message" | "condition" | "action";
  position: { x: number; y: number };
  data: {
    message: string;
    options?: string[];
    condition?: string;
    action?: string;
  };
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface DraggedNode {
  type: string;
  position: { x: number; y: number };
}
