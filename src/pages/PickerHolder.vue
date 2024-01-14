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
    date1: '',
    date2: '',
    monthIndex: 0,
    start_from: 0,
})
const pickerValues = reactive({
    startDate: '',
    endDate: '',
    old: {
        startDate: '',
        endDate: '',
    }
});
provide('isMounted', isMounted);
provide('picker', picker);
provide('pickerValues', pickerValues);

onMounted(() => {
    target.addEventListener('click', (e)=> {
        showModal.value = true;
    });
})

function catchEvent(eventName, data=null) {
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
        @cancel="(data)=>catchEvent('cancel', data)"
        @close="(data)=>catchEvent('close', data)"
        :target="target" 
        :options="options" 
        :parentDiv="parentDiv" 
        :justInitializeValue="false"></Picker>
    </Modal>
</template>

