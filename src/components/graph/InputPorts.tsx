import React, { useState } from "react";
import { GraphLink, GraphNode } from "@/types/graph";

interface InputPortsProps {
  nodeId: string;
  ports?: boolean | string[];
  onPortConnectStart?: (targetNodeId: string, targetPortIdx: number) => void;
  dragPort?: { nodeId: string; portIdx: number } | null;
  links?: GraphLink[];
  nodes?: GraphNode[];
}

export const InputPorts: React.FC<InputPortsProps> = ({
  nodeId,
  ports,
  onPortConnectStart,
  dragPort,
  links,
  nodes,
}) => {
  let count = 1;
  if (Array.isArray(ports)) count = ports.length;
  else if (ports === true) count = 1;
  // если ports === false или undefined — всё равно 1 порт
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Проверка валидности drop
  function isDropValid(idx: number) {
    if (!dragPort) return true;
    if (dragPort.nodeId === nodeId && dragPort.portIdx === idx) return false;
    if (dragPort.nodeId === nodeId) return false;
    if (
      links &&
      links.some(
        (l) =>
          l.source === `${dragPort.nodeId}:${dragPort.portIdx}` &&
          l.target === `${nodeId}:${idx}`
      )
    )
      return false;
    return true;
  }

  return (
    <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 flex flex-col gap-1 z-10">
      {Array.from({ length: count }).map((_, idx) => {
        const invalid = dragOverIdx === idx && dragPort && !isDropValid(idx);
        return (
          <div
            key={idx}
            data-port="input"
            className={`w-4 h-4 rounded-full border-2 border-white cursor-crosshair transition-shadow bg-gray-400 ${
              hoverIdx === idx ? "ring-2 ring-yellow-200 bg-yellow-100" : ""
            } ${
              dragOverIdx === idx
                ? invalid
                  ? "ring-4 ring-red-400 bg-red-200"
                  : "ring-4 ring-yellow-200 bg-yellow-100"
                : ""
            }`}
            title={Array.isArray(ports) ? String(ports[idx]) : "Input"}
            onMouseEnter={() => setHoverIdx(idx)}
            onMouseLeave={() => setHoverIdx(null)}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => {
              e.stopPropagation();
              setDragOverIdx(null);
              if (!isDropValid(idx)) return;
              if (onPortConnectStart && dragPort)
                onPortConnectStart(nodeId, idx);
            }}
            onMouseOver={() => setDragOverIdx(idx)}
            onMouseOut={() => setDragOverIdx(null)}
          />
        );
      })}
    </div>
  );
};
