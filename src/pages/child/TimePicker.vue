<script setup>
import moment, { min } from 'moment/moment';
import SwitcherForTime from './SwitcherForTime.vue';
import { hours_position, minutes_position } from './timePicker';
import { ref, computed, reactive, defineProps, onMounted, inject, defineEmits, watch, watchEffect, provide } from 'vue';
let { justInitializeValue } = defineProps(['justInitializeValue']);
let isMounted = inject('isMounted');
let target = inject('target');
let defaults = inject('defaults');
let FORMATS = inject('FORMATS');
let picker = inject('picker');
let pickerValues = inject('pickerValues');
let createEvent = inject('createEvent');
let openTimePicker = inject('openTimePicker');

function makeStepRange(step) {    
    let limit = Math.floor(60 / step)
    let start = 0
    let end = start + limit;
    let rangeArray = Array.from({ length: end + start  }, (_, index) => (start + index) * step);
    return rangeArray;    
}
let steps = ref([]);
minutes_position.forEach( minute => {   
    let  { minuteStep } = defaults;    
    if(minuteStep){
        steps.value = makeStepRange(minuteStep);  
        if(steps.value?.length){
            if(steps.value?.includes(minute.id)){
                minute.excluded = false;
            } else {
                minute.excluded = true;
            }
        }        
    }    
})



let emits = defineEmits(['init', 'cancel', 'apply', 'change']);
// mode
let time1_mode = ref('am');
let time2_mode = ref('am');
let mode = computed({
    get: () => {
        if(selectingStartTime.value){
            return time1_mode.value;
        }else{
            return time2_mode.value;
        }
    },
    set: (modename) => {
        if(selectingStartTime.value){
            time1_mode.value = modename;
        }else{
            time2_mode.value = modename;
        }
    },
});
let selectingStartTime = ref(true);
provide('selectingStartTime', selectingStartTime);
// Time1
let time1_selectedHour = ref(hours_position[0]);
let time1_selectedMinute = ref(minutes_position[0]);

// Time2
let time2_selectedHour = ref(hours_position[0]);
let time2_selectedMinute = ref(minutes_position[0]);
let selectedHour = computed({
    get: () => {
        if(selectingStartTime.value){
            return time1_selectedHour.value;
        }else{
            return time2_selectedHour.value;
        }
    },
    set: (hourObject) => {
        if(selectingStartTime.value){
            time1_selectedHour.value = hourObject;
        }else{
            time2_selectedHour.value = hourObject;
        }
    },    
})
let selectedMinute = computed({
    get: () => {
        if(selectingStartTime.value){
            return time1_selectedMinute.value;
        }else{
            return time2_selectedMinute.value;
        }
    },
    set: (minuteObject) => {
        if(selectingStartTime.value){
            time1_selectedMinute.value = minuteObject;
        }else{
            time2_selectedMinute.value = minuteObject;
        }
    },
})
let centerOfclick = ref(null);

function latestHourAndMinute(){
    let { value: { id: hour1 } } = time1_selectedHour;
    let { value: { id: hour2 } } = time2_selectedHour;

    let { value: {id: minute1} } = time1_selectedMinute;
    let { value: {id: minute2} } = time2_selectedMinute;

    return {
        time1: {
            hour: +hour1 + (time1_mode.value=='pm' ? 12 : 0),
            minute: minute1,
            mode: time1_mode.value,
        },
        time2: {
            hour: +hour2 + (time2_mode.value=='pm' ? 12 : 0),
            minute: minute2,
            mode: time2_mode.value,
        },
    };
}

function onClickClose(){
    emits('close', false);
    target.dispatchEvent(createEvent('timepicker:close', false));    
}

function onClickOk(){
    let time1_text = getPrintableTime(time1_selectedHour.value, time1_selectedMinute.value, time1_mode.value);
    let time2_text = getPrintableTime(time2_selectedHour.value, time2_selectedMinute.value, time2_mode.value);
    let data = {
        startTime: time1_text,
        endTime: time2_text,
    }
    let latest = latestHourAndMinute();
    picker.time1 = {...latest.time1, time: time1_text};
    picker.time2 = {...latest.time2, time: time2_text};

    pickerValues.startTime = data.startTime;
    pickerValues.endTime = data.endTime;
    
    emits('change', data);    
}


