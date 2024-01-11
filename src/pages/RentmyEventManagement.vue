<script setup>
import 'vue/dist/vue.esm-bundler.js';
import { ref, reactive, inject, onMounted, defineProps, provide, computed, watchEffect } from 'vue';
import { Toaster, emitter } from '@/import-hub';
let globalLoader = inject('globalLoader');
let { wrapper } = defineProps(['wrapper']);
let setWraperIsReady = inject('setWraperIsReady');
import Pagination from '@components/Pagination.vue';
import _AllEvents from '@/rentmy-events';
import { createComponentHTML } from "@utils/functions/withComponent";
let { helper, cookie, domElement, http, labelSelector, currency } = inject('utils');
let { Loader } = inject('components');


let count = {
    allHook: () => _AllEvents.reduce((a, b) =>{
        return a + b.events?.length;
    }, 0),
    filterHook: () => _AllEvents.reduce((a, b) =>{
        return a + b.events?.filter(event => event.hook_type == 'filter')?.length;
    }, 0),
    actionHook: () => _AllEvents.reduce((a, b) =>{
        return a + b.events?.filter(event => event.hook_type == 'action')?.length;
    }, 0),
    
}

let AllEvents = ref(null);
let submitButton = ref(null);
let loading = ref(false);
let isMounted = ref(false);
let switchChecked = ref(false);
let hookType = ref(null);
let state = reactive({
    savedEvents: {name: 'Mamun'},
});

let search = ref(null);

watchEffect(() => {
    migrateEvents(null, !(!!AllEvents.value));
    if(!search.value && !hookType.value) return AllEvents.value;
    if(search.value || hookType.value){
        AllEvents.value = AllEvents.value.map((item, index) => {
            item.events = item.events.filter(event => {
                let eventName = event.name.toLowerCase();
                let text = search.value ? search.value.toLowerCase() : '';

                if(text && hookType.value && eventName.indexOf(text) > -1 && hookType.value == 1 && event.hook_type == 'filter'){
                    return true;
                }                 
                if(text && hookType.value && eventName.indexOf(text) > -1 && hookType.value == 2 && event.hook_type == 'action'){
                    return true;
                }                 
                if(!text && hookType.value && hookType.value == 1 && event.hook_type == 'filter'){
                    return true;
                }                 
                if(!text && hookType.value && hookType.value == 2 && event.hook_type == 'action'){
                    return true;
                }                 
                if(text && !hookType.value && eventName.indexOf(text) > -1){
                    return true;
                }                  
                else {
                    return false;
                }
            });
            if(!item.events?.length){
                item.hideMe = true;                
            }
            
            return item;
        });      
        AllEvents.value = AllEvents.value.sort((a, b) => {
            if(a.events.length){
                return -1;
            } 
            else if( b.events.length ) {
                return 1
            }
            else {
                return 0
            }
        });
    
        return AllEvents.value;
    }
})



migrateEvents(null, true);
function migrateEvents(hook=null, assingFirst=false){
    if(!AllEvents.value || assingFirst){
        AllEvents.value = JSON.parse(JSON.stringify(_AllEvents));
    }

    AllEvents.value.forEach(item=>item.events.forEach(event=>{
        if(state.savedEvents[event.name]){
            event.jsCode = state.savedEvents[event.name].jsCode.replace(/;/gi, ';<br>').replace(/\\/gi, '');
            if(hook && hook.name == state.savedEvents[event.name]){
                event.isShow = true;
                event.isUsing = !!state.savedEvents[event.name]?.['isUsing'];
            }
        } else {
            if(event.hook_type == 'filter'){
                event.jsCode = `return ${event.param};`;
            }
        }
    }))
}

