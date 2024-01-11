<script setup>
import Modules from '../modules';
const CheckoutComponent = Modules.checkoutModule.CheckoutCompo;
let checkoutPageWrapper = document.querySelector('#RentMyCheckoutWrapper');
</script>

<template>    
    <template v-if="checkoutPageWrapper">
        <CheckoutComponent :wrapper="checkoutPageWrapper"></CheckoutComponent>
    </template>
</template>
