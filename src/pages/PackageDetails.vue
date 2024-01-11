<script setup>
import { ref, inject, onMounted, provide } from 'vue';
import Modules from '../modules';
const detailsOfPackage = Modules.PackageDetailsModule.detailsOfPackage;
let { helper } = inject('utils');
let wrappers = document.querySelectorAll('.RentMyWrapperPackageDetails');
</script>

<template>

    <template v-if="wrappers?.length">
        <template v-for="(wrapper, index) in wrappers" :key="index">
            <teleport :to="wrapper">
                <detailsOfPackage :wrapper="wrapper"></detailsOfPackage>
            </teleport>
        </template> 
    </template> 

</template>
