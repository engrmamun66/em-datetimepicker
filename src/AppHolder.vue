<script setup>
import { ref, inject } from  'vue';
import EmDateTimePicker from './pages/EmDateTimePicker.vue'
import DisplayDemo from './pages/DisplayDemo.vue'


</script>

<template>  
    <template v-for="(target, index) in targets" :key="index">   
        <EmDateTimePicker :target="target.element" :options="target.options"></EmDateTimePicker>
    </template>  
    <teleport to="#emdemo">
        <DisplayDemo></DisplayDemo>
    </teleport>
</template>