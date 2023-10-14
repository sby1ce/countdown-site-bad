<script context="module" lang="ts">
  function storageAvailable(type: string) {
    let storage;
    try {
      //@ts-expect-error
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        (e.name === "QuotaExceededError" ||
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }
</script>

<script lang="ts">
  import { updateTimers } from "./timers.ts";
  import Timer from "./Timer.svelte";
  import AddTimer from "./AddTimer.svelte";

  interface ITimer {
    key: string;
    name: string;
    origin: number;
    timerStrings: string[];
  }

  function hashTimerName(timerName: string) {
    return `timer${Array.from(timerName).reduce(
      (hash, char) => 0 | (31 * hash + char.charCodeAt(0)),
      0,
    )}`;
  }

  function dateStringToUnix(dateString: string) {
    try {
      const temp = new Date(dateString);

      return Date.UTC(
        temp.getUTCFullYear(),
        temp.getUTCMonth(),
        temp.getUTCDate(),
        temp.getUTCHours(),
        temp.getUTCMinutes(),
        temp.getUTCSeconds(),
        temp.getUTCMilliseconds(),
      );
    } catch {
      return null;
    }
  }

  function addTimerEvent(event: {
    detail: { timerDate: string; timerName: string };
  }) {
    const newOrigin = dateStringToUnix(event.detail.timerDate);

    if (typeof newOrigin !== "number" || Number.isNaN(newOrigin)) {
      return null;
    }

    const innerName = hashTimerName(event.detail.timerName);

    for (const timer of timers) {
      if (timer.key === innerName) {
        return null;
      }
    }

    const newTimer = {
      key: innerName,
      name: event.detail.timerName,
      origin: newOrigin,
      timerStrings: ["0d 0h 0m 0s", "0s", "0h"],
    };

    timers = [...timers, newTimer];
    try {
      localStorage.setItem("timers", JSON.stringify(timers));
    } catch (e) {
      console.error(e);
    }
  }

  let formats = [
    {
      day: true,
      hour: true,
      minute: true,
      second: true,
    },
    {
      second: true,
    },
    {
      hour: true,
    },
  ];

  function loadFromLocalStorage(): ITimer[] {
    if (!storageAvailable("localStorage")) {
      return [
        {
          key: "Timer 0",
          name: "Timer 0 name",
          origin: 0,
          timerStrings: ["0d 0h 0m 0s", "0s", "0h"],
        },
        {
          key: "Timer 1",
          name: "Timer 1 here",
          origin: 1696174196000,
          timerStrings: ["1d 1h 1m 1s", "1s", "1h"],
        },
        {
          key: "Timer 2",
          name: "IYKYK",
          origin: 1607025600000,
          timerStrings: [],
        },
      ];
    }
    //@ts-expect-error
    return JSON.parse(localStorage.getItem("timers"));
  }

  let timers: ITimer[] = loadFromLocalStorage();

  timers = updateTimers(timers, formats);
  setInterval(() => {
    timers = updateTimers(timers, formats);
  }, 1000);
</script>

{#each timers as timer (timer.key)}
  <Timer countdowns={timer.timerStrings} name={timer.name} />
{/each}

<AddTimer on:click={addTimerEvent} />
