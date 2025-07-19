import React from "react";

interface GraphLinkLineProps {
  source: { x: number; y: number; width: number; height: number };
  target: { x: number; y: number; width: number; height: number };
  color?: string;
  width?: number;
  markerEnd?: boolean;
  opacity?: number;
  onClick?: () => void;
  isSelected?: boolean;
}

// Функция для вычисления точки на границе прямоугольника по направлению к другой точке
function getRectEdgePoint(
  rect: { x: number; y: number; width: number; height: number },
  toward: { x: number; y: number }
) {
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  const dx = toward.x - cx;
  const dy = toward.y - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  // Нормализуем направление
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  let scale = 0.5;
  if (absDx * rect.height > absDy * rect.width) {
    // Пересекает боковую грань
    scale = rect.width / 2 / absDx;
  } else {
    // Пересекает верх/низ
    scale = rect.height / 2 / absDy;
  }
  return {
    x: cx + dx * scale,
    y: cy + dy * scale,
  };
}

export const GraphLinkLine: React.FC<GraphLinkLineProps> = ({
  source,
  target,
  color = "#22c55e",
  width = 3,
  markerEnd = false,
  opacity = 0.8,
  onClick,
  isSelected,
}) => {
  // Центры портов
  const sourceCenter = {
    x: source.x + source.width / 2,
    y: source.y + source.height / 2,
  };
  const targetCenter = {
    x: target.x + target.width / 2,
    y: target.y + target.height / 2,
  };
  // Для портов: просто используем center
  const from = sourceCenter;
  const to = targetCenter;
  // Bezier control points (node-red style)
  const dx = Math.max(Math.abs(to.x - from.x) * 0.5, 40);
  const c1 = { x: from.x + dx, y: from.y };
  const c2 = { x: to.x - dx, y: to.y };

  return (
    <path
      d={`M${from.x},${from.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${to.x},${to.y}`}
      fill="none"
      stroke={isSelected ? "#f59e42" : color}
      strokeWidth={width}
      opacity={opacity}
      style={{ cursor: onClick ? "pointer" : undefined }}
      onClick={onClick}
    />
  );
};
