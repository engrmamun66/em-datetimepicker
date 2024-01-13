<script setup>
import Picker from './child/DatePicker.vue';
import PickerModal from '@components/modal/PickerModal.vue';
import { ref, defineProps, onMounted } from 'vue';
let { target, parentDiv } = defineProps(['target', 'parentDiv']);
let showModal = ref(false);
onMounted(() => {
    target.addEventListener('click', (e)=> {
        showModal.value = true;
    });
})
</script>

<template>
    <PickerModal v-if="showModal" v-model="showModal">
        <Picker :target="target" :parentDiv="parentDiv"></Picker>
    </PickerModal>

</template>

