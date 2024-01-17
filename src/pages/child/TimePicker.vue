<script setup>
import Switcher from './SwitcherForTime.vue';
import { ref, computed, reactive, defineProps, onMounted, inject, defineEmits } from 'vue';
let { defaults, applyBtn } = defineProps({
    defaults: { 
        required: false,
        default: {},
    },
    applyBtn: { 
        required: false,
        default: true,        
    },
});
let emits = defineEmits(['onCancel', 'onApply', 'onToday']);
let ampm = ref('am')
let selectedHour = ref({
        "id": 12,
        "value": "12",
        "deg": "transform: rotate(0deg);",
        "style": "left:50%;top:11%"
    })
let selectedMinute = ref({
        "id": 0,
        "value": "00",
        "deg": "transform: rotate(0deg);",
        "style": "left:50%;top:11%"
    })

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
let minutes_position = [
    {
        "id": 0,
        "value": "00",
        "deg": "transform: rotate(0deg);",
        "style": "left:50%;top:11%"
    },
    {
        "id": 1,
        "value": "01",
        "deg": "transform: rotate(6deg);",
        "style": "left:54.8%;top:4.3%"
    },
    {
        "id": 2,
        "value": "02",
        "deg": "transform: rotate(12deg);",
        "style": "left:59.6%;top:5%"
    },
    {
        "id": 3,
        "value": "03",
        "deg": "transform: rotate(18deg);",
        "style": "left:64.2%;top:6.3%"
    },
    {
        "id": 4,
        "value": "04",
        "deg": "transform: rotate(24deg);",
        "style": "left:68.7%;top:8%"
    },
    {
        "id": 5,
        "value": "05",
        "deg": "transform: rotate(30deg);",
        "style": "left:69.5%;top:16.2%"
    },
    {
        "id": 6,
        "value": "06",
        "deg": "transform: rotate(36deg);",
        "style": "left:77%;top:12.8%"
    },
    {
        "id": 7,
        "value": "07",
        "deg": "transform: rotate(42deg);",
        "style": "left:80.8%;top:15.8%"
    },
    {
        "id": 8,
        "value": "08",
        "deg": "transform: rotate(48deg);",
        "style": "left:84.2%;top:19.2%"
    },
    {
        "id": 9,
        "value": "09",
        "deg": "transform: rotate(54deg);",
        "style": "left:87.2%;top:23%"
    },
    {
        "id": 10,
        "value": "10",
        "deg": "transform: rotate(60deg);",
        "style": "left:83.8%;top:30.5%"
    },
    {
        "id": 11,
        "value": "11",
        "deg": "transform: rotate(66deg);",
        "style": "left:92%;top:31.3%"
    },
    {
        "id": 12,
        "value": "12",
        "deg": "transform: rotate(72deg);",
        "style": "left:93.7%;top:35.8%"
    },
    {
        "id": 13,
        "value": "13",
        "deg": "transform: rotate(78deg);",
        "style": "left:95%;top:40.4%"
    },
    {
        "id": 14,
        "value": "14",
        "deg": "transform: rotate(84deg);",
        "style": "left:95.7%;top:45.2%"
    },
    {
        "id": 15,
        "value": "15",
        "deg": "transform: rotate(90deg);",
        "style": "left:89%;top:50%"
    },
    {
        "id": 16,
        "value": "16",
        "deg": "transform: rotate(96deg);",
        "style": "left:95.7%;top:54.8%"
    },
    {
        "id": 17,
        "value": "17",
        "deg": "transform: rotate(102deg);",
        "style": "left:95%;top:59.6%"
    },
    {
        "id": 18,
        "value": "18",
        "deg": "transform: rotate(108deg);",
        "style": "left:93.7%;top:64.2%"
    },
    {
        "id": 19,
        "value": "19",
        "deg": "transform: rotate(114deg);",
        "style": "left:92%;top:68.7%"
    },
    {
        "id": 20,
        "value": "20",
        "deg": "transform: rotate(120deg);",
        "style": "left:83.8%;top:69.5%"
    },
    {
        "id": 21,
        "value": "21",
        "deg": "transform: rotate(126deg);",
        "style": "left:87.2%;top:77%"
    },
    {
        "id": 22,
        "value": "22",
        "deg": "transform: rotate(132deg);",
        "style": "left:84.2%;top:80.8%"
    },
    {
        "id": 23,
        "value": "23",
        "deg": "transform: rotate(138deg);",
        "style": "left:80.8%;top:84.2%"
    },
    {
        "id": 24,
        "value": "24",
        "deg": "transform: rotate(144deg);",
        "style": "left:77%;top:87.2%"
    },
    {
        "id": 25,
        "value": "25",
        "deg": "transform: rotate(150deg);",
        "style": "left:69.5%;top:83.8%"
    },
    {
        "id": 26,
        "value": "26",
        "deg": "transform: rotate(156deg);",
        "style": "left:68.7%;top:92%"
    },
    {
        "id": 27,
        "value": "27",
        "deg": "transform: rotate(162deg);",
        "style": "left:64.2%;top:93.7%"
    },
    {
        "id": 28,
        "value": "28",
        "deg": "transform: rotate(168deg);",
        "style": "left:59.6%;top:95%"
    },
    {
        "id": 29,
        "value": "29",
        "deg": "transform: rotate(174deg);",
        "style": "left:54.8%;top:95.7%"
    },
    {
        "id": 30,
        "value": "30",
        "deg": "transform: rotate(180deg);",
        "style": "left:50%;top:89%"
    },
    {
        "id": 31,
        "value": "31",
        "deg": "transform: rotate(186deg);",
        "style": "left:45.2%;top:95.7%"
    },
    {
        "id": 32,
        "value": "32",
        "deg": "transform: rotate(192deg);",
        "style": "left:40.4%;top:95%"
    },
    {
        "id": 33,
        "value": "33",
        "deg": "transform: rotate(198deg);",
        "style": "left:35.8%;top:93.7%"
    },
    {
        "id": 34,
        "value": "34",
        "deg": "transform: rotate(204deg);",
        "style": "left:31.3%;top:92%"
    },
    {
        "id": 35,
        "value": "35",
        "deg": "transform: rotate(210deg);",
        "style": "left:30.5%;top:83.8%"
    },
    {
        "id": 36,
        "value": "36",
        "deg": "transform: rotate(216deg);",
        "style": "left:23%;top:87.2%"
    },
    {
        "id": 37,
        "value": "37",
        "deg": "transform: rotate(222deg);",
        "style": "left:19.2%;top:84.2%"
    },
    {
        "id": 38,
        "value": "38",
        "deg": "transform: rotate(228deg);",
        "style": "left:15.8%;top:80.8%"
    },
    {
        "id": 39,
        "value": "39",
        "deg": "transform: rotate(234deg);",
        "style": "left:12.8%;top:77%"
    },
    {
        "id": 40,
        "value": "40",
        "deg": "transform: rotate(240deg);",
        "style": "left:16.2%;top:69.5%"
    },
    {
        "id": 41,
        "value": "41",
        "deg": "transform: rotate(246deg);",
        "style": "left:8%;top:68.7%"
    },
    {
        "id": 42,
        "value": "42",
        "deg": "transform: rotate(252deg);",
        "style": "left:6.3%;top:64.2%"
    },
    {
        "id": 43,
        "value": "43",
        "deg": "transform: rotate(258deg);",
        "style": "left:5%;top:59.6%"
    },
    {
        "id": 44,
        "value": "44",
        "deg": "transform: rotate(264deg);",
        "style": "left:4.3%;top:54.8%"
    },
    {
        "id": 45,
        "value": "45",
        "deg": "transform: rotate(270deg);",
        "style": "left:11%;top:50%"
    },
    {
        "id": 46,
        "value": "46",
        "deg": "transform: rotate(276deg);",
        "style": "left:4.3%;top:45.2%"
    },
    {
        "id": 47,
        "value": "47",
        "deg": "transform: rotate(282deg);",
        "style": "left:5%;top:40.4%"
    },
    {
        "id": 48,
        "value": "48",
        "deg": "transform: rotate(288deg);",
        "style": "left:6.3%;top:35.8%"
    },
    {
        "id": 49,
        "value": "49",
        "deg": "transform: rotate(294deg);",
        "style": "left:8%;top:31.3%"
    },
    {
        "id": 50,
        "value": "50",
        "deg": "transform: rotate(300deg);",
        "style": "left:16.2%;top:30.5%"
    },
    {
        "id": 51,
        "value": "51",
        "deg": "transform: rotate(306deg);",
        "style": "left:12.8%;top:23%"
    },
    {
        "id": 52,
        "value": "52",
        "deg": "transform: rotate(312deg);",
        "style": "left:15.8%;top:19.2%"
    },
    {
        "id": 53,
        "value": "53",
        "deg": "transform: rotate(318deg);",
        "style": "left:19.2%;top:15.8%"
    },
    {
        "id": 54,
        "value": "54",
        "deg": "transform: rotate(324deg);",
        "style": "left:23%;top:12.8%"
    },
    {
        "id": 55,
        "value": "55",
        "deg": "transform: rotate(330deg);",
        "style": "left:30.5%;top:16.2%"
    },
    {
        "id": 56,
        "value": "56",
        "deg": "transform: rotate(336deg);",
        "style": "left:31.3%;top:8%"
    },
    {
        "id": 57,
        "value": "57",
        "deg": "transform: rotate(342deg);",
        "style": "left:35.8%;top:6.3%"
    },
    {
        "id": 58,
        "value": "58",
        "deg": "transform: rotate(348deg);",
        "style": "left:40.4%;top:5%"
    },
    {
        "id": 59,
        "value": "59",
        "deg": "transform: rotate(354deg);",
        "style": "left:45.2%;top:4.3%"
    }
]

