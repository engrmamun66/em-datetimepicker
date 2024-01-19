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
                    <button v-if="defaults.timePicker" class="pick-time" @click="openTimePicker=true"><i class='bx bx-time'></i> Pick Time</button>
                </div>
                 <div class="buttons">
                    <button v-if="defaults.buttons?.cancelBtn" class="btn-cancel" @click.stop="handleClick('cancel')">{{ defaults.buttons?.cancelBtn }}</button>
                    <button v-if="defaults.buttons?.applyBtn && applyBtn" class="btn-apply" @click.stop="handleClick('apply')">{{ defaults.buttons?.applyBtn }}</button>
                </div>
            </div>           
        </template>
        <template v-else>
            <div class="buttons">
                <button v-if="defaults.timePicker" class="pick-time" @click="openTimePicker=true"><i class='bx bx-time'></i> Pick Time</button>
                <button v-if="defaults.buttons?.cancelBtn" class="btn-cancel" @click.stop="handleClick('cancel')">{{ defaults.buttons?.cancelBtn }}</button>
                <button v-if="defaults.buttons?.applyBtn && applyBtn" class="btn-apply" @click.stop="handleClick('apply')">{{ defaults.buttons?.applyBtn }}</button>
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
    color: #444;
    background-color: #e2e3ee;
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
    color: white;
    background-color: #6200EE;
}
</style>