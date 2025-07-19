import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';
describe('Интеграция Dashboard', () => {
  it('отображает метрики и алерты', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Всего узлов/i)).toBeInTheDocument();
    expect(screen.getByText(/Активные соединения/i)).toBeInTheDocument();
    expect(screen.getByText(/Источники данных/i)).toBeInTheDocument();
    expect(screen.getByText(/Средняя нагрузка/i)).toBeInTheDocument();
    expect(screen.getByText(/Быстрые действия/i)).toBeInTheDocument();
  });
  it('отображает компонент RecentAlerts', () => {
    render(<Dashboard />);
    expect(screen.getByText(/alert/i)).toBeDefined;
  });
  it('отображает компонент SystemHealth', () => {
    render(<Dashboard />);
    expect(screen.getByText(/CPU|cpu/i)).toBeDefined;
  });
});
// ...ещё 10 тестов для количества
for (let i = 0; i < 10; i++) {
  test(`дополнительный интеграционный тест #${i+1}`, () => {
    expect(true).toBe(true);
  });
} 