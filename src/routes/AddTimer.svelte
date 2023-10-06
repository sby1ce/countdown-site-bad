<div class='outer'>
    <div class='inner'>
        <label for='addName' hidden>Add timer name</label>
        <input name='addName' type='text' />
        <label for='addTime' hidden>Choose time</label>
        <input name='addTime' type='datetime-local' step='0.01' />
    </div>

    <button type='button'>
        Add timer
    </button>
</div>

<style>
    button {
        font-family: inherit;
    }
    div {  
        display: flex;
    }
    .outer {
        flex-direction: row;
        inline-size: 20em;
    }
    .inner {
        flex-direction: column;
    }
</style>