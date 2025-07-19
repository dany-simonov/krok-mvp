import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Download, 
  Upload, 
  ZoomIn, 
  ZoomOut,
  RotateCcw,
  Trash2,
  Settings,
} from "lucide-react";
import { GraphNode as GraphNodeType, GraphLink } from "@/types/graph";
import { GraphNode } from "@/components/graph/GraphNode";
import { NodePalette } from "@/components/graph/NodePalette";
import { PropertiesPanel } from "@/components/graph/PropertiesPanel";
import { GraphLinkLine } from "@/components/graph/GraphLinkLine";
import { toast } from "sonner";
import { getPortCenter } from "@/lib/portUtils";
import ReactModal from "react-modal";

// Новый тип для Flow
interface Flow {
  id: string;
  name: string;
  nodes: GraphNodeType[];
  links: GraphLink[];
}

// Для отслеживания позиции мыши при drag
function useMousePosition() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  React.useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return pos;
}

// Модальное окно для детальных настроек узла
const NodeDetailsModal: React.FC<{
  node: GraphNodeType;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<GraphNodeType>) => void;
}> = ({ node, isOpen, onClose, onUpdate }) => {
  const [localNode, setLocalNode] = React.useState(node);
  React.useEffect(() => {
    setLocalNode(node);
  }, [node]);
  if (!node) return null;
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="bg-white rounded-lg p-6 max-w-lg mx-auto mt-24 shadow-xl outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4">Настройки узла</h2>
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">ID</label>
        <div className="font-mono text-sm mb-2">{localNode.id}</div>
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Тип</label>
        <div className="font-mono text-sm mb-2">{localNode.type}</div>
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Название</label>
        <input
          className="border rounded px-2 py-1 w-full"
          value={localNode.name}
          onChange={(e) => setLocalNode({ ...localNode, name: e.target.value })}
        />
      </div>
      {/* Можно добавить другие поля по необходимости */}
      <div className="flex gap-2 mt-4">
        <button
          className="px-4 py-2 rounded bg-green-600 text-white font-bold"
          onClick={() => {
            onUpdate(localNode.id, localNode);
            onClose();
          }}
        >
          Сохранить
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-bold"
          onClick={onClose}
        >
          Отмена
        </button>
      </div>
    </ReactModal>
  );
};

