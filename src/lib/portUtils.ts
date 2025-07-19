// Утилита для вычисления абсолютных координат центра порта (input/output)
// nodeEl — DOM-элемент узла, portType: 'input' | 'output', portIdx — индекс порта
export function getPortCenter(
  nodeEl: HTMLElement,
  portType: "input" | "output",
  portIdx: number
): { x: number; y: number } | null {
  if (!nodeEl) return null;
  // Порты имеют data-port="input" или data-port="output"
  const selector = `[data-port="${portType}"]`;
  const ports = nodeEl.querySelectorAll(selector);
  if (!ports || !ports[portIdx]) return null;
  const portEl = ports[portIdx] as HTMLElement;
  const portRect = portEl.getBoundingClientRect();
  return {
    x: portRect.left + portRect.width / 2,
    y: portRect.top + portRect.height / 2,
  };
}