async function getEventFromWp() {
    try {
        let payload = {
            action: 'rentmy_cdn_request',
            method: 'get_rentmy_events',
        }
        let response = await http.post(RENTMY_GLOBAL.ajax_url, payload);
        if(response.data.success){
            let result = response.data.data.result;
            state.savedEvents = result;
        }
        migrateEvents();
    } catch(error) {
        Toaster().error(error);
    }
}       
async function setEventToWp(event, {circleClicked, deleteEvent, updateEvent}={}) {
    try {
        let payload = {
            action: 'rentmy_cdn_request',
            method: 'set_rentmy_event',
            event: event,
        }
        let currentEvent = state.savedEvents[event.name];    

        payload.isUsing = !(currentEvent?.['isUsing']);
        if(updateEvent) payload.isUsing = true;
        if(deleteEvent) payload.deleteEvent = true;          
        

        globalLoader.show();
        let response = await http.post(RENTMY_GLOBAL.ajax_url, payload);
        globalLoader.hide();
        if(response.data.success){
            let result = response.data.data.result;
            state.savedEvents = result;
            
            if(deleteEvent){
                Toaster().success('Deleted Successful');
            } else {
                if(circleClicked){
                    if(state.savedEvents[event.name]?.isUsing){
                        Toaster().success('Added in using list');
                    }else{
                        Toaster().warning('Removed from using list');
                    }
                }else{
                    Toaster().success('Update Hook Successful');
                }
            }
        }
        migrateEvents();
    } catch(error) {
        Toaster().error(error);
    }
}

function updateModelValueAndSave(id, event, {circleClicked, deleteEvent, updateEvent}={}){ 
    if(deleteEvent && !confirm('Do you want to delete')) return;
    let codeArea = document.getElementById(id);
    event.jsCode = codeArea.innerHTML;
    
    event.jsCode = event.jsCode.replace(/;\s?<br>/gi, ';').replace(/;\s+?<br>/gi, ';').replace(/<br>/g, ';'),
    setEventToWp(event, {circleClicked, deleteEvent, updateEvent});
}

onMounted(async ()=>{
    let useNonceSecurity = RentMyEvent.apply_filters('EventManagement:UseNoceSecurity', true);
    if(useNonceSecurity){
        if(!window.RENTMY_GLOBAL.is_varified_rentmy_event_nonce){
            wrapper.innerHTML = `
                <div class="mt-5 p-5 border">
                    <h1 class="text-danger text-center" style="font-size: 36px;">NOT ALLOWED WITHOUT VALID NONCE</h1>
                    <h3 class="text-danger text-center">Open this page from your wordpress <a href="${RENTMY_GLOBAL.page.rentmy_dashboard}"> RentMy dashboard </a></h3>
                </div>
            `;
            setWraperIsReady(wrapper);
            return;
        }
    }
    await getEventFromWp();
    setWraperIsReady();
    isMounted.value = true;
})
</script>

