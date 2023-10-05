<script>
    import TimerBlock from './TimerBlock.svelte';
</script>

<h1>Watch countdowns</h1>

<TimerBlock />

<style>
    :global(body) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: Helvetica, Arial, sans-serif;
        background-color: #333333;
        color: #cccccc;
    }
</style>