import React from "react";
import {
  Zap,
  Bug,
  Code2,
  Shuffle,
  GitBranch,
  FileText,
  Wifi,
  Globe,
  File,
  Filter,
  HardDrive,
  Database,
  Clock,
  Link2,
  Settings,
  Server,
  Network,
  Cloud,
} from "lucide-react";
import type { NodeType } from "@/types/graph";

interface NodePaletteProps {
  onAddNode: (type: NodeType) => void;
}

const nodeGroups = [
  {
    group: "Логика",
    color: "bg-blue-50 hover:bg-blue-100",
    nodes: [
      { type: "inject" as const, icon: Zap, label: "Inject" },
      { type: "debug" as const, icon: Bug, label: "Debug" },
      { type: "function" as const, icon: Code2, label: "Function" },
      { type: "change" as const, icon: Shuffle, label: "Change" },
      { type: "switch" as const, icon: GitBranch, label: "Switch" },
      { type: "template" as const, icon: FileText, label: "Template" },
    ],
  },
  {
    group: "Интеграция",
    color: "bg-cyan-50 hover:bg-cyan-100",
    nodes: [
      { type: "mqtt" as const, icon: Wifi, label: "MQTT" },
      { type: "http" as const, icon: Globe, label: "HTTP" },
      { type: "file" as const, icon: File, label: "File" },
      { type: "serial" as const, icon: HardDrive, label: "Serial" },
      { type: "json" as const, icon: Database, label: "JSON" },
    ],
  },
  {
    group: "Поток",
    color: "bg-purple-50 hover:bg-purple-100",
    nodes: [
      { type: "split" as const, icon: GitBranch, label: "Split/Join" },
      { type: "delay" as const, icon: Clock, label: "Delay" },
      { type: "rbe" as const, icon: Filter, label: "RBE" },
      { type: "link" as const, icon: Link2, label: "Link" },
    ],
  },
  {
    group: "Система",
    color: "bg-gray-100 hover:bg-gray-200",
    nodes: [
      { type: "server" as const, icon: Server, label: "Сервер" },
      { type: "database" as const, icon: Database, label: "БД" },
      { type: "network" as const, icon: Network, label: "Сеть" },
      { type: "service" as const, icon: Settings, label: "Сервис" },
      { type: "api" as const, icon: Cloud, label: "API" },
      { type: "storage" as const, icon: Database, label: "Хранилище" },
    ],
  },
];

export const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  // dragstart handler
  const handleDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData("application/node-type", type);
  };
  return (
    <div>
      {nodeGroups.map(({ group, color, nodes }) => (
        <div key={group} className="mb-4">
          <div className="font-bold text-xs text-gray-700 mb-2 pl-1 uppercase tracking-wider">
            {group}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {nodes.map(({ type, icon: Icon, label }) => (
              <div
                key={type}
                className={`h-16 flex flex-col items-center justify-center ${color} border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer select-none`}
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
                tabIndex={0}
                role="button"
                title={label}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
