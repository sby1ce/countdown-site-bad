<script>
    import { updateTimers } from './timers.ts';
    import Timer from './Timer.svelte';
    import AddTimer from './AddTimer.svelte';

    let timers = [
        {
            key: 'Timer 0',
            name: 'Timer 0 name',
            origin: 0,
            timerStrings: [
                '0d 0h 0m 0s',
                '0s',
                '0h'
            ]
        },
        {
            key: 'Timer 1',
            name: 'Timer 1 here',
            origin: 1696174196000,
            timerStrings: [
                '1d 1h 1m 1s',
                '1s',
                '1h'
            ]
        }
    ]
    let formats = [
        {
            day: true,
            hour: true,
            minute: true,
            second: true
        },
        {
            second: true
        },
        {
            hour: true
        }
    ];
    
    updateTimers(timers, formats);
    timers = [...timers];
    setInterval(() => {
        updateTimers(timers, formats);
        // console.log(timers[0].timerStrings[0]);
        timers = [...timers];
    }, 1000)
</script>

{#each timers as timer (timer.key)}
    <Timer 
        countdowns={timer.timerStrings}
        name={timer.name}   
    />
{/each}

<AddTimer />
