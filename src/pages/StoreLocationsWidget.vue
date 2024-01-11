<script setup>
import { ref, reactie, inject, computed, defineComponent } from "vue";
import { createComponentHTML } from "@utils/functions/withComponent";
import { useGlobalStore } from "@stores/global";
import LocationNoticeModal from "@components/modal/LocationNotice.vue";
let { wrapper } = defineProps(["wrapper"]);
let { helper } = inject("utils");
let globalLoader = inject('globalLoader');
let globalStore = useGlobalStore();
const location = globalStore.storeAndLocations?.location;
const locations = globalStore.storeAndLocations?.locations;
const current_location = computed(() => {
    let current_location = localStorage.getItem('current_location');
    try {
        if(current_location){
            return JSON.parse(current_location);
        }
    } catch (error) { }
    return location;
})

const isSetRentalDate = computed(() => {
     return !!sessionStorage.getItem('online_cartStartDate') 
            || !!sessionStorage.getItem('online_cartEndDate');
})

let showModal = ref(false);

function whenTryToChangeLocation(){
    if(isSetRentalDate.value){
        showModal.value = true;
    } else {
        showModal.value = false;
    }
}


const __cartdata = localStorage.getItem('user_cart');
let cartData = ref(__cartdata ? JSON.parse(__cartdata) : null);
const hasApproprientHTML = !!wrapper.querySelector('[CurrentLocationName]');
const isWpMenuItem = wrapper.classList.contains('menu-item');
if(!isWpMenuItem && !hasApproprientHTML){
    wrapper.innerHTML = `<li class="RentMyLocations"> <a href="#" CurrentLocation> <i class="fas fa-map-marker-alt" PreIcon></i> <span CurrentLocationName>Default Locations</span> &nbsp; <i class="fa fa-chevron-down ml-3" PostIcon></i> </a > <ul class="LocationSubMenu" Locations> <li Location> <a href="#" LocationName>New York</a> </li> </ul> </li>`;
}


createComponentHTML(wrapper, [
    {
        selector: "[CurrentLocation]",
        template: false,
        attr: { '@click.prevent' : 'whenTryToChangeLocation()' },
        text: false,
        child: [
            {
                selector: "[CurrentLocationName]",
                template: false,
                attr: { },
                text: `{{ current_location?.name }}`,
            }, 
        ]
    }, 
    {
        selector: "[Locations]",
        template: false,
        attr: { 'v-if' : 'locations?.length && !isSetRentalDate' },
        text: false,
        child: [
            {
                selector: "[Location]",
                template: false,
                attr: { 
                    'v-for' : '(_location, index) in locations', ':key': 'index',
                    '@click.prevent' : 'globalLoader.show(5000);helper.changeStoreLocation(_location)'
                },
                text: false,
                child: [
                    {
                        selector: "[LocationName]",
                        template: false,
                        attr: { },
                        text: `{{ _location?.name }}`,
                    }, 
                ]
            }, 
        ]
    }, 
]);

const template = wrapper.innerHTML;
wrapper.innerHTML = '';

let RentMyLocation = defineComponent({
    template,
    data(){
        return {
            helper,
            location,
            locations,
            globalLoader,
            current_location,
            isSetRentalDate,
            isWpMenuItem,
        }
    },
    methods: {
        whenTryToChangeLocation,
    }

})

setTimeout(() => {
    wrapper.classList.add('Show');
}, 500);

</script>

<template>
    <LocationNoticeModal v-model="showModal">
        Finish the order for {{ current_location?.name }} before changing locations
    </LocationNoticeModal>


    <template v-if="location">
        <teleport :to="wrapper">
            <template v-if="hasApproprientHTML">
                <RentMyLocation></RentMyLocation>
            </template>
            <template v-else>
                <template v-if="isWpMenuItem">
                    <!-- This HTML structure is same as WordPress menu and submenu (Please don't change this) -->
                    <a @click.prevent="whenTryToChangeLocation()" href="#" class="menu-link" CurrentLocation>
                        <i class="fas fa-map-marker-alt" PreIcon></i>
                        <span CurrentLocationName >{{ current_location?.name }}</span>
                        <template v-if="locations?.length">
                            <span PostIcon role="application" class="dropdown-menu-toggle ast-header-navigation-arrow" tabindex="0" aria-expanded="false" aria-label="Menu Toggle" >
                                <span class="ast-icon icon-arrow" >
                                    <svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve" >
                                        <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" ></path>
                                    </svg>
                                </span> 
                            </span>
                        </template>
                    </a>            
                    <ul v-if="locations?.length && !isSetRentalDate" class="sub-menu" Locations>
                        <template v-for="(_location, index) in locations" :key="index">
                            <li id="menu-item-1814" class="menu-item menu-item-type-post_type menu-item-object-page" Location>
                                <a href="#" class="menu-link" @click.prevent="globalLoader.show(5000);helper.changeStoreLocation(_location)" LocationName>{{ _location?.name }} </a>
                            </li>      
                        </template>
                    </ul>
                </template>
                <template v-else>
                    <RentMyLocation></RentMyLocation>
                </template>
                
            </template>
        </teleport>
    </template>
</template>
