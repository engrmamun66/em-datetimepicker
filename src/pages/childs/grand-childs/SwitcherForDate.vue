<script setup>
import { ref, defineProps, inject, onMounted } from 'vue';
const startText = 'Start Date';
const endText = 'End Date';

let theme = inject('theme');
let defaults = inject('defaults');
let picker = inject('picker');
let selectingStartDate = inject('selectingStartDate');

function handleClick(value){
    if(value == 'from_right'){
        picker.date2 = '';
        selectingStartDate.value = false;
    }
}

let {
    body_bg: color_body_bg,
    primary_bg: color_primary_bg,
    bg_grey: color_bg_grey,
    font_dark: color_font_dark,
    font_dark_low: color_font_dark_low,
    font_light: color_font_light,
} = defaults.colors
const color_transparent_1 = color_primary_bg + '3d';
const color_transparent_2 = color_primary_bg + '1c';

</script>

<template>
    <div class="switches-container">
        <input type="radio" name="switchPlan" value="left" :checked="selectingStartDate" />
        <input type="radio" name="switchPlan" value="right" :checked="!selectingStartDate" />
        <label for="switchStartDate" @click.stop="handleClick('from_left')">{{ startText }}</label>
        <label for="switchEndDate" @click.stop="handleClick('from_right')">{{ endText }}</label>
        <div class="switch-wrapper" :class="{[`theme-${theme}`]: true}">
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
    background-color: v-bind(color_bg_grey);
}

/* container for all of the switch elements 
    - adjust "width" to fit the content accordingly 
*/
.switches-container {
    width: 100%;
    display: flex;
    line-height: 1rem;
    border-radius: 0;
    margin-left: auto;
    margin-right: auto;
    background-color: v-bind(color_body_bg);
    position: relative;
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
    color: v-bind(color_font_dark);
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
    z-index: 0;
    transition: transform .3s cubic-bezier(.77, 0, .175, 1);
}

.switch {
    border-radius: 0px;
    background: v-bind(color_primary_bg);
    height: 100%;
}

.switch div {
    width: 100%;
    opacity: 0;
    display: block;
    will-change: opacity;
    position: absolute;
    text-align: center;
    transition: opacity .2s cubic-bezier(.77,0,.175,1) .125s;
    color: v-bind(color_font_light);
    top: 7px;
    left: 0;
}


.switches-container input:nth-of-type(1):checked~.switch-wrapper {
    transform: translateX(0%);
}

.switches-container input:nth-of-type(2):checked~.switch-wrapper {
    transform: translateX(100%);
}


.switches-container input:nth-of-type(1)~.switch-wrapper.theme-light .switch div:nth-of-type(1) {
    opacity: 1;
    color: v-bind(color_font_light);
}
.switches-container input:nth-of-type(1)~.switch-wrapper.theme-dark .switch div:nth-of-type(1) {
    opacity: 1;
    color: v-bind(color_font_dark);
}

.switches-container input:nth-of-type(1)~.switch-wrapper .switch div:nth-of-type(2) {
    opacity: 0;
}

.switches-container input:nth-of-type(2):checked~.switch-wrapper.theme-light .switch div:nth-of-type(2) {
    opacity: 1;
    color: v-bind(color_font_light);
}
.switches-container input:nth-of-type(2):checked~.switch-wrapper.theme-dark .switch div:nth-of-type(2) {
    opacity: 1;
    color: v-bind(color_font_dark);
}
.switches-container input:nth-of-type(2):checked~.switch-wrapper .switch div:nth-of-type(1) {
    opacity: 0;
}
</style>