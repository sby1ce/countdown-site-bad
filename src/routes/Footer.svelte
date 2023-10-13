<script lang='ts'>
  function colourElement(element: HTMLElement, state: string) {
    const newColour = state;

    element.classList.add(newColour);
    setTimeout(() => {
      element.classList.remove(newColour);
    });
  }

  function deleteLocalStorage() {
    localStorage.clear();
  }
  function timersToClipboard() {
    // TODO
  }
  const valueToHandler = {
    'Delete localStorage': deleteLocalStorage,
    'Get timers as text': timersToClipboard,
  }

  /**
   * @param {Event} e
   */
  function handleClick(e) {
    e.preventDefault();

    const handlerFunc = valueToHandler[e.currentTarget.value];
    try {
      handlerFunc();

      colourElement(e.currentTarget, "success");
    } catch (error) {
      console.error(error);

      colourElement(e.currentTarget, "failure");
    }
  }
</script>

<footer>
  <button type="button">Delete localStorage</button>

  <button type="button">Get timers as text</button>

  <button type="button">Load timers from text</button>
</footer>

<style>
  footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .success {
    border-color: limegreen;
  }
  .failure {
    border-color: red;
  }
</style>