</script>

<template>
    <div id="clocklet-inline-container">
        <div class="clocklet-container clocklet-container--inline">
            <div class="clocklet clocklet--inline" data-clocklet-format="HH:mm" data-clocklet-value="14:25">
                <div class="clocklet-plate">
                    <!-- Minute Picker -->
                    <div class="clocklet-dial clocklet-dial--minute">
                        <div class="clocklet-hand clocklet-hand--minute" :style="selectedMinute.deg"></div>
                        <template v-for="(minute, index) in minutes_position" :key="index">
                            <button
                            :style="minute.style"
                            class="clocklet-tick clocklet-tick--minute"
                            :class="{'clocklet-tick--selected' : selectedMinute.value == minute.value}" 
                            type="button" 
                            :data-clocklet-tick-value="minute.id"
                            @click.stop="selectedMinute = minute"
                            >
                            </button>                        
                        </template>                        
                    </div>

                    <!-- Hour Picker -->
                    <div class="clocklet-dial clocklet-dial--hour">
                        <div class="clocklet-hand clocklet-hand--hour" :style="selectedHour.deg"></div>
                        <template v-for="(hour, index) in hours_position" :key="index">
                            <button 
                            type="button" 
                            :style="hour.style"
                            class="clocklet-tick clocklet-tick--hour"
                            :class="{'clocklet-tick--selected' : selectedHour.value == hour.value}" 
                            @click.stop="selectedHour = hour"
                            :data-clocklet-tick-value="hour.id"
                            >
                            </button>
                        </template>                   
                    </div>
                    <div class="clocklet-ampm" :data-clocklet-ampm="ampm" @click.stop="ampm=='am' ? ampm='pm' : ampm='am'" data-clocklet-ampm-formatted=""></div>
                    <div class="clocklet-hand-origin"></div>
                </div>
            </div>
            <Switcher></Switcher>
        </div>
    </div>
