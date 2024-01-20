<script setup>
import DateTimePicker from './child/DateTimePicker.vue';
import Modal from './child/Modal.vue';
import { ref, provide, reactive, defineProps, onMounted, useAttrs } from 'vue';
let { target, options, parentDiv } = defineProps({
    target: {
        type: [HTMLElement, Object],
        required: true,
        default: null,
    },
    parentDiv: {
        type: [HTMLElement, Object],
        required: false,
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

function catchEvent(eventName) {
    showModal.value = false;
}
</script>

<template>
    <DateTimePicker 
    v-if="isShowInitilaztionValue"
    @init="isShowInitilaztionValue.value = false"
    :target="target" 
    :options="options" 
    :parentDiv="parentDiv" 
    :justInitializeValue="true"></DateTimePicker>

    <Modal v-if="showModal" v-model="showModal">
        <DateTimePicker 
        @cancel="catchEvent"
        @close="catchEvent"
        :target="target" 
        :options="options" 
        :parentDiv="parentDiv" 
        :justInitializeValue="false"></DateTimePicker>
    </Modal>
</template>

