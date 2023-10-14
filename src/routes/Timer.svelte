<script lang="ts">
  export let countdowns: string[] = ["0h 0d 0m 0s"];
  export let name: string = "Default name";
</script>

<article>
  <h1>{name}</h1>
  <section>
    {#each countdowns as countdown}
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
