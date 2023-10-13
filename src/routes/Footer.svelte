<script lang='ts'>
  function colourElement(id: string, state: string) {
    const element = document.querySelector(`#${id}`)!;
    const newColour = state;
    console.log('Colouring', newColour);

    element.classList.add(newColour);
    setTimeout(() => {
      element.classList.remove(newColour);
    });
    console.log('coloured', element.classList);
  }

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
  }

  /**
   * @param {Event} e
   */
  function handleClick(e: Event) {
    e.preventDefault();
    console.log('Handling click');

    const cmd = e.currentTarget.id;
    try {
      if (cmd === "clear") {
        deleteLocalStorage();
      } else if (cmd === "get") {
        timersToClipboard();
      } else if (cmd === "load") {
        // TODO
      } else {
        return undefined;
      }

      colourElement(cmd, "success");
    } catch (error) {
      console.error(error);

      colourElement(cmd, "failure");
    }
  }
</script>

<footer>
  <button type="button" id="clear" on:click={handleClick}>Delete localStorage</button>

  <button type="button" id="get" on:click={handleClick}>Get timers as text</button>

  <button type="button" id="load" on:click={handleClick}>Load timers from text</button>
</footer>

<style>
  footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>
