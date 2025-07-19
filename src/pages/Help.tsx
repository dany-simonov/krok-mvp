import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Mail,
  FileText,
  Video,
  Download,
} from "lucide-react";
import { toast } from "sonner";

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast.success(`Ищем информацию по запросу: "${searchQuery}"`);

      setTimeout(() => {
        toast.success("Результаты поиска готовы");
      }, 1500);
    }
  };

  const handleContactSupport = () => {
    toast.success("Подключаемся к службе поддержки...");

    setTimeout(() => {
      toast.success("Ваш запрос отправлен в поддержку");
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Справка и поддержка
          </h1>
          <p className="text-gray-600 mt-1">
            Документация, руководства и техническая поддержка
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск в документации..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>Найти</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-600" />
              Руководство пользователя
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Полное руководство по использованию KrokOS Graph
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Открыть
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-red-600" />
              Видеоуроки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Обучающие видео по работе с системой
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Video className="h-4 w-4 mr-2" />
              Смотреть
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-green-600" />
              API Документация
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Техническая документация для разработчиков
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Скачать
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Часто задаваемые вопросы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium mb-2">
                Как добавить новый узел в граф?
              </h3>
              <p className="text-sm text-gray-600">
                Перейдите в раздел "Редактор графа", выберите нужный тип узла из
                панели инструментов и перетащите его на холст. Затем настройте
                свойства узла в инспекторе.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium mb-2">
                Как настроить подключение к Prometheus?
              </h3>
              <p className="text-sm text-gray-600">
                В разделе "Источники данных" найдите карточку Prometheus,
                введите URL сервера и нажмите "Тест соединения" для проверки
                доступности.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium mb-2">Как настроить алерты?</h3>
              <p className="text-sm text-gray-600">
                В разделе "Метрики" настройте условия срабатывания алертов,
                выберите каналы уведомлений и установите пороговые значения для
                каждого типа метрик.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">
                Какие роли пользователей поддерживаются?
              </h3>
              <p className="text-sm text-gray-600">
                Система поддерживает три роли: Viewer (просмотр), Editor
                (редактирование графов) и Admin (полный доступ к настройкам и
                управлению пользователями).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Техническая поддержка
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium">Контактная информация</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Email: support@krokos.com</div>
                <div>Телефон: +7 (495) 123-45-67</div>
                <div>Время работы: Пн-Пт 9:00-18:00 МСК</div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium">Быстрая связь</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleContactSupport}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Отправить запрос
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleContactSupport}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Онлайн чат
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
