<script setup>
import moment from 'moment/moment';
import DateTimePicker from './childs/DateTimePicker.vue';
import Modal from './childs/Modal.vue';
import { ref, provide, reactive, defineProps, onMounted, useAttrs } from 'vue';
let { target, options} = defineProps({
    target: {
        type: [HTMLElement, Object],
        required: true,
        default: null,
    },
    options: {
        type: [Object],
        required: false,
        default: {},
    },
});
options = {...options, ...useAttrs()}

let showModal = ref(false);
let showPicker = ref(false);
let isShowInitilaztionValue = ref(true);
let isMounted = ref(false);
const picker = reactive({
    // with Single Date
    date: '',
    date1: '',
    date2: '',
    time1: {
        time: '',
        hour: 0,
        minute: 0,
        mode: 'am',
    },
    time2: {
        time: '',
        hour: 0,
        minute: 0,
        mode: 'am',
    },
})
const pickerValues = reactive({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
});
provide('isMounted', isMounted);
provide('picker', picker);
provide('pickerValues', pickerValues);

onMounted(() => {
    target.addEventListener('click', (e)=> {
        e.stopPropagation();
        showModal.value = true;
        showPicker.value = true;
    });
    function hidePicker(e) {
        showPicker.value = false;        
    }
    document.removeEventListener('click', hidePicker);
    document.addEventListener('click', hidePicker);
})
let emits = defineEmits(['init', 'open', 'cancel', 'close', 'change', 'changeTime']);
function onCancel(data=null) {
    showModal.value = false;
    showPicker.value = false;
    emits('cancel', data);
}
function onClose(data=null) {
    showModal.value = false;
    showPicker.value = false;
    emits('close', data);
}
function onChange(data=null) {
    showModal.value = false;
    showPicker.value = false;
    emits('change', data);
}
function onChangeTime(data=null) {
    showModal.value = false;
    showPicker.value = false;
    emits('changeTime', data);
}
const desplayPositions = [
    'top_left', 'top_right', 'bottom_left', 'bottom_right', 
    'inline_left', 'inline_right', 'inline_center',
];
provide('desplayPositions', desplayPositions);
let showingPermitInModal = desplayPositions.includes(options?.dispayIn ?? 'modal') == false;
let teleportDiv = ref(null)

function setTeleportDiv() {
    let position = options?.dispayIn;
    if(!position || !desplayPositions.includes(position)) return;  
    let adjacentPosition = position?.startsWith('top_') ? "beforebegin" : "afterend";
    adjacentPosition = position?.startsWith('bottom_') ? "afterend" : adjacentPosition;
    let div = document.createElement('div');
    div.classList = `em-datepicker-wrapper ${position}`
    div.style.width = target?.style?.width;
    div.setAttribute('position', position)
    if(position.startsWith('top_')){
        div.style.boxShadow = `box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px`;
    } else {
        div.style.boxShadow = `box-shadow: rgba(50, 50, 93, 0.25) 0px -13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px`;
    }
    target.insertAdjacentElement(adjacentPosition, div);
    teleportDiv.value = div;
}
setTeleportDiv()
function isHexColor(color){
    if(!color) return false;
    if(!(typeof color == 'string')) return false;
    return color.startsWith('#') && color.length == 7;
}
provide('isHexColor', isHexColor)
</script>

<template>
    <DateTimePicker 
    v-if="isShowInitilaztionValue"
    @init="isShowInitilaztionValue.value = false"
    :target="target" 
    :options="options" 
    :teleportDiv="teleportDiv" 
    :justInitializeValue="true"></DateTimePicker>

    <template v-if="showingPermitInModal">
        <Modal v-if="showModal" v-model="showModal">
            <DateTimePicker 
            @cancel="onCancel"
            @close="onClose"
            @change="onChange"
            @changeTime="onChangeTime"
            :target="target" 
            :options="options" 
            :teleportDiv="teleportDiv" 
            :justInitializeValue="false"></DateTimePicker>
        </Modal>
    </template>
    <template v-else>
        <template v-if="showPicker">
            <teleport :to="teleportDiv">
                <DateTimePicker 
                @cancel="onCancel"
                @close="onClose"
                @change="onChange"
                @changeTime="onChangeTime"
                :target="target" 
                :options="options" 
                :teleportDiv="teleportDiv" 
                :justInitializeValue="false"></DateTimePicker>            
            </teleport>
        </template>
    </template>

</template>

<style>
.em-datepicker-wrapper{
    position: relative;
}
.em-datepicker-wrapper > *:has(.clocklet-container){
    border-radius: 6px;
}
.em-datepicker-wrapper[position^="top_"] > *{
    box-shadow: rgba(50, 50, 93, 0.25) 0px -13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}
.em-datepicker-wrapper:not([position^="top_"]) > *{
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}

.em-datepicker-wrapper.top_left > *,
.em-datepicker-wrapper.top_right > *,
.em-datepicker-wrapper.bottom_left > *,
.em-datepicker-wrapper.bottom_right > *
{
    position: absolute !important;
}

.em-datepicker-wrapper.bottom_left > *
{
    position: absolute !important;
    top: 0;
    left: 0;
}

.em-datepicker-wrapper.top_left > *
{
    position: absolute !important;
    bottom: 0;
    left: 0;
}

.em-datepicker-wrapper.top_right > *
{
    position: absolute !important;
    bottom: 0;
    right: 0;
}

.em-datepicker-wrapper.bottom_right > *
{
    position: absolute !important;
    top: 0;
    right: 0;
}

.em-datepicker-wrapper.inline_left{
    display: flex;
    justify-content: flex-start;
}

.em-datepicker-wrapper.inline_right{
    display: flex;
    justify-content: flex-end;
}

.em-datepicker-wrapper.inline_center{
    display: flex;
    justify-content: center;
}
</style>

