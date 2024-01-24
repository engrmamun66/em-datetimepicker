<script setup>
import moment, { min } from 'moment/moment';
import SwitcherForTime from './SwitcherForTime.vue';
import { hours_position, hours_position24, minutes_position } from './timePicker';
import { ref, computed, reactive, defineProps, onMounted, inject, defineEmits, watch, watchEffect, provide } from 'vue';
let { justInitializeValue } = defineProps(['justInitializeValue']);
let isMounted = inject('isMounted');
let theme = inject('theme');
const modelValue = inject('modelValue');
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
let ui2 = reactive({
    expand: null, // null | hours | minutes
    incrHour: function(){
        let hour = selectedHour.value; 
        let using24Format = defaults.use24Format;
        let hours__positions = using24Format ? hours_position24 : hours_position
        let index = hours__positions.findIndex(item => item.id == hour.id);
        index = index + 1;
        if(index > (using24Format ? 23 : 11)) index = 0;
        selectedHour.value = hours__positions[index];
    
    },
    decrHour: function(){
        let hour = selectedHour.value;    
        let using24Format = defaults.use24Format;
        let hours__positions = using24Format ? hours_position24 : hours_position
        let index = hours__positions.findIndex(item => item.id == hour.id);
        index = index - 1;
        if(index < 0) index = (using24Format ? 23 : 11);
        selectedHour.value = hours__positions[index];              
    },
    incrMinute: function(){
        let {id, value} = selectedMinute.value; 
        let indexInSteps = steps.value.findIndex(m => m==value);
        let rightPartOfSteps = steps.value.slice(indexInSteps);
        let next_minute = rightPartOfSteps?.[1] || steps.value[0];
        let index = minutes_position.findIndex(m => m.id == next_minute);           
        selectedMinute.value = minutes_position[index];
    },
    decrMinute: function(){
        let {id, value} = selectedMinute.value; 
        let indexInSteps = steps.value.findIndex(m => m==value);
        let leftPartOfSteps = steps.value.slice(0, indexInSteps);
        let next_minute = leftPartOfSteps?.[leftPartOfSteps.length - 1] || steps.value[steps.value?.length - 1];
        let index = minutes_position.findIndex(m => m.id == next_minute);           
        selectedMinute.value = minutes_position[index];     
    },
});


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

function getPrintableTime(hourObject, minuteObject, time_mode) {
    let {value: hour} = hourObject;
    let {value: minute} = minuteObject;
    hour = Number(hour) + (time_mode=='pm' ? 12 : 0);  
    let date_text = makeDate( new Date(), FORMATS.time, {hour, minute});
    return date_text;
}


function onClickOk(emit_name='change'){
    let time1_text = getPrintableTime(time1_selectedHour.value, time1_selectedMinute.value, time1_mode.value);
    let time2_text = getPrintableTime(time2_selectedHour.value, time2_selectedMinute.value, time2_mode.value);
    let data = {
        startTime: time1_text,
        endTime: time2_text,
        do_not_hide: defaults.timePickerButtons === false,
    }
    let latest = latestHourAndMinute();
    picker.time1 = {...latest.time1, time: time1_text};
    picker.time2 = {...latest.time2, time: time2_text};

    pickerValues.startTime = data.startTime;
    pickerValues.endTime = data.endTime;
    
    emits(emit_name, data);    
}



