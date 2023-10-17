<script lang="ts">
  import { timers } from "./timers.ts";

  export let position: number;
</script>

<article>
  <h1>{$timers[position].name}</h1>
  <section>
    {#each $timers[position].timerStrings as countdown}
      <p>{countdown}</p>
    {/each}
  </section>
</article>

<style>
  article {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  section {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  p {
    /*box-sizing: border-box;*/
    margin: 0px 5px 0px 5px;
  }
</style>
