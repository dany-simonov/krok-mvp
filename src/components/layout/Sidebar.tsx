import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  GitBranch, 
  BarChart3, 
  Database, 
  Settings, 
  HelpCircle,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard
  },
  {
    name: 'Редактор графа',
    href: '/editor',
    icon: GitBranch
  },
  {
    name: 'Метрики',
    href: '/metrics',
    icon: BarChart3
  },
  {
    name: 'Источники данных',
    href: '/datasources',
    icon: Database
  },
  {
    name: 'Настройки',
    href: '/settings',
    icon: Settings
  },
  {
    name: 'Справка',
    href: '/help',
    icon: HelpCircle
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-full bg-gray-50 border-r border-gray-200 transition-transform duration-300 ease-in-out",
          "lg:static lg:translate-x-0",
          isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:w-16"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {isOpen && <span className="font-medium text-gray-900">Навигация</span>}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    end={item.href === '/'}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        "hover:bg-gray-100",
                        isActive
                          ? "bg-green-100 text-green-800 font-medium"
                          : "text-gray-700"
                      )
                    }
                    onClick={() => window.innerWidth < 1024 && onClose()}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {isOpen && <span>{item.name}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};