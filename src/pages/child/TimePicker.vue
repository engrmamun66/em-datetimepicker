<script setup>
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
function handleClick(from=''){
    if(from == 'today'){
        emits('onToday');
    }
    if(from == 'cancel'){
        emits('onCancel');
    }
    if(from == 'apply'){
        emits('onApply');
    }
}

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

</script>

<template>
    <div id="clocklet-inline-container">
        <div class="clocklet-container clocklet-container--inline">
            <div class="clocklet clocklet--inline" data-clocklet-format="HH:mm" data-clocklet-value="14:25">
            <div class="clocklet-plate">
                <div class="clocklet-dial clocklet-dial--minute">
                <div class="clocklet-hand clocklet-hand--minute" style="transform: rotate(150deg);"></div>
                    <button
                        class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="0"
                        style="left:50%;top:11%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="1" style="left:54.8%;top:4.3%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="2"
                    style="left:59.6%;top:5%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="3" style="left:64.2%;top:6.3%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="4"
                    style="left:68.7%;top:8%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="5" style="left:69.5%;top:16.2%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="6"
                    style="left:77%;top:12.8%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="7" style="left:80.8%;top:15.8%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="8"
                    style="left:84.2%;top:19.2%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="9" style="left:87.2%;top:23%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="10"
                    style="left:83.8%;top:30.5%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="11" style="left:92%;top:31.3%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="12"
                    style="left:93.7%;top:35.8%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="13" style="left:95%;top:40.4%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="14"
                    style="left:95.7%;top:45.2%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="15" style="left:89%;top:50%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="16"
                    style="left:95.7%;top:54.8%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="17" style="left:95%;top:59.6%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="18"
                    style="left:93.7%;top:64.2%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="19" style="left:92%;top:68.7%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="20"
                    style="left:83.8%;top:69.5%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="21" style="left:87.2%;top:77%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="22"
                    style="left:84.2%;top:80.8%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="23" style="left:80.8%;top:84.2%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="24"
                    style="left:77%;top:87.2%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute clocklet-tick--selected" type="button"
                    data-clocklet-tick-value="25" style="left:69.5%;top:83.8%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="26"
                    style="left:68.7%;top:92%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="27" style="left:64.2%;top:93.7%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="28"
                    style="left:59.6%;top:95%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="29" style="left:54.8%;top:95.7%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="30"
                    style="left:50%;top:89%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="31" style="left:45.2%;top:95.7%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="32"
                    style="left:40.4%;top:95%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="33" style="left:35.8%;top:93.7%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="34"
                    style="left:31.3%;top:92%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="35" style="left:30.5%;top:83.8%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="36"
                    style="left:23%;top:87.2%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="37" style="left:19.2%;top:84.2%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="38"
                    style="left:15.8%;top:80.8%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="39" style="left:12.8%;top:77%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="40"
                    style="left:16.2%;top:69.5%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="41" style="left:8%;top:68.7%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="42"
                    style="left:6.3%;top:64.2%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="43" style="left:5%;top:59.6%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="44"
                    style="left:4.3%;top:54.8%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="45" style="left:11%;top:50%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="46"
                    style="left:4.3%;top:45.2%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="47" style="left:5%;top:40.4%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="48"
                    style="left:6.3%;top:35.8%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="49" style="left:8%;top:31.3%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="50"
                    style="left:16.2%;top:30.5%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="51" style="left:12.8%;top:23%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="52"
                    style="left:15.8%;top:19.2%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="53" style="left:19.2%;top:15.8%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="54"
                    style="left:23%;top:12.8%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="55" style="left:30.5%;top:16.2%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="56"
                    style="left:31.3%;top:8%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="57" style="left:35.8%;top:6.3%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--minute" type="button" data-clocklet-tick-value="58"
                    style="left:40.4%;top:5%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--minute" type="button"
                    data-clocklet-tick-value="59" style="left:45.2%;top:4.3%"></button>
                </div>
                <div class="clocklet-dial clocklet-dial--hour">
                <div class="clocklet-hand clocklet-hand--hour" style="transform: rotate(60deg);"></div><button
                    class="clocklet-tick clocklet-tick--hour" type="button" data-clocklet-tick-value="0"
                    style="left:50%;top:11%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--hour" type="button"
                    data-clocklet-tick-value="1" style="left:69.5%;top:16.2%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--hour clocklet-tick--selected" type="button" data-clocklet-tick-value="2"
                    style="left:83.8%;top:30.5%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--hour" type="button"
                    data-clocklet-tick-value="3" style="left:89%;top:50%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--hour" type="button" data-clocklet-tick-value="4"
                    style="left:83.8%;top:69.5%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--hour" type="button"
                    data-clocklet-tick-value="5" style="left:69.5%;top:83.8%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--hour" type="button" data-clocklet-tick-value="6"
                    style="left:50%;top:89%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--hour" type="button"
                    data-clocklet-tick-value="7" style="left:30.5%;top:83.8%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--hour" type="button" data-clocklet-tick-value="8"
                    style="left:16.2%;top:69.5%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--hour" type="button"
                    data-clocklet-tick-value="9" style="left:11%;top:50%">
                    </button>
                    <button
                    class="clocklet-tick clocklet-tick--hour" type="button" data-clocklet-tick-value="10"
                    style="left:16.2%;top:30.5%">
                    </button>
                    <button class="clocklet-tick clocklet-tick--hour" type="button"
                    data-clocklet-tick-value="11" style="left:30.5%;top:16.2%"></button>
                </div>
                <div class="clocklet-ampm" data-clocklet-ampm="pm" data-clocklet-ampm-formatted=""></div>
                <div class="clocklet-hand-origin"></div>
            </div>
            </div>
        </div><input data-clocklet="format:HH:mm" data-clocklet-inline="" style="display: none;">
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
    border-radius: 3px
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