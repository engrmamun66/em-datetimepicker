<script setup>
import { ref, provide, inject, onMounted } from 'vue';
import Modules from '../modules';
import { Toaster } from '@/import-hub'
const OrderHistory = Modules.UserModule.OrderHistory;
const OrderDetails = Modules.UserModule.OrderDetails;
const Profile = Modules.UserModule.Profile;
const ChangePassword = Modules.UserModule.ChangePassword;
const ChangeAvatar = Modules.UserModule.ChangeAvatar;
const OrderHistoryAndDetails = Modules.UserModule.OrderHistoryAndDetails;
let { helper, cookie } = inject('utils');

const profileContainer = document.getElementById('RentMyCustomerProfileContainer');
const changePasswordContainer = document.getElementById('RentMyCustomerChangePasswordContainer');
const changeAvatarContainer = document.getElementById('RentMyCustomerChangeAvatarContainer');
const orderHistoryAndDetailsContainer = document.getElementById('RentMyCustomerOrderHistoryAndDetails');
const orderHistoryContainer = document.getElementById('RentMyCustomerOrderHistory');
const orderDetailsContainer = document.getElementById('RentMyCustomerOrderDetails');
const currentContainer = profileContainer 
                        || changePasswordContainer 
                        || changeAvatarContainer 
                        || orderHistoryAndDetailsContainer 
                        || orderHistoryContainer 
                        || orderDetailsContainer;

</script>

<template>

    <template v-if="profileContainer">
        <Profile></Profile>
    </template>

    <template v-else-if="changePasswordContainer">
        <ChangePassword></ChangePassword>
    </template>

    <template v-else-if="changeAvatarContainer">
        <ChangeAvatar></ChangeAvatar>
    </template>

    <template v-else-if="orderHistoryAndDetailsContainer">
        <OrderHistoryAndDetails></OrderHistoryAndDetails>
    </template>

    <template v-else-if="orderHistoryContainer">
        <OrderHistory></OrderHistory>
    </template>

    <template v-else-if="orderDetailsContainer">
        <OrderDetails></OrderDetails>
    </template>

</template>
