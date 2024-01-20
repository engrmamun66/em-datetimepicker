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
const desplayPositions = ['bottom_left', 'bottom_right', 'top_left', 'top_right'];
provide('desplayPositions', desplayPositions);
// let showingPermitInModal = desplayPositions.includes(options?.dispayIn ?? 'modal') == false;
let teleportDiv = ref(null)

function setTeleportDiv() {
    let position = options?.dispayIn;
    if(!position || !desplayPositions.includes(position)) return;  
    let adjacentPosition = position?.startsWith('top_') ? "beforebegin" : "afterend"
    let div = document.createElement('div');
    div.style.position = 'relative';
    div.style.width = target?.style?.width;
    target.insertAdjacentElement(adjacentPosition, div);
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

    <Modal v-if="showingPermitInModal && showModal" v-model="showModal">
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

