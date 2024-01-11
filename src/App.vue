<script setup>
import { provide, inject, ref, computed } from 'vue';
import AppHolder from './AppHolder.vue';
import LoaderGlobal from '@components/LoaderGlobal.vue';
let { Toaster } = inject('components');

let global = inject('global');
let showGlobalLoader = ref(false);
let globalLoader = {
    show: (autoOfAfter=null) => {
        showGlobalLoader.value = true;
        setTimeout(()=> showGlobalLoader.value = false, autoOfAfter || 12000);
    },
    hide: () => showGlobalLoader.value = false,
    isShowing: () => showGlobalLoader.value,
};
provide('globalLoader', globalLoader);
</script>

<template>
    <Toaster></Toaster>  
    <LoaderGlobal 
        v-if="showGlobalLoader">
    </LoaderGlobal>
    <AppHolder></AppHolder>    
    
</template>

