<script lang='ts'>
  import FooterButton from './FooterButton.svelte';

  function deleteLocalStorage() {
    if (localStorage.length) {
      localStorage.clear();
      console.log('Cleared localStorage');
    } else {
      console.log('localStorage already clear');
    }
  }
  function timersToClipboard() {
    // TODO
    throw new Error('Test');
  }

  function clipboardToTimers() {
    // TODO
  }
</script>

<footer>
  <FooterButton on:click={deleteLocalStorage}>Delete localStorage</FooterButton>
  
  <FooterButton on:click={timersToClipboard}>Timers to clipboard</FooterButton>

  <FooterButton on:click={clipboardToTimers}>Timers from clipboard</FooterButton>
</footer>

<style>
  footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>
