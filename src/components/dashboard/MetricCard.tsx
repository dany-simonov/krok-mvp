import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  status?: 'healthy' | 'warning' | 'critical';
  icon?: React.ReactNode;
}

const statusColors = {
  healthy: 'text-green-600 bg-green-50 border-green-200',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  critical: 'text-red-600 bg-red-50 border-red-200'
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  status = 'healthy',
  icon
}) => {
  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", statusColors[status])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">
            <span className={cn(
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            )}>
              {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
            </span>{' '}
            от прошлого периода
          </p>
        )}
      </CardContent>
    </Card>
  );
};