let hoursTick = document.querySelectorAll('.demo .clocklet-tick.clocklet-tick--hour')
let hours_position = [
    {
        "value": 12,
        "deg": "transform: rotate(0deg);",
        "style": "left:50%;top:11%"
    },
    {
        "value": 1,
        "deg": "transform: rotate(30deg);",
        "style": "left:69.5%;top:16.2%"
    },
    {
        "value": 2,
        "deg": "transform: rotate(60deg);",
        "style": "left:83.8%;top:30.5%"
    },
    {
        "value": 3,
        "deg": "transform: rotate(90deg);",
        "style": "left:89%;top:50%"
    },
    {
        "value": 4,
        "deg": "transform: rotate(120deg);",
        "style": "left:83.8%;top:69.5%"
    },
    {
        "value": 5,
        "deg": "transform: rotate(150deg);",
        "style": "left:69.5%;top:83.8%"
    },
    {
        "value": 6,
        "deg": "transform: rotate(180deg);",
        "style": "left:50%;top:89%"
    },
    {
        "value": 7,
        "deg": "transform: rotate(210deg);",
        "style": "left:30.5%;top:83.8%"
    },
    {
        "value": 8,
        "deg": "transform: rotate(240deg);",
        "style": "left:16.2%;top:69.5%"
    },
    {
        "value": 9,
        "deg": "transform: rotate(270deg);",
        "style": "left:11%;top:50%"
    },
    {
        "value": 10,
        "deg": "transform: rotate(300deg);",
        "style": "left:16.2%;top:30.5%"
    },
    {
        "value": 11,
        "deg": "transform: rotate(330deg);",
        "style": "left:30.5%;top:16.2%"
    }
]

hoursTick.forEach(function(tick, index) {
    tick.click()
    let data = {
        'value': index,
        deg: `transform: rotate(${index * 30}deg);`,
        style: tick.getAttribute('style'),
    }
    hours_position.push(data)
})
console.log(hours_position);