<template>  
    <teleport :to="wrapper">
        <div class="app" v-if="isMounted">
            <nav class="nav">
                <a href="#" class="nav__item" :class="{active: hookType==null}" @click.prevent="hookType=null;migrateEvents(null, true)">All <span class="hook_count">{{ count.allHook() }}</span> </a>
                <a href="#" class="nav__item" :class="{active: hookType==1}" @click.prevent="hookType=1;migrateEvents(null, true)">Filter Hook <span class="hook_count">{{ count.filterHook() }}</span> </a>
                <a href="#" class="nav__item" :class="{active: hookType==2}" @click.prevent="hookType=2;migrateEvents(null, true)">Action Hook <span class="hook_count">{{ count.actionHook() }}</span> </a>
            </nav>

            <div class="switch-area mb-2">
                <div class="switch-area-inner">
                    <Label style="transform: translateY(1px);font-size:16px" class="mb-2">{{ switchChecked ? 'Showing Using Hooks Only' : 'Show Using Hooks Only&nbsp;&nbsp;&nbsp;' }}</Label>
                    <label class="Switch" >
                        <input type="checkbox" :checked="switchChecked" @click="switchChecked = !switchChecked">
                        <small></small>
                    </label>
                </div>
            </div>

            <div class="add">
                <input placeholder="Search by hook name" v-model="search" type="search" class="add__input" @input="migrateEvents(null, true)">
            </div>

            <div class="list" style="max-height: calc(80vh); overflow-y: scroll;">
                <template v-for="(item, index) in AllEvents" :key="index">
             
                    <div SingleEvent :style="item.hideMe ? 'filter: sepia(1)': ''">                    
                        <h1 class="group-title text-center">{{ item.title }}</h1>              
                    </div>                    
          
                    <template  v-if="item.events?.length">
                        <template  v-for="(event, i) in item.events" :key="i">                            
                            <template v-if="event.sub_group">
                                <div class="sub-group">
                                    <span>{{ event.name }}</span>
                                </div>            
                            </template>
                            <template v-else>
                                <template v-if="(switchChecked && state.savedEvents[event.name]?.isUsing) || !switchChecked">
                                    <div SingleEvent>                     
                                        <div class="item">
                                            <label class="item__checkbox" :class="{active: state.savedEvents[event.name]?.isUsing}"  @click.prevent="updateModelValueAndSave(`codeArea_${index}_${i}`, event, {circleClicked: true})">
                                                <input type="checkbox" :checked="state.savedEvents[event.name]?.isUsing" @click.prevent="false">
                                                <i class="fas fa-check"></i>
                                            </label>

                                            <span class="mb-2 hook_type">{{ event.hook_type }} Hook:</span>
                                            <span EventName>{{ event.name }}</span>

                                            <div class="d-flex justify-content-center align-items-center row-icons">
                                                <button Expand @click="helper.toggleLoopItem(item.events, i)">Expand</button>
                                            </div>
                                        </div>
                                        <div class="callback_area" :class="{expand: event?.isShow, fadeIn: event?.isShow}">
                                            
                                            <div v-if="event.description" class="description mb-4" Description>
                                                {{ event.description }}
                                            </div>
                                            <div class="jsHookExample mb-4" Description>
                                                {{ 
                                                    event.hook_type === 'filter' ? `RentMyEvent.add_filter("${event.name}", (${event.param}) => ${event.param} );`: ''
                                                }}
                                                {{ 
                                                    event.hook_type === 'action' ? `RentMyEvent.add_action("${event.name}", your_callback );`: ''
                                                }}
                                            </div>
                                            <div class="usingPages mb-4" v-if="event.using_pages?.length">
                                                <template v-if="(typeof event.using_pages) == 'string'">
                                                    <li >
                                                        <a href="#">{{ event.using_pages }}</a>
                                                    </li>
                                                </template>
                                                <template v-else>
                                                    <li v-for="(page, j) in event.using_pages" :key="j">
                                                        <a :href="page.url" target="_blank">{{ page.name }}</a>
                                                    </li>
                                                </template>
                                            </div>

                                            <div>
                                                <p class="mb-2"><strong class="callback">( <span class="parameter">{{ event.param }}</span> ) => {</strong> </p>
                                                <code class="codeArea" :id="`codeArea_${index}_${i}`" contenteditable="true" spellcheck="false" v-html="event.jsCode"></code>
                                                <p> <strong class="callback">}</strong> <em class="return_type">{{ event.return_type }}</em> </p>
                                                <div class="d-flex justify-content-center mb-3">
                                                    <button v-if="state.savedEvents[event.name]?.isUsing" @click="updateModelValueAndSave(`codeArea_${index}_${i}`, event, {deleteEvent: true})" class="btn btn-sm btn-danger me-2 resetButton">Remove</button>
                                                    <button v-if="state.savedEvents[event.name]?.isUsing" @click="updateModelValueAndSave(`codeArea_${index}_${i}`, event, {updateEvent: true})" class="btn btn-sm btn-primary updateButton">Update</button>
                                                </div>
                                            </div>
                                        </div>    

                                    </div> 
                                </template>                  
                            </template>                            
                        </template>
                    </template>
                </template>
            </div>
        </div>
    </teleport>    
</template>