watch(time1_selectedHour, (newValue, oldValue)=>{
    if(!defaults.rangePicker){
        time2_selectedHour.value = newValue;
    }
    if(defaults.endTimeAutoValid){
        setTimeout(() => {
            if(!isEqualOrGraterTime2()){
                time2_mode.value = time1_mode.value;
                time2_selectedHour.value = time1_selectedHour.value;
                time2_selectedMinute.value = time1_selectedMinute.value;
            }
        }, 50);
    }

})
watch(time1_selectedMinute, (newValue, oldValue)=>{
    if(!defaults.rangePicker){       
        time2_selectedMinute.value = newValue;        
    }
    if(defaults.endTimeAutoValid){
        setTimeout(() => {
            if(!isEqualOrGraterTime2()){
                time2_mode.value = time1_mode.value;
                time2_selectedHour.value = time1_selectedHour.value;
                time2_selectedMinute.value = time1_selectedMinute.value;
            }
        }, 50);
    }
})
watch(time1_mode, (newValue, oldValue)=>{
    if(defaults.endTimeAutoValid){
        setTimeout(() => {
            if(!isEqualOrGraterTime2()){
                time2_mode.value = time1_mode.value;
                time2_selectedHour.value = time1_selectedHour.value;
                time2_selectedMinute.value = time1_selectedMinute.value;
            }
        }, 50);
    }
})
/* -------------------------------------------------------------------------- */
/*                      Auto Emit Without OK button click                     */
/* -------------------------------------------------------------------------- */
watch(selectedHour, (newValue, oldValue)=>{
    setTimeout(() => {
        if(!defaults.timePickerButtons){
            onClickOk();
        }
    }, 100);    
})
watch(selectedMinute, (newValue, oldValue)=>{
    setTimeout(() => {
        if(!defaults.timePickerButtons){
            onClickOk();
        }
    }, 100);    
})
watch(mode, (newValue, oldValue)=>{
    setTimeout(() => {
        if(!defaults.timePickerButtons){
            onClickOk();
        }
    }, 100);    
})

function getHoursAndMinutes() {
    let {id: hour1} = time1_selectedHour.value;
    let {id: minute1} = time1_selectedMinute.value;
    let mode1 = time1_mode.value;
    if(mode1 == 'pm') hour1 += 12;

    let {id: hour2} = time2_selectedHour.value;
    let {id: minute2} = time2_selectedMinute.value;
    let mode2 = time2_mode.value;
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
    return new Date(dateTime_1) <= new Date(dateTime_2);   
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
}

let move = reactive({
    dragging: false,
})


onMounted(() => { 
    if(defaults.onlyTimePicker){
        picker.date1 = makeDate(new Date(), FORMATS.date);
        picker.date2 = makeDate(new Date(), FORMATS.date);
    }

    let dateTime1 = (picker?.time1.time || makeDate(picker.date1, 'hh:mm A'));
    let dateTime2 = (picker?.time2.time || makeDate(picker.date1, 'hh:mm A'));
    let [hour1, minute1] = modelValue?.startTime ?? dateTime1?.split(':');
    let [hour2, minute2] = modelValue?.endTime ?? dateTime2?.split(':');  
    time1_mode.value = minute1.split(' ')[1]?.toLocaleLowerCase(); // am / pm
    time2_mode.value = minute2.split(' ')[1]?.toLocaleLowerCase(); // am / pm

    minute1 = minute1.split(' ')[0];
    minute2 = minute2.split(' ')[0];
    minute1 = minute1 == 12 ? 0 : minute1;
    minute2 = minute2 == 12 ? 0 : minute2; 

    let __hours_position = (defaults.use24Format) ? hours_position24 : hours_position;


    time1_selectedHour.value = __hours_position?.filter(h => h.value == hour1)?.[0] || __hours_position[0];
    time2_selectedHour.value = __hours_position?.filter(h => h.value == hour2)?.[0] || (time1_selectedHour.value || __hours_position[0]);

    time1_selectedMinute.value = minutes_position?.filter(m => m.value == minute1)?.[0] || minutes_position[0];
    time2_selectedMinute.value = minutes_position?.filter(m => m.value == minute2)?.[0] || (time1_selectedMinute.value || minutes_position[0]);
    if(!isMounted.value){
        onClickOk('init');
        isMounted.value = true;
    }
})

const {
    body_bg: color_body_bg,
    primary_bg: color_primary_bg,
    bg_grey: color_bg_grey,
    font_dark: color_font_dark,
    font_dark_low: color_font_dark_low,
    font_light: color_font_light,
} = defaults.colors
const color_transparent_1 = color_primary_bg + '3d';
const color_transparent_2 = color_primary_bg + '1c';
let maxHeight = (defaults.timePickerButtons || defaults.timePickerUi == 'classic') ? '270px' : '210px';
const area_radius = defaults.rangePicker ? '6px 6px 0px 0px' : '6px';
const gird_template_repeat = defaults.use24Format ? 'repeat(2,1fr)' : 'repeat(3,1fr)';
</script>

