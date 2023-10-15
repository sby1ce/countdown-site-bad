<script lang="ts">
  import FooterButton from "./FooterButton.svelte";
  import { timers } from "./timers.ts";

  function deleteLocalStorage() {
    if (localStorage.length) {
      localStorage.clear();
      console.log("Cleared localStorage");
    } else {
      console.log("localStorage already clear");
    }
  }

  function timersToClipboard() {
    navigator.clipboard.writeText(`timers${JSON.stringify($timers)}`);
  }

  function clipboardToTimers() {
    navigator.clipboard.readText().then((clipText) => {
      const timersString: string = clipText.slice(6);

      if (
        clipText === null ||
        (!clipText.startsWith("timers") || timersString.length < 2)
      ) {
        throw new Error('Incorrect JSON in clipboard');
      }

      timers.set(JSON.parse(timersString));
    }).catch(error => { throw new Error(error); });
  }
</script>

<footer>
  <FooterButton on:click={deleteLocalStorage}>Delete localStorage</FooterButton>

  <FooterButton on:click={timersToClipboard}>Timers to clipboard</FooterButton>

  <FooterButton on:click={clipboardToTimers}>Timers from clipboard</FooterButton
  >
</footer>

<style>
  footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>
