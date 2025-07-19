/**
 * @fileoverview Data Sources management page for Krok MVP
 * 
 * This component provides an interface for managing connections to various
 * monitoring and data collection systems. Users can configure, test, and
 * monitor connections to systems like Prometheus, Kubernetes, InfluxDB,
 * Grafana, and ElasticSearch.
 * 
 * Features:
 * - Connection status monitoring
 * - Connection testing and validation
 * - Configuration management for data sources
 * - Support for multiple monitoring system types
 * - Real-time connection status updates
 * 
 * @author Krok Development Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Server, 
  Plus, 
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * DataSources component
 * 
 * Main page for managing data source connections. Provides interfaces
 * for configuring and monitoring connections to various monitoring systems.
 * Includes connection testing, status monitoring, and configuration management.
 * 
 * @returns JSX.Element - The data sources management interface
 */
const DataSources: React.FC = () => {
  /**
   * State to track connection testing status
   * Prevents multiple simultaneous connection tests
   */
  const [isConnecting, setIsConnecting] = useState(false);

  /**
   * Handles connection testing for a data source
   * 
   * Simulates a connection test with toast notifications to provide
   * user feedback during the connection process.
   * 
   * @param sourceName - The name of the data source to test
   */
  const handleConnect = async (sourceName: string) => {
    setIsConnecting(true);
    
    // Initial connection attempt notification
    toast.success(`Подключаемся к ${sourceName}...`);

    // Simulate connection validation
    setTimeout(() => {
      toast.info("Проверяем доступность сервиса");
    }, 1000);

    // Simulate successful connection
    setTimeout(() => {
      setIsConnecting(false);
      toast.success(`Успешно подключились к ${sourceName}`);
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page header with title and add source button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Источники данных</h1>
          <p className="text-gray-600 mt-1">
            Управление подключениями к системам мониторинга
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Добавить источник
        </Button>
      </div>

      {/* Current data sources configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prometheus data source card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Prometheus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Connection status indicator */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Статус подключения:</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Подключен
              </Badge>
            </div>
            
            {/* Server URL configuration */}
            <div className="space-y-2">
              <Label htmlFor="prometheus-url">URL сервера</Label>
              <Input 
                id="prometheus-url" 
                value="http://prometheus.krokos.local:9090" 
                readOnly 
              />
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleConnect('Prometheus')}
                disabled={isConnecting}
              >
                {isConnecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Тест соединения
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Настроить
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Kubernetes data source card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Kubernetes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Connection status indicator */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Статус подключения:</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                Настройка
              </Badge>
            </div>
            
            {/* API server configuration */}
            <div className="space-y-2">
              <Label htmlFor="k8s-url">API сервер</Label>
              <Input 
                id="k8s-url" 
                placeholder="https://k8s-api.krokos.local:6443" 
              />
            </div>
            
            {/* Access token configuration */}
            <div className="space-y-2">
              <Label htmlFor="k8s-token">Токен доступа</Label>
              <Input 
                id="k8s-token" 
                type="password"
                placeholder="••••••••••••••••" 
              />
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2">
              <Button 
                size="sm"
                onClick={() => handleConnect('Kubernetes')}
                disabled={isConnecting}
              >
                {isConnecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Подключить
              </Button>
              <Button variant="outline" size="sm">
                Импорт топологии
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available data sources for configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Доступные источники</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* InfluxDB data source */}
            <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Database className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="font-medium">InfluxDB</div>
                  <div className="text-sm text-gray-500">Временные ряды</div>
                </div>
              </div>
              {/* <Button variant="outline" size="sm" className="w-full">
                Настроить
              </Button> */}
            </div>

            {/* Grafana data source */}
            <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Server className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="font-medium">Grafana</div>
                  <div className="text-sm text-gray-500">Дашборды</div>
                </div>
              </div>
              {/* <Button variant="outline" size="sm" className="w-full">
                Настроить
              </Button> */}
            </div>

            {/* ElasticSearch data source */}
            <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Database className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="font-medium">ElasticSearch</div>
                  <div className="text-sm text-gray-500">Логи и поиск</div>
                </div>
              </div>
              {/* <Button variant="outline" size="sm" className="w-full">
                Настроить
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSources;
