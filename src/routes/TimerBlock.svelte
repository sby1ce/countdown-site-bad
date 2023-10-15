<script lang="ts">
  import { timers, updateTimers } from "./timers.ts";
  import { storageAvailable } from "./storage.ts";
  import Timer from "./Timer.svelte";
  import AddTimer from "./AddTimer.svelte";

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

    for (const timer of $timers) {
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

    timers.update((t) => [...t, newTimer]);

    if (storageAvailable("localStorage")) {
      localStorage.setItem("timers", JSON.stringify(timers));
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

  timers.update((t) => updateTimers(t, formats));
  setInterval(() => {
    timers.update((t) => updateTimers(t, formats));
  }, 1000);
</script>

{#each $timers as timer (timer.key)}
  <Timer countdowns={timer.timerStrings} name={timer.name} />
{/each}

<AddTimer on:click={addTimerEvent} />
