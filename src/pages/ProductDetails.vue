<script setup>
import { ref, inject, onMounted, provide } from 'vue';
import Modules from '../modules';
const detailsOfProduct = Modules.ProductDetailsModule.detailsOfProduct;
let { helper } = inject('utils');
let wrappers = document.querySelectorAll('.RentMyWrapperProductDetails');
</script>

<template>

    <template v-if="wrappers?.length">
        <template v-for="(wrapper, index) in wrappers" :key="index">
            <teleport :to="wrapper">
                <detailsOfProduct :wrapper="wrapper"></detailsOfProduct>
            </teleport>
        </template> 
    </template> 

</template>
