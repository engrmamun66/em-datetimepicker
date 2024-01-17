let hoursTick = document.querySelectorAll('.demo .clocklet-tick.clocklet-tick--minute')
let minutes_position = []

hoursTick.forEach(function(tick, index) {
    tick.click()
    let data = {
        'id': index,
        'value': String(index).padStart(2, '0'),
        deg: `transform: rotate(${index * 6}deg);`,
        style: tick.getAttribute('style'),
    }
    minutes_position.push(data)
})
console.log(minutes_position);