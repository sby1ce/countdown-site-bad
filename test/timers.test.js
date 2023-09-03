const indexModule = require('../scripts/index');

describe('Date to string conversion', () => {
  it('Returns a String', () => {
    str = indexModule.convertDateToString(10000, { minutes: true });

    expect(typeof str).toBe('String');
  });

  it.todo('Returns with a minus if the interval is negative', () => {
    // TODO
  });
});
