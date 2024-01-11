<script setup>
import CustomerLogin from '@modules/login-register/views/CustomerLogin.vue'
import CustomerRegistration from '@modules/login-register/views/CustomerRegistration.vue'


let login_page = document.querySelector('#RentMyCustomerLoginContainer')
let registration_page = document.querySelector('#RentMyCustomerRegistrationContainer')


</script>

<template>
    <!-- Login Page -->
    <template v-if="login_page">
        <teleport :to="login_page">
            <CustomerLogin :wrapper="login_page"></CustomerLogin>
        </teleport>
    </template>

    <!-- Registration Page -->
    <template v-if="registration_page">
        <teleport :to="registration_page">
            <CustomerRegistration></CustomerRegistration>
        </teleport>
    </template>
</template>