import React from "react";
import { Server, Database, Network, Settings, Cloud } from "lucide-react";
import { GraphNode as GraphNodeType } from "@/types/graph";
import { InputPorts } from "./InputPorts";
import { OutputPorts } from "./OutputPorts";
// Nodes
import {
  InjectNode,
  DebugNode,
  FunctionNode,
  ChangeNode,
  SwitchNode,
  TemplateNode,
  MQTTNode,
  HTTPNode,
  FileNode,
  RBENode,
  SerialNode,
  JSONParserNode,
  SplitJoinNode,
  DelayNode,
  LinkNode,
  SystemServerNode,
  SystemDatabaseNode,
  SystemNetworkNode,
  SystemServiceNode,
  SystemApiNode,
  SystemStorageNode,
} from "./nodes";

interface GraphNodeProps {
  node: GraphNodeType;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  onDrag: (nodeId: string, x: number, y: number) => void;
  onDelete: (nodeId: string) => void;
  onPortConnectStart?: (
    nodeId: string,
    portIdx: number,
    type: "input" | "output"
  ) => void;
  onPortConnectEnd?: (
    nodeId: string,
    portIdx: number,
    type: "input" | "output"
  ) => void;
  dragPort?: { nodeId: string; portIdx: number } | null;
  links?: any[];
  nodes?: any[];
  onDoubleClick?: () => void;
}

const nodeIcons = {
  server: Server,
  database: Database,
  network: Network,
  service: Settings,
  api: Cloud,
  storage: Database,
};

const nodeColors = {
  server: "bg-blue-100 border-blue-300",
  database: "bg-green-100 border-green-300",
  network: "bg-purple-100 border-purple-300",
  service: "bg-orange-100 border-orange-300",
  api: "bg-cyan-100 border-cyan-300",
  storage: "bg-yellow-100 border-yellow-300",
};

const statusColors = {
  healthy: "bg-green-500",
  warning: "bg-yellow-500",
  critical: "bg-red-500",
  unknown: "bg-gray-400",
};