watch(time1_selectedHour, (newValue, oldValue)=>{
    if(!defaults.rangePicker){
        time2_selectedHour.value = newValue;
    }
    if(defaults.endTimeAutoValid){
        setTimeout(() => {
            if(!isEqualOrGraterTime2()){
                time2_selectedHour.value = time1_selectedHour.value;
                time2_selectedMinute.value = time1_selectedMinute.value;
            }
        }, 100);
    }

})
watch(time1_selectedMinute, (newValue, oldValue)=>{
    if(!defaults.rangePicker){       
        time2_selectedMinute.value = newValue;        
    }
    if(defaults.endTimeAutoValid){
        setTimeout(() => {
            if(!isEqualOrGraterTime2()){
                time2_selectedHour.value = time1_selectedHour.value;
                time2_selectedMinute.value = time1_selectedMinute.value;
            }
        }, 100);
    }
})

function getPrintableTime(hourObject, minuteObject, time_mode) {
    let {value: hour} = hourObject;
    let {value: minute} = minuteObject;
    let date = new Date();
    date.setHours(Number(hour) + (time_mode=='pm' ? 12 : 0));
    date.setMinutes(Number(minute));
    return makeDate(date, FORMATS.time);
}

function getHoursAndMinutes() {
    let {id: hour1} = time1_selectedHour.value;
    let {id: minute1} = time1_selectedMinute.value;
    let mode1 = mode1.value;
    if(mode1 == 'pm') hour1 += 12;

    let {id: hour2} = time2_selectedHour.value;
    let {id: minute2} = time2_selectedMinute.value;
    let mode2 = mode2.value;
    if(mode2 == 'pm') hour2 += 12;
    
    return {hour1, minute1, hour2, minute2, mode1, mode2};    
}

function pad2(val){
    return String(val).padStart(2, '0');
}

function isEqualOrGraterTime2() {
    let {time1, time2} = latestHourAndMinute();
    let dateTime_1 = makeDate(new Date(), FORMATS.date) + ` ${pad2(time1.hour)}:${pad2(time1.minute)}`;
    let dateTime_2 = makeDate(new Date(), FORMATS.date) + ` ${pad2(time2.hour)}:${pad2(time2.minute)}`;

    console.log(dateTime_1 , dateTime_2);    
    console.log(new Date(dateTime_1) <= new Date(dateTime_2));    
}



function getCenterOfCircle() {
    if(!centerOfclick.value) return false;
    let circle = centerOfclick.value;
    let circleRect = circle.getBoundingClientRect();
    let centerX = circleRect.left + circleRect.width / 2;
    let centerY = circleRect.top + circleRect.height / 2;
    return { centerX, centerY };
}

function setByDegree(event) {
    let center = getCenterOfCircle();
    if(!center) return;
    let { centerX, centerY } = center;
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Calculate the angle using Math.atan2
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    let angle = Math.atan2(deltaY, deltaX);
    angle = (angle * 180) / Math.PI;   
    if (angle < 0) {
        angle += 360;
    }
    let degree = (angle / 30) - (angle % 30);
    console.log(Math.floor(angle)-280,  Math.floor(degree));
}

let move = reactive({
    dragging: false,
})


onMounted(() => { 
    if(defaults.onlyTimePicker){
        picker.date1 = makeDate(new Date(), FORMATS.date);
        picker.date2 = makeDate(new Date(), FORMATS.date);
    }

    let dateTime1 = makeDate(picker.date1, 'hh:mm A');
    let dateTime2 = makeDate(picker.date1, 'hh:mm A');
    let [hour1, minute1] = dateTime1?.split(':');
    let [hour2, minute2] = dateTime2?.split(':');  
    time1_mode.value = minute1.split(' ')[1]?.toLocaleLowerCase(); // am / pm
    time2_mode.value = minute2.split(' ')[1]?.toLocaleLowerCase(); // am / pm

    minute1 = minute1.split(' ')[0];
    minute2 = minute2.split(' ')[0];
    minute1 = minute1 == 12 ? 0 : minute1;
    minute2 = minute2 == 12 ? 0 : minute2; 

    time1_selectedHour.value = hours_position?.filter(h => h.value == hour1)?.[0] || hours_position[0];
    time2_selectedHour.value = hours_position?.filter(h => h.value == hour2)?.[0] || (time1_selectedHour.value || hours_position[0]);

    time1_selectedMinute.value = minutes_position?.filter(m => m.value == minute1)?.[0] || minutes_position[0];
    time2_selectedMinute.value = minutes_position?.filter(m => m.value == minute2)?.[0] || (time1_selectedMinute.value || minutes_position[0]);

    // console.log(time1_selectedHour.value, time2_selectedHour.value);
})

