import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Server,
  Database,
  Network,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Metrics: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleRefresh = async () => {
    setIsLoading(true);
    toast.success("Начинаем обновление метрик...");

    // Имитация загрузки
    setTimeout(() => {
      toast.success("Получаем данные с серверов мониторинга");
    }, 1000);

    setTimeout(() => {
      setIsLoading(false);
      setLastUpdate(new Date());
      toast.success("Метрики успешно обновлены");
    }, 3000);
  };

  useEffect(() => {
    // Автоматическое приветствие при загрузке страницы
    toast.success("Добро пожаловать в раздел метрик");
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Метрики и мониторинг
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time мониторинг состояния инфраструктуры
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Обновлено: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Загружаем..." : "Обновить"}
          </Button>
        </div>
      </div>

      {/* Real-time Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Серверы</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">20 активных</span>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-600">4 предупреждения</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Базы данных</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">7 активных</span>
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">1 критический</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Сетевые устройства
            </CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">все активны</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Активные алерты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-800">
                    Высокая нагрузка на DB-01
                  </div>
                  <div className="text-sm text-red-600">CPU: 95%, RAM: 87%</div>
                </div>
              </div>
              <Badge variant="destructive">Критический</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-medium text-yellow-800">
                    Медленный ответ API
                  </div>
                  <div className="text-sm text-yellow-600">
                    Время ответа: 2.3s
                  </div>
                </div>
              </div>
              <Badge variant="secondary">Предупреждение</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-medium text-yellow-800">
                    Место на диске заканчивается
                  </div>
                  <div className="text-sm text-yellow-600">
                    Свободно: 15% на /var/log
                  </div>
                </div>
              </div>
              <Badge variant="secondary">Предупреждение</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Обзор системных метрик</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Графики метрик</h3>
            <p className="text-sm">
              Здесь будут отображаться детальные графики
              <br />
              производительности и исторические данные
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Metrics;
