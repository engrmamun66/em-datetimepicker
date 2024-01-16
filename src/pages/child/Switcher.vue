<script setup>
import { ref, defineProps, inject } from 'vue';
let { forDate } = defineProps({
    forDate: {
        default: true, 
        required: false,
    },
});

const startText = forDate ? 'Start Date' : 'Start Time';
const endText = forDate ? 'End Date' : 'Start Time';

let defaults = inject('defaults');
let picker = inject('picker');
let selectingStartDate = inject('selectingStartDate');

function handleClick(value){
    if(value == 'from_left'){
        }
    if(value == 'from_right'){
        picker.date2 = '';
        selectingStartDate.value = true;
    }
}
</script>

<template>
    <div class="switches-container">
        <input type="radio" name="switchPlan" value="left" :checked="selectingStartDate" @click.stop="handleClick('from_left')"/>
        <input type="radio" name="switchPlan" value="right" :checked="!selectingStartDate" @click.stop="handleClick('from_right')"/>
        <label for="switchMonthly">{{ startText }}</label>
        <label for="switchYearly">{{ endText }}</label>
        <div class="switch-wrapper">
            <div class="switch">
                <div>{{ startText }}</div>
                <div>{{ endText }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* a container - decorative, not required */
.container {
    border: transparent;
    width: 100%;
    padding: 0px;
    margin-left: auto;
    margin-right: auto;
    background-color: #f9f9f9;
}

/* container for all of the switch elements 
    - adjust "width" to fit the content accordingly 
*/
.switches-container {
    width: 100%;
    position: relative;
    display: flex;
    padding: 0;
    position: relative;
    line-height: 1rem;
    border-radius: 0px;
    margin-left: auto;
    margin-right: auto;
}

/* input (radio) for toggling. hidden - use labels for clicking on */
.switches-container input {
    visibility: hidden;
    position: absolute;
    top: 0;
}

/* labels for the input (radio) boxes - something to click on */
.switches-container label {
    width: 50%;
    padding: 7px;
    margin: 0;
    text-align: center;
    cursor: pointer;
    color: #ccc;
}

/* switch highlighters wrapper (sliding left / right) 
    - need wrapper to enable the even margins around the highlight box
*/
.switch-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50%;
    padding: 0;
    z-index: 3;
    transition: transform .5s cubic-bezier(.77, 0, .175, 1);
}

.switch {
    border-radius: 0px;
    background: #e2e3ee;
    height: 100%;
}

.switch div {
    width: 100%;
    text-align: center;
    opacity: 0;
    display: block;
    color: #444;
    transition: opacity .2s cubic-bezier(.77,0,.175,1) .125s;
    will-change: opacity;
    position: absolute;
    top: 5px;
    left: 0;
}

.switches-container input:nth-of-type(1):checked~.switch-wrapper {
    transform: translateX(0%);
}

.switches-container input:nth-of-type(2):checked~.switch-wrapper {
    transform: translateX(100%);
}

.switches-container input:nth-of-type(1):checked~.switch-wrapper .switch div:nth-of-type(1) {
    opacity: 1;
}

.switches-container input:nth-of-type(2):checked~.switch-wrapper .switch div:nth-of-type(2) {
    opacity: 1;
}
</style>