<template>
    <div @click.stop="false" style="width:270px" :class="{[`em-theme-${theme}`]: true}">
        <div class="clocklet-container clocklet-container--inline" style="position:relative">  

            <template v-if="defaults.timePickerUi == 'standard'">

                <template v-if="defaults.timePickerButtons">
                    <template v-if="ui2.expand == null">
                        <div @click.stop="onClickClose()" class="closeIcon"><i class='bx bx-x' ></i></div>     
                        <div @click.stop="onClickOk()" class="okIcon"><i class='bx bx-check'></i></div> 
                    </template>    
                    <template v-else>
                        <div @click.stop="ui2.expand = null" class="backIcon"><i class='bx bx-chevron-left'></i></div> 
                    </template>    
                </template>    

                <div class="clocklet clocklet--inline">
                    <div class="clocklet-plate standard" :class="{ 
                        'need-scroll': defaults.timePickerButtons ? (defaults.minuteStep < 3 && ui2.expand != null) : (ui2.expand != null),
                        }" >

                        <div v-if="ui2.expand == null" class="columns fade-in">
                            <div class="column">
                                <div @click.stop="ui2.incrHour()"> <i class='bx bx-chevron-up'></i> </div>
                                <button @click.stop="ui2.expand = 'hours'">
                                    {{ pad2(selectedHour?.id) }}
                                </button>
                                <div @click.stop="ui2.decrHour()"> <i class='bx bx-chevron-down'></i> </div>
                            </div>
                            <div class="column">
                                <div @click.stop="ui2.incrMinute()"> <i class='bx bx-chevron-up'></i> </div>
                                <button @click.stop="ui2.expand = 'minutes'">
                                    {{ pad2(selectedMinute?.id) }}
                                </button>
                                <div @click.stop="ui2.decrMinute()"> <i class='bx bx-chevron-down'></i> </div>
                            </div>
                            <template v-if="!defaults.use24Format">
                                <div class="column">
                                    <div @click.stop="mode=='am' ? mode='pm' : mode='am'"> <i class='bx bx-chevron-up'></i> </div>
                                    <button @click.stop="mode=='am' ? mode='pm' : mode='am'">{{ mode?.toUpperCase() }}</button>
                                    <div @click.stop="mode=='am' ? mode='pm' : mode='am'"> <i class='bx bx-chevron-down'></i> </div>
                                </div>
                            </template>
                        </div>
                        <template v-if="ui2.expand == 'hours'">
                            <div class="label-of-selection">Select Hour</div>
                            <ul class="all-hours fade-in">
                                <template v-if="defaults.use24Format">
                                    <template v-for="(hour, index) in hours_position24" :key="index">
                                        <li @click.stop="selectedHour = hour; ui2.expand=null">{{ hour.id }}</li>
                                    </template>
                                </template>
                                <template v-else>
                                    <template v-for="(hour, index) in hours_position" :key="index">
                                        <li @click.stop="selectedHour = hour; ui2.expand=null">{{ hour.id }}</li>
                                    </template>
                                </template>
                            </ul>
                        </template>
                        <template v-else-if="ui2.expand == 'minutes'" >
                            <div class="label-of-selection">Select Minute</div>
                            <ul class="all-minutes fade-in">                        
                                <template v-for="(minute, index) in minutes_position" :key="index">
                                    <li v-if="!minute.excluded" @click.stop="selectedMinute = minute; ui2.expand=null">{{ minute.id }}</li>
                                </template>
                            </ul>
                        </template>
                    </div>
                </div>
            </template>
            <template v-else>
                <template v-if="defaults.timePickerButtons">
                    <div @click.stop="onClickClose()" class="closeIcon"><i class='bx bx-x' ></i></div>     
                    <div @click.stop="onClickOk()" class="okIcon"><i class='bx bx-check'></i></div>     
                </template>

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
                                draggable="falses"
                                @dragenter="selectedMinute = minute"
                                >
                                </button>                        
                            </template>                        
                        </div>

                        <!-- Hour Picker -->
                        <div class="clocklet-dial clocklet-dial--hour">
                            <div class="clocklet-hand clocklet-hand--hour" :style="selectedHour.deg"></div>
                            <template v-for="(hour, index) in (defaults.use24Format ? hours_position24 : hours_position)" :key="index">
                                <button 
                                type="button" 
                                :style="hour.style"
                                class="clocklet-tick clocklet-tick--hour"
                                :class="{
                                    'hour-24-format': defaults.use24Format,
                                    'clocklet-tick--selected' : selectedHour.value == hour.value
                                    }" 
                                @click.stop="selectedHour = hour"
                                :data-clocklet-tick-value="hour.id"
                                draggable="false"
                                @dragstart="move.dragging = true"
                                @dragenter="/*selectedHour = hour*/ false"
                                @drag="false"
                                @dragend="move.dragging = false"
                                >
                                </button>
                            </template>                   
                        </div>
                        <template v-if="!defaults.use24Format">
                            <div class="clocklet-ampm" :data-clocklet-ampm="mode" @click.stop="mode=='am' ? mode='pm' : mode='am'" data-clocklet-ampm-formatted=""></div>
                        </template>
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
            </template>



            <template v-if="defaults.rangePicker && defaults.timePicker">
                <SwitcherForTime></SwitcherForTime>
            </template>
            
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
    height: 0;
    box-shadow: 0px 8px 32px rgba(0, 0, 0, .16);
}