export const GraphNode: React.FC<GraphNodeProps> = React.memo(
  ({
    node,
    isSelected,
    onSelect,
    onDrag,
    onDelete,
    onPortConnectStart,
    onPortConnectEnd,
    dragPort,
    links,
    nodes,
    onDoubleClick,
  }) => {
    const IconComponent = nodeIcons[node.type];
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
    const nodeRef = React.useRef<HTMLDivElement>(null);
    const dragPos = React.useRef<{ x: number; y: number }>({
      x: node.x,
      y: node.y,
    });

    // Сброс позиции при изменении node.x/y
    React.useEffect(() => {
      dragPos.current = { x: node.x, y: node.y };
      if (nodeRef.current && !isDragging) {
        nodeRef.current.style.left = node.x + "px";
        nodeRef.current.style.top = node.y + "px";
      }
    }, [node.x, node.y, isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
      // Не начинаем drag, если клик по порту (input/output)
      const target = e.target as HTMLElement;
      if (target && target.dataset && target.dataset.port) return;
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      dragPos.current = { x: node.x, y: node.y };
      setIsDragging(true);
      onSelect(node.id);
    };

    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (!isDragging) return;
        const canvas = document.getElementById("graph-canvas");
        if (!canvas) return;
        const canvasRect = canvas.getBoundingClientRect();
        const newX = e.clientX - canvasRect.left - dragOffset.x;
        const newY = e.clientY - canvasRect.top - dragOffset.y;
        dragPos.current = { x: Math.max(0, newX), y: Math.max(0, newY) };
        if (nodeRef.current) {
          nodeRef.current.style.left = dragPos.current.x + "px";
          nodeRef.current.style.top = dragPos.current.y + "px";
        }
      },
      [isDragging, dragOffset]
    );

    const handleMouseUp = React.useCallback(() => {
      if (isDragging && nodeRef.current) {
        // Получаем финальные координаты из style
        const left = parseInt(nodeRef.current.style.left, 10);
        const top = parseInt(nodeRef.current.style.top, 10);
        onDrag(node.id, left, top); // Только теперь обновляем глобальный state
      }
      setIsDragging(false);
    }, [isDragging, onDrag, node.id]);

    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    React.useEffect(() => {
      if (isSelected && nodeRef.current) {
        nodeRef.current.focus();
      }
    }, [isSelected]);

    // Выбор компонента для отображения узла
    let NodeContent: React.ReactNode = null;
    switch (node.type) {
      case "inject":
        NodeContent = <InjectNode name={node.name} />;
        break;
      case "debug":
        NodeContent = <DebugNode name={node.name} />;
        break;
      case "function":
        NodeContent = <FunctionNode name={node.name} />;
        break;
      case "change":
        NodeContent = <ChangeNode name={node.name} />;
        break;
      case "switch":
        NodeContent = <SwitchNode name={node.name} />;
        break;
      case "template":
        NodeContent = <TemplateNode name={node.name} />;
        break;
      case "mqtt":
        NodeContent = <MQTTNode name={node.name} />;
        break;
      case "http":
        NodeContent = <HTTPNode name={node.name} />;
        break;
      case "file":
        NodeContent = <FileNode name={node.name} />;
        break;
      case "rbe":
        NodeContent = <RBENode name={node.name} />;
        break;
      case "serial":
        NodeContent = <SerialNode name={node.name} />;
        break;
      case "json":
        NodeContent = <JSONParserNode name={node.name} />;
        break;
      case "split":
        NodeContent = <SplitJoinNode name={node.name} />;
        break;
      case "delay":
        NodeContent = <DelayNode name={node.name} />;
        break;
      case "link":
        NodeContent = <LinkNode name={node.name} />;
        break;
      case "server":
        NodeContent = (
          <SystemServerNode name={node.name} health={node.health} />
        );
        break;
      case "database":
        NodeContent = (
          <SystemDatabaseNode name={node.name} health={node.health} />
        );
        break;
      case "network":
        NodeContent = (
          <SystemNetworkNode name={node.name} health={node.health} />
        );
        break;
      case "service":
        NodeContent = (
          <SystemServiceNode name={node.name} health={node.health} />
        );
        break;
      case "api":
        NodeContent = <SystemApiNode name={node.name} health={node.health} />;
        break;
      case "storage":
        NodeContent = (
          <SystemStorageNode name={node.name} health={node.health} />
        );
        break;
      default:
        NodeContent = null;
    }

    return (
      <div
        ref={nodeRef}
        data-node-id={node.id}
        className="absolute cursor-move select-none"
        style={{ left: node.x, top: node.y }}
        onMouseDown={handleMouseDown}
        title={node.name}
        onDoubleClick={onDoubleClick}
        tabIndex={0}
        onKeyDown={
          isSelected
            ? (e) => {
                if (e.key === "Backspace" || e.key === "Delete") {
                  e.preventDefault();
                  onDelete(node.id);
                }
              }
            : undefined
        }
      >
        <div
          className={`relative p-3 rounded-lg min-w-[120px] border-2 ${
            isSelected ? "border-green-500" : "border-gray-200"
          } ${nodeColors[node.type] || "bg-gray-100 border-gray-200"} ${
            isDragging ? "opacity-100 shadow-lg scale-105" : "shadow-md"
          }`}
        >
          <InputPorts
            nodeId={node.id}
            ports={node.input}
            onPortConnectStart={(nid, idx) =>
              onPortConnectEnd && onPortConnectEnd(nid, idx, "input")
            }
            dragPort={dragPort}
            links={links}
            nodes={nodes}
          />
          {NodeContent ? (
            <div className="flex flex-col items-center space-y-2">
              {NodeContent}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              {IconComponent && (
                <IconComponent className="h-8 w-8 text-black" />
              )}
              <span className="text-sm font-bold text-black drop-shadow">
                {node.name}
              </span>
            </div>
          )}
          {![
            "server",
            "database",
            "network",
            "service",
            "api",
            "storage",
          ].includes(node.type) && (
            <div className="mt-1 w-full flex items-center gap-1">
              <div className="flex-1 bg-gray-300 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    node.health > 80
                      ? "bg-green-500"
                      : node.health > 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${node.health}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-700 font-semibold ml-1">
                {node.health}%
              </span>
            </div>
          )}
          <OutputPorts
            nodeId={node.id}
            ports={node.output}
            onPortConnectStart={(nid, idx) =>
              onPortConnectStart && onPortConnectStart(nid, idx, "output")
            }
          />
        </div>
      </div>
    );
  }
);
