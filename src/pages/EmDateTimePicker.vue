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
        showModal.value = true;
    });
})
let emits = defineEmits(['init', 'open', 'cancel', 'close', 'change', 'changeTime']);
function onCancel(data=null) {
    showModal.value = false;
    emits('cancel', data);
}
function onClose(data=null) {
    showModal.value = false;
    emits('close', data);
}
function onChange(data=null) {
    showModal.value = false;
    emits('change', data);
}
function onChangeTime(data=null) {
    showModal.value = false;
    emits('changeTime', data);
}
const desplayPositions = [
    'bottom_left', 'bottom_right', 'top_left', 'top_right', 
    'inline_left', 'inline_right', 'inline_center',
];
provide('desplayPositions', desplayPositions);
let showingPermitInModal = desplayPositions.includes(options?.dispayIn ?? 'modal') == false;
let teleportDiv = ref(null)

function setTeleportDiv() {
    let position = options?.dispayIn;
    if(!position || !desplayPositions.includes(position)) return;  
    let adjacentPosition = position?.startsWith('top_') ? "beforebegin" : "afterend";
    adjacentPosition = position?.startsWith('bottom_') ? "afterend" : "afterend";
    let div = document.createElement('div');
    div.style.width = target?.style?.width;
    div.classList = `em-datepicker-wrapper ${position}`
    target.insertAdjacentElement(adjacentPosition, div);
    teleportDiv.value = div;
}
setTeleportDiv()
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
        <template v-if="true">
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
.em-datepicker-wrapper.bottom_left > *,
.em-datepicker-wrapper.bottom_right > *,
.em-datepicker-wrapper.top_left > *,
.em-datepicker-wrapper.top_right > *
{
    position: absolute !important;
}

.em-datepicker-wrapper.bottom_left > *
{
    position: absolute !important;
    top: 0;
    left: 0;
}

.em-datepicker-wrapper.bottom_right > *
{
    position: absolute !important;
    top: 0;
    right: 0;
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