</script>

<template>
    <template v-if="!justInitializeValue">
        <div @click.stop="false" id="clocklet-inline-container" style="width:270px">
            <div class="clocklet-container clocklet-container--inline" style="position:relative">  
                <div @click.stop="onClickClose" class="closeIcon"><i class='bx bx-x' ></i></div>     
                <div @click.stop="onClickOk" class="okIcon"><i class='bx bx-check'></i></div>     

                <div class="clocklet clocklet--inline" data-clocklet-format="HH:mm" data-clocklet-value="14:25">
                    <div class="clocklet-plate">
                        <!-- Minute Picker -->
                        <div class="clocklet-dial clocklet-dial--minute">
                            <div class="clocklet-hand clocklet-hand--minute" :style="selectedMinute.deg"></div>
                            <template v-for="(minute, index) in minutes_position" :key="index">
                                <button
                                :style="minute.style"
                                class="clocklet-tick clocklet-tick--minute"
                                :class="{
                                    'excluded' : minute.excluded,
                                    'clocklet-tick--selected' : selectedMinute.value == minute.value,
                                }" 
                                type="button" 
                                :data-clocklet-tick-value="minute.id"
                                @click.stop="selectedMinute = minute"
                                draggable="true"
                                @dragenter="selectedMinute = minute"
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
                                draggable="true"
                                @dragstart="move.dragging = true"
                                @dragenter="/*selectedHour = hour*/ false"
                                @drag="false"
                                @dragend="move.dragging = false"
                                >
                                </button>
                            </template>                   
                        </div>
                        <div class="clocklet-ampm" :data-clocklet-ampm="mode" @click.stop="mode=='am' ? mode='pm' : mode='am'" data-clocklet-ampm-formatted=""></div>
                        <div ref="centerOfclick" class="clocklet-hand-origin"></div>
                    </div>
                </div>

                <div class="display-time">
                    <span class="start-time">{{ getPrintableTime(time1_selectedHour, time1_selectedMinute, time1_mode) }}</span>
                    <template v-if="defaults.rangePicker">
                        <div>&nbsp;</div>
                        <span class="end-time">{{ getPrintableTime(time2_selectedHour, time2_selectedMinute, time2_mode) }}</span>
                    </template>
                </div>

                <template v-if="defaults.rangePicker && defaults.timePicker">
                    <SwitcherForTime></SwitcherForTime>
                </template>
                
            </div>
        </div>
    </template>
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
    height: 0;
    box-shadow: 0px 8px 32px rgba(0, 0, 0, .16);
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
    transform: translateX(1em);
    font-size: 13px;
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
    color: #fff;
    font-size: 13px;
}

.clocklet-ampm:hover:before {
    background-color: #7ccfff
}


/* -------------------------------------------------------------------------- */
/*                             Start Modification                             */
/* -------------------------------------------------------------------------- */
.excluded{
    pointer-events: none  !important;
    visibility: hidden !important;
}
.display-time{
    width: 100%;
    padding: 8px;
    border: transparent;    
    background: #eeeeee;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.display-time span{
    font-size: 20px;
    color: #666;  
}
.display-time div{
    width: 2px;
    height: 100%;
    background-color: #e4e4e4;   
}

.pick-the-time{
    width: 100%;
    text-align: center;
    padding: 8px;
    border: transparent;
    background: #e2e2e2;
    color: #444;
    text-transform: capitalize;
}
.closeIcon,
.okIcon{
    position: absolute;
    top: 230px;
    z-index: 999999;
    padding: 5px;
    cursor: pointer;
    
}
.closeIcon i,
.okIcon i{
    font-size: 26px;
    color: #777;
    background-color: #ececec;
    border-radius: 4px;
    box-shadow: 0 0 22px #fff;
}
.closeIcon{
    left: 10px;
}
.okIcon{
    right: 10px;
}
</style>