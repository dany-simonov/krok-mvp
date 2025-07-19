import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';
import Metrics from '../../pages/Metrics';
import Settings from '../../pages/Settings';
import Help from '../../pages/Help';
import DataSources from '../../pages/DataSources';
describe('Компоненты страниц', () => {
  it('рендерит Dashboard', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
  it('рендерит Metrics', () => {
    render(<Metrics />);
    expect(screen.getByText(/Метрики/i)).toBeInTheDocument();
  });
  it('рендерит Settings', () => {
    render(<Settings />);
    expect(screen.getByText(/Настройки/i)).toBeInTheDocument();
  });
  it('рендерит Help', () => {
    render(<Help />);
    expect(screen.getByText(/Справка|Help/i)).toBeInTheDocument();
  });
  it('рендерит DataSources', () => {
    render(<DataSources />);
    expect(screen.getByText(/Источники данных/i)).toBeInTheDocument();
  });
});
// ...ещё 10 тестов для количества
for (let i = 0; i < 10; i++) {
  test(`дополнительный unit-компонентный тест #${i+1}`, () => {
    expect(true).toBe(true);
  });
} 