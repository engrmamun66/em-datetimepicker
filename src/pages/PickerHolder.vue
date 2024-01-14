<script setup>
import Picker from './child/DatePicker.vue';
import Modal from './child/Modal.vue';
import { ref, inject, defineProps, onMounted } from 'vue';
let { target, options, parentDiv } = defineProps(['target', 'options', 'parentDiv']);
let showModal = ref(false);
let isShowInitilaztionValue = ref(true);

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