.clocklet {
    font-size: 16px;
    width: 270px;
    height: v-bind(maxHeight);
    margin-top: 1px;
    padding: 8px;
    border-radius: v-bind(area_radius);
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
    font-family: inherit;
    color: v-bind(color_font_dark);
    font-weight: inherit;
}
.clocklet-tick.hour-24-format {
    font-size: 13px;
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
    border: 1px solid v-bind(color_font_light);
    background-color: v-bind(color_bg_grey);
}

[data-clocklet-placement=top] {
    box-shadow: 4px -4px 4px hsla(0, 0%, 50.2%, .5)
}

[data-clocklet-placement=bottom] {
    box-shadow: 4px 4px 4px hsla(0, 0%, 50.2%, .5)
}

.clocklet-plate {
    background-color: v-bind(color_body_bg);
}

.clocklet-hand {
    background-color: v-bind(color_transparent_1);
}

.clocklet-hand-origin {
    background-color: v-bind(color_primary_bg);
}

.clocklet-tick--selected {
    background-color: v-bind(color_primary_bg);
}

.em-theme-light .clocklet-tick--selected {
    color: v-bind(color_font_light);
}

.em-theme-dark .clocklet-tick--selected {
    color: v-bind(color_font_dark);
}

.clocklet--hoverable:not(.clocklet--dragging) .clocklet-tick:hover {
    background-color: v-bind(color_transparent_2);
}

.clocklet-ampm {
    background-color: v-bind(color_bg_grey);
}

.clocklet-ampm:before {
    background-color: v-bind(color_primary_bg);
    font-size: 13px;
}

.em-theme-light .clocklet-ampm:before {
    color: v-bind(color_font_light);
}

.em-theme-dark .clocklet-ampm:before {
    color: v-bind(color_font_dark);
}

