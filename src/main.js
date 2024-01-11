import './assets/css/module.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { emitter, utils, components } from './import-hub';

const { VITE_THEME } = import.meta.env


/**
  We using global event. That's loading from our plugin
  If for some reason the file is not loaded, thi code will help to avoid fatal error
 */
if(typeof RentMyEvent == 'undefined'){    
    window.RentMyEvent = {
        on: (eventName, callback)=> null,
        emit: (eventName, data, useFilter=true)=> null,
        off: (eventName, callback)=> null,
        off_all: (eventName)=> null,
        add_action: (eventName, callback)=> null,
        do_action: (eventName, data, useFilter=true)=> null,
        remove_action: (eventName, callback)=> null,
        remove_actions: (eventName)=> null,
        add_filter: (filterName, callback)=> null,
        apply_filters: (filterName, data)=> data,
        remove_filter: (filterName, callback)=> null,
        remove_filters: (filterName)=> null,
        clearAll(){}
    };
} 


const app = createApp(App)
app.use(createPinia())

if(document.getElementById('appDevLocal')){
    app.mount('#appDevLocal');
} else {
    let app_div = document.createElement('div');
    app_div.id = 'rentmy-app';
    app_div.style.display = 'none';
    document.body.append(app_div);
    app
    .provide('utils', utils)
    .provide('emitter', emitter)
    .provide('components', components)
    .mount('#emdatepicker-app')
}



