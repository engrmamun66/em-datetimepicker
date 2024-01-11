<script setup>
import Picker from './pages/DatePicker.vue'
let pickers = Array.from(document.querySelectorAll('.em-datetimepicker'));
pickers.forEach(picker => {
    let div = document.createElement('div');
    div.style.position = 'relative';
    div.insertAdjacentElement("beforebegin", picker);
    div.appendChild(picker);
    const parent = picker.parentElement;
    if(parent) parent.appendChild(div);
})
</script>

<template>  
    <template v-for="(picker, index) in pickers" :key="index">
        <teleport :to="picker">
            <Picker></Picker>
        </teleport>
    </template>
    
    
</template>