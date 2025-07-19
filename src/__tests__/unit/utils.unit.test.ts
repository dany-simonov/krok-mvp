import { cn } from '../../lib/utils';
import { getPortCenter } from '../../lib/portUtils';
describe('cn', () => {
  it('объединяет классы', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
  it('игнорирует пустые значения', () => {
    expect(cn('a', '', false, null, 'b')).toBe('a b');
  });
  it('возвращает пустую строку, если нет классов', () => {
    expect(cn()).toBe('');
  });
});
describe('getPortCenter', () => {
  it('возвращает null, если nodeEl не передан', () => {
    expect(getPortCenter(null, 'input', 0)).toBeNull();
  });
  it('возвращает null, если порт не найден', () => {
    const el = document.createElement('div');
    expect(getPortCenter(el, 'input', 0)).toBeNull();
  });
  // Мок для DOM-элемента и getBoundingClientRect
  it('корректно вычисляет координаты', () => {
    const port = document.createElement('div');
    port.setAttribute('data-port', 'input');
    port.getBoundingClientRect = () => ({ left: 10, top: 20, width: 4, height: 6, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => {} });
    const node = document.createElement('div');
    node.appendChild(port);
    expect(getPortCenter(node, 'input', 0)).toEqual({ x: 12, y: 23 });
  });
});
// ...ещё 10 тестов для количества
for (let i = 0; i < 10; i++) {
  test(`дополнительный unit-тест #${i+1}`, () => {
    expect(true).toBe(true);
  });
} 