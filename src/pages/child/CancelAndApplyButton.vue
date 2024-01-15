<script setup>
import { ref, computed, reactive, defineProps, onMounted, inject, defineEmits } from 'vue';
let { defaults, applyBtn } = defineProps({
    defaults: { required: false },
    applyBtn: { required: true },
});
let emits = defineEmits(['onCancel', 'onApply']);
function handleClick(from=''){
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
        <div class="buttons">
            <button class="btn-cancel" @click.stop="handleClick('cancel')">Cancel</button>
            <button v-if="applyBtn" class="btn-apply" @click.stop="handleClick('apply')">Apply</button>
        </div>
    </template>
</template>

<style scoped>
.buttons{
    display: flex;
    justify-content: end;
}
.buttons .btn-cancel, .btn-apply{
    padding: 6px 15px;
    border:none;
    text-align: center;
    border-radius: 4px;
}
.buttons .btn-cancel{
    color: black;
    background-color: #e2e3ee;
}
.buttons .btn-cancel:has(~.btn-apply){
    margin-right: 10px;
}
.buttons .btn-apply{
    color: white;
    background-color: #6200EE;
}
</style>