<script setup>
import { ref, inject } from  'vue';
import PickerHolder from './pages/PickerHolder.vue'

let emDatetimepicker = inject('emDatetimepicker');
let targets = emDatetimepicker.elements;
let target_divs = ref([]);


function wraperByDiv() {
    targets.forEach(target => {
        let { element, options } = target;
        let div = document.createElement('div');
        div.style.position = 'relative';
        element.insertAdjacentElement("beforebegin", div);
        div.appendChild(element);
        target_divs.value = [...target_divs.value, div];
    })
}
wraperByDiv()
</script>

<template>  
    <template v-for="(target, index) in targets" :key="index">   
        <PickerHolder :target="target.element" :options="target.options" :parentDiv="target_divs[index]"></PickerHolder>
    </template>  
</template>