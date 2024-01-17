<script setup>
import { ref, defineProps, inject } from 'vue';
let { forDate } = defineProps({
    forDate: {
        default: true, 
        required: false,
    },
});

const startText = 'Start Time';
const endText ='End Time';

let defaults = inject('defaults');
let picker = inject('picker');
let selectingStartDate = inject('selectingStartDate');
let selectingStartTime = true;

function handleClick(value){
    console.log(value);
    if(value == 'right'){
        picker.date2 = '';
        selectingStartTime.value = false;
    }
}
</script>

<template>
    <div class="switches-container">
        <input type="radio" name="switchPlan" value="left" :checked="selectingStartTime" />
        <input type="radio" name="switchPlan" value="right" :checked="!selectingStartTime" />
        <label for="startTime" @click.stop="handleClick('left')">{{ startText }}</label>
        <label for="EndTime" @click.stop="handleClick('right')">{{ endText }}</label>
        <div class="switch-wrapper">
            <div class="switch" :class="{right: selectingStartTime===false}">
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
    display: flex;
    padding: 0;
    position: relative;
    line-height: 1rem;
    border-radius: 0;
    margin-left: auto;
    margin-right: auto;
    background-color: #fafafa;
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
    border-radius: 0;
    background: #e2e3ee;
    height: 100%;
    transition: transform 0.5s;
}
.switch.right {
    border-radius: 0;
    background: #e2e3ee;
    height: 100%;
    transform: translateX(100%);
    transition: opacity .2s cubic-bezier(.77,0,.175,1) .125s;
}

.switch div {
    width: 100%;
    text-align: center;
    opacity: 0;
    display: block;
    color: #444;    
    position: relative;
    top: 5px;
    left: 0;
}

</style>