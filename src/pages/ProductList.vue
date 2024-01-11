<script setup>
import { ref, inject, onMounted, provide } from 'vue';
import Modules from '../modules';
const listOfProducts = Modules.ProductListModule.listOfProducts;
let { helper } = inject('utils');
let wrappers = document.querySelectorAll('.RentMyWrapperProductList');
let rentmy_default_data = ref({
    limit: 20,
    // sort_dir: 'ASC',         // ASC || DESC
    // sort_by: 'product_name', // product_name || buy_price || rent_price
    page_no: 1,
    type: 'all',
    all: true,
});
provide('rentmy_default_data', rentmy_default_data.value);
let rentmy_default_data_keys = ref([ 
    'limit', 
    'products', 
    'search', 
    'category', 
    'tags', 
    'sort', 
    'sortBy',
    'type',
    'onLoad',
    ]);
provide('rentmy_default_data_keys', rentmy_default_data_keys.value);

</script>

<template>

    <template v-if="wrappers?.length">
        <template v-for="(wrapper, index) in wrappers" :key="index">
            <teleport :to="wrapper">
                <listOfProducts :wrapper="wrapper" :index="index"></listOfProducts>
            </teleport>
        </template> 
    </template> 

</template>
