<script lang='ts'>
  import { dispatch } from 'svelte';

  function handleClick() {
    dispatch();
  }

  let id: string;
  let name: string;

</script>

<button 
  type="button"
  on:click={handleClick} 
  id>
  {name}
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
