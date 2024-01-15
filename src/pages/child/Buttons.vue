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

</script>

<template>
    <template v-if="defaults.buttons">
        <template v-if="defaults.buttons?.todayBtn && (defaults.buttons?.cancelBtn || defaults.buttons?.applyBtn)">
            <div class="flex-between">
                <button class="btn-today" @click.stop="handleClick('today')">{{ defaults.buttons?.todayBtn }}</button>
                 <div class="buttons">
                    <button v-if="defaults.buttons?.cancelBtn" class="btn-cancel" @click.stop="handleClick('cancel')">{{ defaults.buttons?.cancelBtn }}</button>
                    <button v-if="defaults.buttons?.applyBtn && applyBtn" class="btn-apply" @click.stop="handleClick('apply')">{{ defaults.buttons?.applyBtn }}</button>
                </div>
            </div>           
        </template>
        <template v-else>
            <div class="buttons">
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
.btn-today, .btn-cancel, .btn-apply{
    padding: 6px 15px;
    border:none;
    text-align: center;
    border-radius: 4px;
}
.btn-today,
.btn-cancel{
    color: black;
    background-color: #e2e3ee;
}
.btn-cancel:has(~.btn-apply){
    margin-right: 10px;
}

.btn-apply
{
    color: white;
    background-color: #6200EE;
}
</style>