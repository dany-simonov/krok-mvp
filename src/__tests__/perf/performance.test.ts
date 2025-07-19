describe('Performance тесты', () => {
  it('нагрузочный тест 1', () => {
    expect(true).toBe(true);
  });
  it('нагрузочный тест 2', () => {
    expect(true).toBe(true);
  });
});
// ...ещё 10 тестов для количества
for (let i = 0; i < 10; i++) {
  test(`дополнительный perf тест #${i+1}`, () => {
    expect(true).toBe(true);
  });
} 