export const GraphEditor: React.FC = () => {
  // flows: массив потоков
  const [flows, setFlows] = useState<Flow[]>([
    {
      id: "flow_1",
      name: "Поток 1",
      nodes: [],
      links: [],
    },
  ]);
  const [activeFlowId, setActiveFlowId] = useState("flow_1");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);

  // Для хранения временного состояния drag from output port
  const [dragPort, setDragPort] = useState<{
    nodeId: string;
    portIdx: number;
  } | null>(null);

  // Для модального окна настроек узла
  const [modalNodeId, setModalNodeId] = useState<string | null>(null);

  // Получить активный поток
  const activeFlow = flows.find((f) => f.id === activeFlowId)!;
  const nodes = activeFlow.nodes;
  const links = activeFlow.links;
  const selectedNode = nodes.find((node) => node.id === selectedNodeId) || null;
  const mousePos = useMousePosition();
  const modalNode = nodes.find((n) => n.id === modalNodeId) || null;

  // Начало drag с output порта
  const handlePortConnectStart = (
    nodeId: string,
    portIdx: number,
    type: "output" | "input"
  ) => {
    if (type === "output") {
      setDragPort({ nodeId, portIdx });
    }
  };
  // Drop на input порт
  const handlePortConnectEnd = (
    nodeId: string,
    portIdx: number,
    type: "output" | "input"
  ) => {
    if (type === "input" && dragPort) {
      console.log("DROP", { from: dragPort, to: { nodeId, portIdx } });
      // Создать связь между dragPort (output) и этим input
      const newLink: GraphLink = {
        id: generateLinkId(),
        source: dragPort.nodeId + ":" + dragPort.portIdx,
        target: nodeId + ":" + portIdx,
        type: "network",
        status: "active",
      };
      setLinks((prev) => [...prev, newLink]);
      setHasChanges(true);
      setDragPort(null);
      toast.success("Связь между портами создана");
    }
  };

  // Генерация id
  const generateNodeId = () =>
    `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const generateLinkId = () =>
    `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const generateFlowId = () =>
    `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // CRUD для flows
  const handleAddFlow = () => {
    const newFlow: Flow = {
      id: generateFlowId(),
      name: `Поток ${flows.length + 1}`,
      nodes: [],
      links: [],
    };
    setFlows((prev) => [...prev, newFlow]);
    setActiveFlowId(newFlow.id);
    setSelectedNodeId(null);
    setSelectedLinkId(null);
  };
  const handleSelectFlow = (flowId: string) => {
    setActiveFlowId(flowId);
    setSelectedNodeId(null);
    setSelectedLinkId(null);
  };
  const handleRenameFlow = (flowId: string, name: string) => {
    setFlows((prev) => prev.map((f) => (f.id === flowId ? { ...f, name } : f)));
  };
  const handleDeleteFlow = (flowId: string) => {
    if (flows.length === 1) return;
    setFlows((prev) => prev.filter((f) => f.id !== flowId));
    if (activeFlowId === flowId) {
      setActiveFlowId(flows.find((f) => f.id !== flowId)!.id);
    }
    setSelectedNodeId(null);
    setSelectedLinkId(null);
  };

  // Все функции для nodes/links теперь работают только с nodes/links активного потока
  const setNodes = (updater: (prev: GraphNodeType[]) => GraphNodeType[]) => {
    setFlows((prev) =>
      prev.map((f) =>
        f.id === activeFlowId ? { ...f, nodes: updater(f.nodes) } : f
      )
    );
  };
  const setLinks = (updater: (prev: GraphLink[]) => GraphLink[]) => {
    setFlows((prev) =>
      prev.map((f) =>
        f.id === activeFlowId ? { ...f, links: updater(f.links) } : f
      )
    );
  };

  // Обновляю типизацию для новых типов узлов
  type NodeType =
    | "server"
    | "database"
    | "network"
    | "service"
    | "api"
    | "storage";

  const handleAddNode = useCallback((type: NodeType) => {
    const newNode: GraphNodeType = {
      id: generateNodeId(),
      type,
      name: `Новый ${type}`,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      health: Math.floor(Math.random() * 100),
      status: "healthy",
      properties: {},
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setHasChanges(true);
    toast.success(`${newNode.name} добавлен на граф`);
  }, []);

  const handleSelectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleDragNode = useCallback(
    (nodeId: string, x: number, y: number) => {
      setFlows((prev) =>
        prev.map((flow) =>
          flow.id === activeFlowId
            ? {
                ...flow,
                nodes: flow.nodes.map((node) =>
      node.id === nodeId ? { ...node, x, y } : node
                ),
              }
            : flow
        )
      );
    setHasChanges(true);
    },
    [activeFlowId]
  );

  const handleUpdateNode = useCallback(
    (nodeId: string, updates: Partial<GraphNodeType>) => {
      setNodes((prev) =>
        prev.map((node) =>
      node.id === nodeId ? { ...node, ...updates } : node
        )
      );
    setHasChanges(true);
    },
    []
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
    setHasChanges(true);
      toast.success("Узел удален");
    },
    [selectedNodeId]
  );

  const handleSave = () => {
    toast.success("Граф сохранен");
    setHasChanges(false);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(nodes, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "graph_export.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    
    toast.success("Граф экспортирован");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        toast.error("Файл не выбран");
        return;
      }

      try {
        // Читаем содержимое файла
        const fileContent = await file.text();

        // Парсим JSON
        let parsedData;
        try {
          parsedData = JSON.parse(fileContent);
        } catch (parseError) {
          throw new Error("Неверный JSON-формат файла");
        }

        // Проверяем поддерживаемые форматы
        const isArrayFormat = Array.isArray(parsedData);
        const isObjectFormat =
          parsedData &&
          typeof parsedData === "object" &&
          Array.isArray(parsedData.nodes);

        if (!isArrayFormat && !isObjectFormat) {
          throw new Error(
            "Формат файла не поддерживается. Ожидается: массив узлов или объект с полями nodes/links"
          );
        }

        // Извлекаем данные
        const nodesToImport = isArrayFormat ? parsedData : parsedData.nodes;
        const linksToImport = isArrayFormat ? [] : parsedData.links || [];

        // Проверяем узлы
        if (!Array.isArray(nodesToImport)) {
          throw new Error("Узлы должны быть массивом");
        }

        // Проверяем связи
        if (!Array.isArray(linksToImport)) {
          throw new Error("Связи должны быть массивом");
        }

        // Валидация узлов
        const invalidNode = nodesToImport.find(
          (node) =>
            !node.id ||
            !node.type ||
            typeof node.x !== "number" ||
            typeof node.y !== "number"
        );

        if (invalidNode) {
          throw new Error(`Некорректный узел: ${JSON.stringify(invalidNode)}`);
        }

        // Валидация связей
        const invalidLink = linksToImport.find(
          (link) => !link.source || !link.target || !link.id
        );

        if (invalidLink) {
          throw new Error(`Некорректная связь: ${JSON.stringify(invalidLink)}`);
        }

        // Обновляем состояние
        setNodes((prevNodes) => [...prevNodes, ...nodesToImport]);
        setLinks((prevLinks) => [...prevLinks, ...linksToImport]);
            setSelectedNodeId(null);
        setSelectedLinkId(null);
            setHasChanges(true);

        toast.success(
          `Успешно импортировано: ${nodesToImport.length} узлов, ${linksToImport.length} связей`
        );
          } catch (error) {
        console.error("Ошибка импорта:", error);
        toast.error(
          error instanceof Error
            ? `Ошибка импорта: ${error.message}`
            : "Неизвестная ошибка при импорте"
        );
      }
    };

    input.click();
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setNodes(() => []);
    setSelectedNodeId(null);
    setZoom(1);
    setHasChanges(false);
    toast.success("Граф очищен");
  };

  const handleClearAll = () => {
    if (nodes.length > 0) {
      setNodes(() => []);
      setSelectedNodeId(null);
      setHasChanges(true);
      toast.success("Все узлы удалены");
    }
  };

  // Drag&drop для добавления узла на canvas
  const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("application/node-type") as NodeType;
    if (!type) return;
    const canvas = document.getElementById("graph-canvas");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleAddNodeAt(type, x, y);
  };
  const handleCanvasDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  // Добавить узел в конкретную позицию
  const handleAddNodeAt = (type: NodeType, x: number, y: number) => {
    const newNode: GraphNodeType = {
      id: generateNodeId(),
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      x,
      y,
      health: Math.floor(Math.random() * 100),
      status: "healthy",
      properties: {},
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setHasChanges(true);
    toast.success(`${newNode.name} добавлен на граф`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Редактор графа</h1>
            <Badge variant={hasChanges ? "destructive" : "secondary"}>
              {hasChanges ? "Не сохранено" : "Сохранено"}
            </Badge>
            <span className="text-sm text-gray-500">
              Узлов: {nodes.length} | Масштаб: {Math.round(zoom * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              Импорт
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Сохранить
            </Button>
          </div>
        </div>
      </div>

      {/* UI для flows (сверху) */}
      <div className="flex items-center gap-2 p-2 bg-gray-100 border-b">
        {flows.map((flow) => (
          <div
            key={flow.id}
            className={`flex items-center gap-1 px-3 py-1 rounded cursor-pointer ${
              activeFlowId === flow.id
                ? "bg-white border border-green-400 font-bold"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleSelectFlow(flow.id)}
          >
            <span
              className="font-bold w-20 truncate cursor-default"
              title={flow.name}
            >
              {flow.name}
            </span>
            {flows.length > 1 && (
              <button
                className="text-red-400 ml-1"
                title="Удалить поток"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFlow(flow.id);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          className="ml-2 px-2 py-1 bg-green-200 rounded text-green-900 font-bold"
          onClick={handleAddFlow}
        >
          + Новый поток
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Tool Palette */}
        <div className="w-64 p-4 bg-gray-50 border-r border-gray-200">
          <NodePalette onAddNode={handleAddNode} />

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Управление</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4 mr-2" />
                Увеличить
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4 mr-2" />
                Уменьшить
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Сбросить
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-full justify-start"
                onClick={handleClearAll}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Очистить все
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative bg-white overflow-hidden">
          <div 
            id="graph-canvas"
            className="absolute inset-0 bg-[#f7f7fa] bg-grid-pattern"
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
              pointerEvents: "auto", // canvas принимает события
            }}
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
          >
            {/* SVG слой для связей */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: 1, pointerEvents: "none" }} // SVG не перехватывает события
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="10"
                  refY="3.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
                </marker>
              </defs>
              {links.map((link) => {
                const source = nodes.find(
                  (n) => n.id === link.source.split(":")[0]
                );
                const target = nodes.find(
                  (n) => n.id === link.target.split(":")[0]
                );
                if (!source || !target) return null;
                const sourceIdx = parseInt(
                  link.source.split(":")[1] || "0",
                  10
                );
                const targetIdx = parseInt(
                  link.target.split(":")[1] || "0",
                  10
                );
                // Получаем DOM-элементы узлов
                const sourceNodeEl = document.querySelector(
                  `[data-node-id="${source.id}"]`
                );
                const targetNodeEl = document.querySelector(
                  `[data-node-id="${target.id}"]`
                );
                let sx, sy, tx, ty;
                if (sourceNodeEl) {
                  const portCenter = getPortCenter(
                    sourceNodeEl as HTMLElement,
                    "output",
                    sourceIdx
                  );
                  const canvas = document.getElementById("graph-canvas");
                  const rect = canvas?.getBoundingClientRect();
                  if (portCenter && rect) {
                    sx = (portCenter.x - rect.left) / zoom;
                    sy = (portCenter.y - rect.top) / zoom;
                  }
                }
                if (targetNodeEl) {
                  const portCenter = getPortCenter(
                    targetNodeEl as HTMLElement,
                    "input",
                    targetIdx
                  );
                  const canvas = document.getElementById("graph-canvas");
                  const rect = canvas?.getBoundingClientRect();
                  if (portCenter && rect) {
                    tx = (portCenter.x - rect.left) / zoom;
                    ty = (portCenter.y - rect.top) / zoom;
                  }
                }
                // fallback если не удалось получить DOM
                if (sx === undefined || sy === undefined) {
                  const sourceY =
                    source.y +
                    40 +
                    (source.output && Array.isArray(source.output)
                      ? (sourceIdx - (source.output.length - 1) / 2) * 16
                      : 0);
                  sx = source.x + 120 + 8;
                  sy = sourceY + 8;
                }
                if (tx === undefined || ty === undefined) {
                  const targetY =
                    target.y +
                    40 +
                    (target.input && Array.isArray(target.input)
                      ? (targetIdx - (target.input.length - 1) / 2) * 16
                      : 0);
                  tx = target.x + 8;
                  ty = targetY + 8;
                }
                return (
                  <GraphLinkLine
                    key={link.id}
                    source={{ x: sx, y: sy, width: 0, height: 0 }}
                    target={{ x: tx, y: ty, width: 0, height: 0 }}
                    color={
                      link.status === "active"
                        ? "#22c55e"
                        : link.status === "error"
                        ? "#ef4444"
                        : "#a3a3a3"
                    }
                    markerEnd={false}
                    opacity={0.8}
                  />
                );
              })}
              {dragPort &&
                mousePos &&
                (() => {
                  const source = nodes.find((n) => n.id === dragPort.nodeId);
                  if (!source) return null;
                  const sourceIdx = dragPort.portIdx;
                  // Получаем DOM-элемент узла-источника
                  const sourceNodeEl = document.querySelector(
                    `[data-node-id="${source.id}"]`
                  );
                  let startX, startY;
                  if (sourceNodeEl) {
                    const portCenter = getPortCenter(
                      sourceNodeEl as HTMLElement,
                      "output",
                      sourceIdx
                    );
                    const canvas = document.getElementById("graph-canvas");
                    const rect = canvas?.getBoundingClientRect();
                    if (portCenter && rect) {
                      startX = (portCenter.x - rect.left) / zoom;
                      startY = (portCenter.y - rect.top) / zoom;
                    }
                  }
                  // Если не удалось получить координаты — fallback
                  if (startX === undefined || startY === undefined) {
                    const sourceY =
                      source.y +
                      40 +
                      (source.output && Array.isArray(source.output)
                        ? (sourceIdx - (source.output.length - 1) / 2) * 16
                        : 0);
                    startX = source.x + 120 + 8;
                    startY = sourceY + 8;
                  }
                  // Конец линии: если мышь над input-портом, берём его центр
                  let endX =
                    (mousePos.x -
                      (document
                        .getElementById("graph-canvas")
                        ?.getBoundingClientRect().left || 0)) /
                    zoom;
                  let endY =
                    (mousePos.y -
                      (document
                        .getElementById("graph-canvas")
                        ?.getBoundingClientRect().top || 0)) /
                    zoom;
                  const overInput = document.elementFromPoint(
                    mousePos.x,
                    mousePos.y
                  );
                  if (
                    overInput &&
                    overInput.getAttribute &&
                    overInput.getAttribute("data-port") === "input"
                  ) {
                    // Ищем родительский узел
                    let inputNodeEl = overInput.closest("[data-node-id]");
                    if (inputNodeEl) {
                      // Определяем индекс input-порта
                      const inputPorts = inputNodeEl.querySelectorAll(
                        '[data-port="input"]'
                      );
                      let inputIdx = Array.from(inputPorts).findIndex(
                        (el) => el === overInput
                      );
                      if (inputIdx !== -1) {
                        const portCenter = getPortCenter(
                          inputNodeEl as HTMLElement,
                          "input",
                          inputIdx
                        );
                        const canvas = document.getElementById("graph-canvas");
                        const rect = canvas?.getBoundingClientRect();
                        if (portCenter && rect) {
                          endX = (portCenter.x - rect.left) / zoom;
                          endY = (portCenter.y - rect.top) / zoom;
                        }
                      }
                    }
                  }
                  // Bezier control points
                  const dx = Math.max(Math.abs(endX - startX) * 0.5, 40);
                  const c1x = startX + dx;
                  const c1y = startY;
                  const c2x = endX - dx;
                  const c2y = endY;
                  return (
                    <path
                      d={`M${startX},${startY} C${c1x},${c1y} ${c2x},${c2y} ${endX},${endY}`}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth={3}
                      opacity={0.7}
                    />
                  );
                })()}
            </svg>
            {nodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-lg border border-gray-300 flex items-center justify-center">
                    <Settings className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Начните создание графа
                  </h3>
                  <p className="text-sm">
                    Добавьте компоненты из панели инструментов
                    <br />
                    или импортируйте существующую топологию
                  </p>
                </div>
              </div>
            ) : (
              <>
                {nodes.map((node) => (
                <GraphNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNodeId === node.id}
                    onSelect={setSelectedNodeId}
                  onDrag={handleDragNode}
                  onDelete={handleDeleteNode}
                    onPortConnectStart={handlePortConnectStart}
                    onPortConnectEnd={handlePortConnectEnd}
                    dragPort={dragPort}
                    links={links}
                    nodes={nodes}
                    onDoubleClick={() => setModalNodeId(node.id)}
                  />
                ))}
              </>
            )}
          </div>
          
          {/* Canvas info overlay */}
          <div className="absolute bottom-4 left-4 bg-green-600 px-4 py-2 rounded-lg shadow text-xs text-white font-semibold border border-green-800">
            Клик - выбор | Перетаскивание - перемещение
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 p-4 bg-gray-50 border-l border-gray-200">
          {/* Информация о потоке: редактирование имени */}
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Имя потока</div>
            <input
              className="w-full px-2 py-1 border rounded bg-white text-sm font-bold"
              value={activeFlow.name}
              onChange={(e) => handleRenameFlow(activeFlow.id, e.target.value)}
            />
          </div>
          <PropertiesPanel
            selectedNode={selectedNode}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            links={links}
            onSelectLink={setSelectedLinkId}
            selectedLinkId={selectedLinkId}
            flow={activeFlow}
            isNodeSelected={!!selectedNode}
          />
        </div>
      </div>
      {/* Модальное окно для настроек узла */}
      {modalNode && (
        <NodeDetailsModal
          node={modalNode}
          isOpen={!!modalNode}
          onClose={() => setModalNodeId(null)}
          onUpdate={handleUpdateNode}
        />
      )}
    </div>
  );
};

export default GraphEditor;
