<script setup>
import moment from 'moment/moment';
import DateTimePicker from './childs/DateTimePicker.vue';
import Modal from './childs/Modal.vue';
import { h, ref, provide, reactive, defineProps, onMounted, useAttrs, computed } from 'vue';
let emits = defineEmits([ 'update:modelValue', 'init', 'open', 'cancel', 'close', 'change', 'changeTime']);
let { modelValue, options, size, autoOpen } = defineProps({
    modelValue: {
        type: [Boolean],
        required: true,
        default: true,
    },
    isDisabled: {
        type: [Boolean],
        required: false,
        default: true,
    },
    autoOpen: {
        type: [Boolean],
        required: false,
        default: false,
    },
    options: {
        type: [Object],
        required: false,
        default: {},
    },
    size: {
        type: [String],
        required: true,
        default: 'md',
        validator: (value) => {
            return ['sm', 'md', 'lg'].includes(value);
        }
    },
});
let target = ref(null);
options = {...options, ...useAttrs()};

let showPicker = ref(false);
let isShowInitilaztionValue = ref(true);
let isMounted = ref(false);
const picker = reactive({
    // with Single Date
    date: '',
    date1: '',
    date2: '',
    time1: {
        time: '',
        hour: 0,
        minute: 0,
        mode: 'am',
    },
    time2: {
        time: '',
        hour: 0,
        minute: 0,
        mode: 'am',
    },
})
const pickerValues = reactive({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
});
let theme = (options?.theme && options?.theme=='dark') ? options?.theme : 'light';
provide('theme', theme);
provide('picker', picker);
provide('isMounted', isMounted);
provide('pickerValues', pickerValues);

onMounted(() => {    
    function hidePicker(e) {
        e.stopPropagation();
        updateModalValue(false);   
        showPicker.value = false;
    }
    document.removeEventListener('click', hidePicker);
    document.addEventListener('click', hidePicker);
    if(autoOpen){
        setTimeout(()=> target.value.click(), 500);
    }
})
function updateModalValue(booleanVal){
    emits('update:modelValue', booleanVal);
}
function onCancel(data=null) {
    showPicker.value = false;
    emits('cancel', data);
}
function onClose(data=null) {
    showPicker.value = false;
    emits('close', data);
}
function onChange(data=null) {
    emits('change', data);
}
function onChangeTime(data=null) {
    emits('changeTime', data);
}
const desplayPositions = [
    'top_left', 
    'top_right', 
    'bottom_left', 
    'bottom_right',     
    'inline_left', 
    'inline_right', 
    'inline_center',
];
provide('desplayPositions', desplayPositions);

const div = computed(() => {
    let position = ((options?.displayIn && desplayPositions.includes(options?.displayIn ?? 'modal'))) ? options?.displayIn : 'modal';
    let boxShadow =  `box-shadow: rgba(50, 50, 93, 0.25) 0px ${position?.startsWith('top_') ? '' : '-'}13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px`;
    let attrs = {
        position,
        boxShadow,
        diplayIn: position?.startsWith('top_') ? 'top' : 'bottom',
        classList: `em-datepicker-wrapper ${position}`,
    } 
    return attrs;
});

function isHexColor(color){
    if(!color) return false;
    if(!(typeof color == 'string')) return false;
    return color.startsWith('#') && color.length == 7;
}
provide('isHexColor', isHexColor);
</script>

<template>
    <!-- Just auto initilization -->
    <template v-if="target">
        <DateTimePicker 
        v-if="isShowInitilaztionValue"
        @init="isShowInitilaztionValue.value = false"
        :target="target" 
        :options="options"
        :justInitializeValue="true"></DateTimePicker>
    </template>

    <template v-if="showPicker && div.position == 'modal'">
        <Modal @makeFalse="showPicker=false">
            <DateTimePicker 
            @cancel="onCancel"
            @close="onClose"
            @change="onChange"
            @changeTime="onChangeTime"
            :target="target" 
            :options="options" 
            :justInitializeValue="false"></DateTimePicker>
        </Modal>
    </template>

    <template v-if="showPicker && target && div.position != 'modal' && div.diplayIn == 'top'">
        <h1>TOP</h1>
        <div :class="{[div.classList] : true}" :style="div.boxShadow">
            <DateTimePicker 
            @cancel="onCancel"
            @close="onClose"
            @change="onChange"
            @changeTime="onChangeTime"
            :target="target" 
            :options="options"
            :justInitializeValue="false"></DateTimePicker> 
        </div>
    </template>

    <input class="em-datetimepicker" @click.stop="showPicker=true" ref="target" type="text"
    v-bind="{class: $attrs?.class, style: $attrs?.style}"
    />

    <template v-if="showPicker && target && div.position != 'modal' && div.diplayIn == 'bottom'">
        <div :class="{[div.classList] : true}" :style="div.boxShadow">
            <DateTimePicker 
            @cancel="onCancel"
            @close="onClose"
            @change="onChange"
            @changeTime="onChangeTime"
            :target="target" 
            :options="options" 
            :justInitializeValue="false"></DateTimePicker> 
        </div>
    </template>
    

</template>

<style>
.em-datepicker-wrapper{
    position: relative;
}
.em-datepicker-wrapper > *:has(.clocklet-container){
    border-radius: 6px;
}
.em-datepicker-wrapper[position^="top_"] > *{
    box-shadow: rgba(50, 50, 93, 0.25) 0px -13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}
.em-datepicker-wrapper:not([position^="top_"]) > *{
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}

.em-datepicker-wrapper.top_left > *,
.em-datepicker-wrapper.top_right > *,
.em-datepicker-wrapper.bottom_left > *,
.em-datepicker-wrapper.bottom_right > *
{
    position: absolute !important;
}

.em-datepicker-wrapper.bottom_left > *
{
    position: absolute !important;
    top: 0;
    left: 0;
}

.em-datepicker-wrapper.top_left > *
{
    position: absolute !important;
    bottom: 0;
    left: 0;
}

.em-datepicker-wrapper.top_right > *
{
    position: absolute !important;
    bottom: 0;
    right: 0;
}

.em-datepicker-wrapper.bottom_right > *
{
    position: absolute !important;
    top: 0;
    right: 0;
}

.em-datepicker-wrapper.inline_left{
    display: flex;
    justify-content: flex-start;
}

.em-datepicker-wrapper.inline_right{
    display: flex;
    justify-content: flex-end;
}

.em-datepicker-wrapper.inline_center{
    display: flex;
    justify-content: center;
}
</style>