.clocklet-ampm:hover:before {
    background-color: v-bind(color_primary_bg);
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
    background: v-bind(color_bg_grey);
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.display-time span{
    font-size: 20px;
    color: v-bind(color_font_dark);  
}
.display-time div{
    width: 2px;
    height: 100%;
    background-color: v-bind(color_transparent_2);   
}

.pick-the-time{
    width: 100%;
    text-align: center;
    padding: 8px;
    border: transparent;
    background: v-bind(color_transparent_2);  
    color: v-bind(color_font_dark);  
    text-transform: capitalize;
}
.backIcon{
   position: absolute;
    top: 14px;
    left: 10px;
    z-index: 1;
    padding: 5px;
    cursor: pointer; 
    text-align: center;
}
.em-theme-light .backIcon i{
   color: v-bind(color_primary_bg);
}
.em-theme-dark .backIcon i{
    font-size: 26px;
   color: v-bind(color_font_dark);
}
.closeIcon,
.okIcon{
    position: absolute;
    top: 230px;
    z-index: 1;
    padding: 5px;
    cursor: pointer;
    
}
.closeIcon i,
.okIcon i{
    font-size: 26px;
    color: v-bind(color_primary_bg); 
    border-radius: 4px;
    padding: 2px 7px;
    box-shadow:#0000001f 0 1px 3px, #0000001c 0 1px 2px;
}
.em-theme-light .closeIcon i,
.em-theme-light .okIcon i{
    color: v-bind(color_primary_bg);
    background-color: v-bind(color_body_bg);
}
.em-theme-dark .closeIcon i,
.em-theme-dark .okIcon i{
    color: v-bind(color_font_dark);
    background-color: v-bind(color_bg_grey);
}

.clocklet:has(.standard) {
    border: 1px solid v-bind(color_font_light);
    background-color:  v-bind(color_body_bg);
}

.closeIcon{
    left: 10px;
}
.okIcon{
    right: 10px;
}
.closeIcon:has(~div .clocklet-plate.standard){
    top: 210px !important;
    left: 30px !important;
}
.okIcon:has(~div .clocklet-plate.standard){
    top: 210px!important;
    right: 30px!important;
}

.clocklet-plate.standard{
    border-radius: 0 !important;
    padding: 10px !important;
    max-height: 250px;
}

.clocklet-plate.standard.need-scroll{
    overflow-y: scroll;
}

.clocklet-plate.standard .label-of-selection{
    text-align: center;
    font-size: 18px;
    color: v-bind(color_font_dark);
    margin-bottom: 15px;
}

.clocklet-plate.standard ul.all-hours{
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 16px;
    row-gap: 14px;
    list-style: none!important;
    margin: 0px;
    padding: 0;
}
.clocklet-plate.standard ul.all-hours li{
    padding: 5px;
    color: v-bind(color_font_dark);
    background-color: v-bind(color_bg_grey);
    text-align: center;
    cursor: pointer;
    border-radius: 3px;
}

.clocklet-plate.standard ul.all-minutes{
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 16px;
    row-gap: 14px;
    list-style: none!important;
    margin: 0px;
    padding: 0;
}
.clocklet-plate.standard ul.all-minutes li{
    padding: 5px;
    color: v-bind(color_font_dark);
    background-color: v-bind(color_bg_grey);
    text-align: center;
    cursor: pointer;
    border-radius: 3px;
}
.clocklet-plate.standard.need-scroll::-webkit-scrollbar {
    width: 4px !important;
}
.clocklet-plate.standard.need-scroll::-webkit-scrollbar-thumb {
    background: v-bind(color_bg_grey);
}
.clocklet-plate.standard.need-scroll::-webkit-scrollbar-thumb:hover {
    background: v-bind(color_bg_grey);
}

.clocklet-plate.standard .columns {
    display: grid;
    grid-template-columns: v-bind(gird_template_repeat);
    gap: 16px;
    row-gap: 14px;
}

.clocklet-plate.standard .columns .column{
    display: grid;
    text-align: center;
    row-gap: 0px;
}

.clocklet-plate.standard .columns .column div
{
    cursor: pointer;
    padding: 15px 5px;
    border: transparent;
    background-color: transparent;
    transition: all 0.3s;
}
.clocklet-plate.standard .columns .column div:first-child
{
    border-radius: 5px 5px 0px 0px;
}
.clocklet-plate.standard .columns .column div:last-child
{
    border-radius: 0px 0px 5px 5px;
}
.clocklet-plate.standard .columns .column div:first-child:hover
{
    box-shadow: 0 -5px 5px #0202022a;
}
.clocklet-plate.standard .columns .column div:last-child:hover
{
    box-shadow: 0 5px 5px #0202022a;
}
.clocklet-plate.standard .columns .column div:first-child:hover > i
{
    transform: translateY(-2px);
    scale: 1.05;
}
.clocklet-plate.standard .columns .column div:last-child:hover > i
{
    transform: translateY(2px);
    scale: 1.05;
}
.clocklet-plate.standard .columns .column button
{
    border: transparent;
    padding: 16px;
    box-shadow: rgb(0 0 0 / 15%) 0px 1px 4px;
    border-radius: 6px;
    color: v-bind(color_font_dark);
    font-weight: 500;
}
.em-theme-light .clocklet-plate.standard .columns .column button
{
    background-color: v-bind(color_body_bg);
}
.em-theme-dark .clocklet-plate.standard .columns .column button
{
    background-color: v-bind(color_bg_grey);
}

.clocklet-plate.standard .columns .column div i
{
    font-size: 26px;
    color: v-bind(color_font_dark_low);
    transition: all 0.15s;
}
 

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out; /* Adjust the duration and timing function as needed */
}

</style>