let hoursTick = document.querySelectorAll('.demo .clocklet-tick.clocklet-tick--hour')
let hours_position = [
    {
        "id": 12,
        "value": "12",
        "deg": "transform: rotate(0deg);",
        "style": "left:50%;top:11%"
    },
    {
        "id": 1,
        "value": "01",
        "deg": "transform: rotate(30deg);",
        "style": "left:69.5%;top:16.2%"
    },
    {
        "id": 2,
        "value": "02",
        "deg": "transform: rotate(60deg);",
        "style": "left:83.8%;top:30.5%"
    },
    {
        "id": 3,
        "value": "03",
        "deg": "transform: rotate(90deg);",
        "style": "left:89%;top:50%"
    },
    {
        "id": 4,
        "value": "04",
        "deg": "transform: rotate(120deg);",
        "style": "left:83.8%;top:69.5%"
    },
    {
        "id": 5,
        "value": "05",
        "deg": "transform: rotate(150deg);",
        "style": "left:69.5%;top:83.8%"
    },
    {
        "id": 6,
        "value": "06",
        "deg": "transform: rotate(180deg);",
        "style": "left:50%;top:89%"
    },
    {
        "id": 7,
        "value": "07",
        "deg": "transform: rotate(210deg);",
        "style": "left:30.5%;top:83.8%"
    },
    {
        "id": 8,
        "value": "08",
        "deg": "transform: rotate(240deg);",
        "style": "left:16.2%;top:69.5%"
    },
    {
        "id": 9,
        "value": "09",
        "deg": "transform: rotate(270deg);",
        "style": "left:11%;top:50%"
    },
    {
        "id": 10,
        "value": "10",
        "deg": "transform: rotate(300deg);",
        "style": "left:16.2%;top:30.5%"
    },
    {
        "id": 11,
        "value": "11",
        "deg": "transform: rotate(330deg);",
        "style": "left:30.5%;top:16.2%"
    }
]

hoursTick.forEach(function(tick, index) {
    tick.click()
    let data = {
        'id': index,
        'value': String(index).padStart(2, '0'),
        deg: `transform: rotate(${index * 30}deg);`,
        style: tick.getAttribute('style'),
    }
    hours_position.push(data)
})
console.log(hours_position);