<script setup>
import { provide, inject, ref, computed } from 'vue';
import LoaderGlobal from '@components/LoaderGlobal.vue';
let { Toaster } = inject('components');
let { cookie, helper, domElement } = inject('utils');

let global = inject('global');
let isProductListPage = location.href.includes(window.RENTMY_GLOBAL.page.products_list);
provide('isProductListPage', isProductListPage);
provide('setWraperIsReady', domElement.setWraperIsReady);
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
    <LoaderGlobal v-if="showGlobalLoader"></LoaderGlobal>


    
    
</template>