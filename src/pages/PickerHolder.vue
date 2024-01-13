<script setup>
import Picker from './child/DatePicker.vue';
import Modal from './child/Modal.vue';
import { ref, inject, defineProps, onMounted } from 'vue';
let { target, parentDiv } = defineProps(['target', 'parentDiv']);
let showModal = ref(false);


onMounted(() => {
    target.addEventListener('click', (e)=> {
        showModal.value = true;
    });
})
</script>

<template>
    <Modal v-if="showModal" v-model="showModal">
        <Picker :target="target" :parentDiv="parentDiv"></Picker>
    </Modal>

</template>

