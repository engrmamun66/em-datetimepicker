<script setup>
import Picker from './child/DatePicker.vue';
import Modal from './child/Modal.vue';
import { ref, provide, reactive, defineProps, onMounted } from 'vue';
let { target, options, parentDiv } = defineProps(['target', 'options', 'parentDiv']);
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
    <Picker 
    v-if="isShowInitilaztionValue"
    @init="isShowInitilaztionValue.value = false"
    :target="target" 
    :options="options" 
    :parentDiv="parentDiv" 
    :justInitializeValue="true"></Picker>

    <Modal v-if="showModal" v-model="showModal">
        <Picker 
        @cancel="catchEvent"
        @close="catchEvent"
        :target="target" 
        :options="options" 
        :parentDiv="parentDiv" 
        :justInitializeValue="false"></Picker>
    </Modal>
</template>