</template>

<style scoped>
.clocklet,
.clocklet-ampm,
.clocklet-container,
.clocklet-dial,
.clocklet-hand,
.clocklet-hand-origin,
.clocklet-plate,
.clocklet-tick {
    touch-action: manipulation;
    touch-action: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;
    position: absolute;
    font-size: inherit
}

.clocklet--inline,
.clocklet-container--inline {
    position: static
}

.clocklet-container {
    display: inline;
    width: 0;
    height: 0
}

.clocklet {
    font-size: 16px;
    width: 270px;
    height: 270px;
    margin-top: 1px;
    padding: 8px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
}

.clocklet:not(.clocklet--showing) {
    transition: opacity .2s ease-out
}

.clocklet:not(.clocklet--shown):not(.clocklet--inline) {
    opacity: 0;
    pointer-events: none
}

[data-clocklet-placement=bottom][data-clocklet-alignment=left] {
    transform-origin: 0 0
}

[data-clocklet-placement=bottom][data-clocklet-alignment=right] {
    transform-origin: 100% 0
}

[data-clocklet-placement=top][data-clocklet-alignment=left] {
    transform-origin: 0 100%
}

[data-clocklet-placement=top][data-clocklet-alignment=right] {
    transform-origin: 100% 100%
}

.clocklet-plate {
    position: relative;
    height: 100%;
    border-radius: 50%
}

