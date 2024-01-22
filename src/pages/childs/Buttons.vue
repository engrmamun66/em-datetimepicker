<script setup>
import { ref, computed, reactive, defineProps, onMounted, inject, defineEmits } from 'vue';
let { defaults, applyBtn } = defineProps({
    defaults: { 
        required: false,
        default: {},
    },
    applyBtn: { 
        required: false,
        default: true,        
    },
});
const theme = inject('theme');
const {
    body_bg: color_body_bg,
    primary_bg: color_primary_bg,
    bg_grey: color_bg_grey,
    font_dark: color_font_dark,
    font_dark_low: color_font_dark_low,
    font_light: color_font_light,
} = defaults.colors
const color_transparent_1 = color_primary_bg + '3d';
const color_transparent_2 = color_primary_bg + '1c';



let emits = defineEmits(['onCancel', 'onApply', 'onToday']);
function handleClick(from=''){
    if(from == 'today'){
        emits('onToday');
    }
    if(from == 'cancel'){
        emits('onCancel');
    }
    if(from == 'apply'){
        emits('onApply');
    }
}
let openTimePicker = inject('openTimePicker');
</script>

<template>
    <template v-if="defaults.buttons || defaults.timePicker">
        <template v-if="defaults.buttons?.todayBtn && (defaults.buttons?.cancelBtn || defaults.buttons?.applyBtn)">
            <div class="flex-between">
                <div class="buttons">
                    <button class="btn-today" @click.stop="handleClick('today')">{{ defaults.buttons?.todayBtn }}</button>
                    <button v-if="defaults.timePicker" class="pick-time" @click.stop="openTimePicker=true"><i class='bx bx-time'></i> Pick Time</button>
                </div>
                 <div class="buttons">
                    <button v-if="defaults.buttons?.cancelBtn" class="btn-cancel" @click.stop="handleClick('cancel')">{{ defaults.buttons?.cancelBtn }}</button>
                    <button v-if="defaults.buttons?.applyBtn && applyBtn" class="btn-apply" :class="{[`theme-${theme}`]: true}" @click.stop="handleClick('apply')">{{ defaults.buttons?.applyBtn }}</button>
                </div>
            </div>           
        </template>
        <template v-else>
            <div class="buttons">
                <button v-if="defaults.timePicker" class="pick-time" @click.stop="openTimePicker=true"><i class='bx bx-time'></i> Pick Time</button>
                <button v-if="defaults.buttons?.cancelBtn" class="btn-cancel" @click.stop="handleClick('cancel')">{{ defaults.buttons?.cancelBtn }}</button>
                <button v-if="defaults.buttons?.applyBtn && applyBtn" class="btn-apply" :class="{[`theme-${theme}`]: true}" @click.stop="handleClick('apply')">{{ defaults.buttons?.applyBtn }}</button>
            </div>
        </template>
    </template>
</template>

<style scoped>
.flex-between{
    display: flex;
    justify-content: space-between;
}
.buttons{
    display: flex;
    justify-content: end;
}
.btn-today, .btn-cancel, .btn-apply, .pick-time{
    padding: 6px 10px;
    border:none;
    text-align: center;
    border-radius: 3px;
}
.btn-today,
.btn-cancel,
.pick-time{
    color: v-bind(color_font_dark);
    background-color: v-bind(color_bg_grey);
}
.pick-time i{
    font-size: 18px;
    transform: translateY(2px);
}

button:has(~button){
    margin-right: 10px;
}

.btn-apply
{
    background-color: v-bind(color_primary_bg);
}
.btn-apply.theme-light
{
    color: v-bind(color_font_light);
}
.btn-apply.theme-dark
{
    color: v-bind(color_font_dark);
}
</style>