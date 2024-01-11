import './assets/css/module.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { send_css_in_header, minified_css } from './minified-css';
import { emitter, utils, components, services } from './import-hub';
if(window.location.host !== 'localhost'){
    send_css_in_header(minified_css);
  } 


const { 
    VITE_API_BASE_URL: baseURL, 
    VITE_ASSET_URL: assetURL,
    VITE_GOOGLE_MAP_API_KEY: mapAPIKey,
} = import.meta.env


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
    window.IS_DEV_APP = true
    app.mount('#appDevLocal');
} else {
    window.IS_DEV_APP = false;
    let app_div = document.createElement('div');
    app_div.id = 'rentmy-app';
    app_div.style.display = 'none';
    document.body.append(app_div);
    window.RENTMY_GLOBAL = RENTMY_GLOBAL
    window.RENTMY_GLOBAL.rentmy_customer_info = utils.cookie.getCookie('rentmy_customer_info');
    app
    .provide('global', {...window.RENTMY_GLOBAL, ...{ baseURL, assetURL }})
    .provide('utils', utils)
    .provide('emitter', emitter)
    .provide('services', services)
    .provide('components', components)
    .mount('#rentmy-app')
}



