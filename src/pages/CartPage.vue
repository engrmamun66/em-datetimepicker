<script setup>
import { ref } from 'vue';
import Modules from '../modules';
const Cart = Modules.cartModule.cart;

const cartWrappers = Array.from(document.querySelectorAll('.RentMyCartWrapper') || []);

</script>

<template>

    <template v-if="cartWrappers?.length">
        <template v-for="(wrapper, index) in cartWrappers" :key="index">
            <Cart :wrapper="wrapper"></Cart>
        </template>
    </template>

</template>
