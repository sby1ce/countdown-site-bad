<script lang='ts'>
  import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

  const stateMap: Map<string, boolean> = new Map();
  stateMap.set("success", false);
  stateMap.set("failure", false);

  function colourElement(state: string) {
    if (!stateMap.get(state)) {
      return null;
    }

    stateMap.set(state, true);
    setTimeout(() => {
      stateMap.set(state, false);
    }, 3000);
    console.log(stateMap.get(state))
  }

  function handleClick(e: Event) {
    e.preventDefault();

    try {
      dispatch('click');

      colourElement("success");
    } catch (error) {
      console.error(error);

      colourElement("failure");
    }
  }
</script>

<button 
  type="button"
  on:click={handleClick} 
  class:success={stateMap.get("success")}
  class:failure={stateMap.get("failure")}>
  <slot />
</button>

<style>
  button {
    font-family: inherit;
    border-width: 2px;
    box-sizing: border-box;
  }
  .success {
    border-color: limegreen;
    border-width: 10px;
    margin: -8px;
  }
  .failure {
    border-color: red;
    border-width: 10px;
    margin: -8px;
  }
</style>
