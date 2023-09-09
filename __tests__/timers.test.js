import { convertDateToString } from '../scripts/index.mjs';
import { createTimer, timerNameToHash } from '../scripts/timersModule.mjs';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Creates div element with timers', () => {
  it('Returns an HTML element', () => {
    const timerName = 'Test';
    const innerName = timerNameToHash(timerName);

    const timerWrapper = createTimer(timerName, innerName);

    expect(timerWrapper).toBeInstanceOf(HTMLElement);
  });
});

describe('Convert the number in milliseconds to string for display', () => {
  it('Returns a string', () => {
    const thing = convertDateToString(Date.now(), {
      days: true,
      hours: true,
      minutes: true,
      seconds: true,
    });

    expect(typeof thing).toEqual('string');
    expect(thing).not.toEqual('');
  });

  it('Has a minus when the timer is in the past', () => {
    const then = Date.now();

    sleep(1000).then(() => {
      const now = Date.now();

      const thing = convertDateToString(then - now, {
        days: true,
        hours: true,
        minutes: true,
        seconds: true,
      });
      expect(thing[0]).toEqual('-');
    });
  });

  it('Negative timers are negative of positive timers', async () => {
    const past = Date.now();

    await sleep(1000);
    const present = Date.now();

    sleep(1000).then(() => {
      const future = Date.now();

      const thing1 = convertDateToString(past - present, {
        days: true,
        hours: true,
        minutes: true,
        seconds: true,
      });
      const thing2 = convertDateToString(future - present, {
        days: true,
        hours: true,
        minutes: true,
        seconds: true,
      });
      expect(thing1.slice(1, thing1.length)).toEqual(thing2);
    });
  });
});
