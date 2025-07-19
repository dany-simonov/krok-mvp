import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Bell, User, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar: () => void;
}

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Добро пожаловать!',
      description: 'Вы успешно вошли в систему KrokOS Graph',
      time: 'Только что',
      unread: true
    },
    {
      id: 2,
      title: 'Статус системы',
      description: 'Все компоненты работают нормально',
      time: '5 мин назад',
      unread: true
    },
    {
      id: 3,
      title: 'Обновление данных',
      description: 'Синхронизация завершена успешно',
      time: '2 часа назад'
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, unread: false} : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, unread: false}))); // Исправлено: добавлены недостающие скобки
  };

  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);
  const goToSettings = () => navigate('/settings');

  return (
    <>
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">KrokOS Graph</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-5 h-5 text-xs bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-96 p-0">
              <div className="px-4 py-3 border-b">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Уведомления</span>
                  {unreadCount > 0 && (
                    <Button 
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-blue-600"
                      onClick={markAllAsRead}
                    >
                      Прочитать все
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={cn(
                      "px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors relative",
                      notification.unread && "bg-blue-50"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{notification.title}</span>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                    
                    {notification.unread && (
                      <div className="absolute top-4 left-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-600 text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium">
                  {user?.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {user?.role}
                </Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={openProfile}>
                <User className="mr-2 h-4 w-4" />
                Профиль
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={goToSettings}>
                <Settings className="mr-2 h-4 w-4" />
                Настройки
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Модальное окно профиля */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
            onClick={closeProfile}
          />
          
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Профиль пользователя
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={closeProfile}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-green-600 text-white text-2xl">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-xl font-semibold">{user?.name}</h4>
                      <Badge variant="secondary" className="mt-1">
                        {user?.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm font-medium">{user?.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Дата регистрации</p>
                      <p className="text-sm font-medium">
                        {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Статус</p>
                      <p className="text-sm font-medium text-green-600">
                        Активен
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  type="button"
                  variant="default"
                  className="w-full sm:ml-3 sm:w-auto"
                  onClick={closeProfile}
                >
                  Закрыть
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};