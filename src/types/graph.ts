export type NodeType =
  | "server"
  | "database"
  | "network"
  | "service"
  | "api"
  | "storage"
  | "inject"
  | "debug"
  | "function"
  | "change"
  | "switch"
  | "template"
  | "mqtt"
  | "http"
  | "file"
  | "rbe"
  | "serial"
  | "json"
  | "split"
  | "delay"
  | "link";

export interface GraphNode {
  id: string;
  type: NodeType;
  name: string;
  x: number;
  y: number;
  health: number; // 0-100
  status: "healthy" | "warning" | "critical" | "unknown";
  metrics?: {
    cpu?: number;
    memory?: number;
    network?: number;
  };
  properties: Record<string, any>;
  input?: boolean | string[]; // true/false или список входов
  output?: boolean | string[]; // true/false или список выходов
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
  type: "network" | "dependency" | "data_flow";
  status: "active" | "inactive" | "error";
}

export interface Graph {
  id: string;
  name: string;
  nodes: GraphNode[];
  links: GraphLink[];
  createdAt: string;
  updatedAt: string;
}
