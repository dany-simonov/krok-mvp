import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraphNode, GraphLink } from "@/types/graph";
import { Settings, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface PropertiesPanelProps {
  selectedNode: GraphNode | null;
  onUpdateNode: (nodeId: string, updates: Partial<GraphNode>) => void;
  onDeleteNode: (nodeId: string) => void;
  links: GraphLink[];
  onSelectLink: (linkId: string) => void;
  selectedLinkId: string | null;
  flow: { id: string; name: string; nodes: GraphNode[]; links: GraphLink[] };
  isNodeSelected: boolean;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
  links,
  onSelectLink,
  selectedLinkId,
  flow,
  isNodeSelected,
}) => {
  // Всегда показываем настройки потока
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Информация о потоке</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="font-bold">{flow.name}</div>
          <div className="text-sm text-gray-600">ID: {flow.id}</div>
          <div className="text-sm">Узлов: {flow.nodes.length}</div>
          <div className="text-sm">Связей: {flow.links.length}</div>
          <div className="text-xs text-gray-500 pt-2">
            Здесь вы можете создавать и настраивать потоки обработки данных,
            соединяя инфраструктурные компоненты.
          </div>
        </div>
        {/* Если выбран узел — показываем только id и тип */}
        {isNodeSelected && selectedNode && (
          <div className="pt-2 border-t mt-2">
            <div className="font-semibold text-sm mb-2">Выбранный узел</div>
            <div className="text-xs text-gray-500 mb-1">ID</div>
            <div className="mb-2 text-sm font-mono">{selectedNode.id}</div>
            <div className="text-xs text-gray-500 mb-1">Тип</div>
            <div className="mb-2 text-sm font-mono">{selectedNode.type}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
