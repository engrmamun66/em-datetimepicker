<script setup>
import { ref, inject } from  'vue';
import PickerHolder from './pages/PickerHolder.vue'

let emDatetimepicker = inject('emDatetimepicker');
let targets = emDatetimepicker.elements;
let target_divs = ref([]);
 

function wraperByDiv() {
    targets.forEach(target => {
        let div = document.createElement('div');
        div.style.position = 'relative';
        // div.classList = 'light-theme';
        target.insertAdjacentElement("beforebegin", div);
        div.appendChild(target);
        target_divs.value = [...target_divs.value, div];
    })
}
wraperByDiv()
</script>

<template>  
    <template v-for="(target, index) in targets" :key="index">   
        <PickerHolder :target="target" :parentDiv="target_divs[index]"></PickerHolder>
    </template>  
</template>