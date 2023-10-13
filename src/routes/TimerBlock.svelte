<script>
    import { updateTimers } from './timers.ts';
    import Timer from './Timer.svelte';
    import AddTimer from './AddTimer.svelte';

    /**
     * @param {string} timerName
     */
    function hashTimerName(timerName) {
        return `timer${Array.from(timerName).reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0)}`
    }

    /**
     * @param {string} dateString
     */
    function dateStringToUnix(dateString) {
        try {
            const temp = new Date(dateString);

            return Date.UTC(
                temp.getUTCFullYear(), 
                temp.getUTCMonth(),
                temp.getUTCDate(),
                temp.getUTCHours(),
                temp.getUTCMinutes(),
                temp.getUTCSeconds(),
                temp.getUTCMilliseconds()
                );
        } catch {
            return null;
        }
    }

    /**
     * @param {{ detail: { timerDate: string; timerName: string; }; }} event
     */
    function addTimerEvent(event) {
        const newOrigin = dateStringToUnix(event.detail.timerDate);

        if (typeof newOrigin !== 'number' || Number.isNaN(newOrigin)) {
            return null;
        }
        
        const innerName = hashTimerName(event.detail.timerName);

        for (const timer of timers) {
            if (timer.key === innerName) {
                return null;
            }
        }

        const newTimer = {
            key: innerName,
            name: event.detail.timerName,
            origin: newOrigin,
            timerStrings: [
                '0d 0h 0m 0s',
                '0s',
                '0h'
            ]
        }

        timers = [...timers, newTimer];
    }

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
        },
        {
            key: 'Timer 2',
            name: 'IYKYK',
            origin: 1607025600000,
            timerStrings: []
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
    
    timers = updateTimers(timers, formats);
    setInterval(() => {
        timers = updateTimers(timers, formats);
    }, 1000)
</script>

{#each timers as timer (timer.key)}
    <Timer 
        countdowns={timer.timerStrings}
        name={timer.name}
    />
{/each}

<AddTimer on:click={addTimerEvent}/>