.clocklet-dial {
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 50%
}

.clocklet-ampm:before,
.clocklet-hand,
.clocklet-hand-origin,
.clocklet-tick {
    z-index: 1
}

.clocklet-hand {
    left: 0;
    top: 6.4%;
    right: 0;
    bottom: 50%;
    margin: auto;
    transform-origin: 50% 100%
}

.clocklet-tick {
    width: 1.75em;
    height: 1.75em;
    margin: -.875em;
    border-radius: 50%;
    padding: 0;
    outline: 0;
    border: 0;
    cursor: pointer;
    background-color: transparent;
    color: inherit;
    font-family: inherit;
    font-weight: inherit
}

.clocklet-tick:before {
    content: attr(data-clocklet-tick-value)
}

.clocklet-ampm {
    top: calc(50% + .75em);
    left: 0;
    right: 0;
    margin: auto;
    width: 3em;
    height: 1.5em;
    border-radius: .75em;
    cursor: pointer
}

.clocklet-ampm,
.clocklet-ampm:before {
    display: flex;
    align-items: center;
    justify-content: center
}

.clocklet-ampm:before {
    position: relative;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    content: attr(data-clocklet-ampm);
    transform: translateX(-1em)
}

.clocklet--shown .clocklet-ampm:before {
    transition: transform .1s ease-out
}

.clocklet-ampm[data-clocklet-ampm=pm]:before {
    transform: translateX(1em)
}

.clocklet-ampm[data-clocklet-ampm-formatted]:not([data-clocklet-ampm-formatted=""]):before {
    content: attr(data-clocklet-ampm-formatted)
}

.clocklet-hand-origin {
    left: calc(50% - 5px);
    top: calc(50% - 5px);
    right: calc(50% - 5px);
    bottom: calc(50% - 5px);
    border-radius: 50%
}

.clocklet:not([data-clocklet-value]) .clocklet-hand,
.clocklet:not([data-clocklet-value]) .clocklet-hand-origin,
.clocklet[data-clocklet-value=""] .clocklet-hand,
.clocklet[data-clocklet-value=""] .clocklet-hand-origin {
    display: none
}

.clocklet-dial--hour {
    width: calc(40% + 56px);
    height: calc(40% + 56px)
}

.clocklet-hand--hour {
    width: 8px
}

.clocklet-tick--hour[data-clocklet-tick-value="0"]:before {
    content: "12"
}

.clocklet-dial--minute {
    width: 100%;
    height: 100%
}

.clocklet-hand--minute {
    width: 2px
}

.clocklet-tick--minute:not([data-clocklet-tick-value$="0"]):not([data-clocklet-tick-value$="5"]) {
    transform: scale(.6)
}

@media screen and (max-width:480px) {
    .clocklet {
        transform: scale(.8)
    }
}

@media screen and (max-width:400px) {
    .clocklet {
        transform: scale(.75)
    }
}

.clocklet {
    border: 1px solid #ddd;
    background-color: #eee
}

[data-clocklet-placement=top] {
    box-shadow: 4px -4px 4px hsla(0, 0%, 50.2%, .5)
}

[data-clocklet-placement=bottom] {
    box-shadow: 4px 4px 4px hsla(0, 0%, 50.2%, .5)
}

.clocklet-plate {
    background-color: #fff
}

.clocklet-hand {
    background-color: #a1ddff
}

.clocklet-hand-origin {
    background-color: #4bf
}

.clocklet-tick--selected {
    background-color: #57c2ff;
    color: #fff
}

.clocklet--hoverable:not(.clocklet--dragging) .clocklet-tick:hover {
    background-color: #7ccfff
}

.clocklet-ampm {
    background-color: hsla(0, 0%, 80%, .6)
}

.clocklet-ampm:before {
    background-color: #57c2ff;
    color: #fff
}

.clocklet-ampm:hover:before {
    background-color: #7ccfff
}
</style>