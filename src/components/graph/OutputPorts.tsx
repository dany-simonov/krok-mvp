import React, { useState, useRef } from "react";

interface OutputPortsProps {
  nodeId: string;
  ports?: boolean | string[];
  onPortConnectStart?: (sourceNodeId: string, sourcePortIdx: number) => void;
}

export const OutputPorts: React.FC<OutputPortsProps> = ({
  nodeId,
  ports,
  onPortConnectStart,
}) => {
  let count = 1;
  if (Array.isArray(ports)) count = ports.length;
  else if (ports === true) count = 1;
  // если ports === false или undefined — всё равно 1 порт
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const mouseDownRef = useRef(false);

  // Mouse-based drag
  const handleMouseDown = (idx: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    mouseDownRef.current = true;
    setDragIdx(idx);
    if (onPortConnectStart) onPortConnectStart(nodeId, idx);
    // Добавляем mouseup на window для завершения drag
    const handleMouseUp = () => {
      setDragIdx(null);
      mouseDownRef.current = false;
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 flex flex-col gap-1 z-10">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          data-port="output"
          className={`w-4 h-4 rounded-full border-2 border-white cursor-crosshair transition-shadow bg-gray-400 ${
            hoverIdx === idx ? "ring-2 ring-yellow-200 bg-yellow-100" : ""
          } ${
            dragIdx === idx
              ? "scale-125 ring-4 ring-yellow-200 bg-yellow-100"
              : ""
          }`}
          title={Array.isArray(ports) ? String(ports[idx]) : "Output"}
          onMouseEnter={() => setHoverIdx(idx)}
          onMouseLeave={() => setHoverIdx(null)}
          onMouseDown={handleMouseDown(idx)}
        />
      ))}
    </div>
  );
};
