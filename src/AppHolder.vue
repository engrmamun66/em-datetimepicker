<script setup>
import { ref, inject } from  'vue';
import EmDateTimePicker from './pages/EmDateTimePicker.vue'

let emDatetimepicker = inject('emDatetimepicker');
let targets = emDatetimepicker.elements;

</script>

<template>  
    <template v-for="(target, index) in targets" :key="index">   
        <EmDateTimePicker :target="target.element" :options="target.options"></EmDateTimePicker>
    </template>  
</template>