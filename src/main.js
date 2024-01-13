import './assets/css/module.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import emDatetimepicker from './EventEmitter';
import { emitter, utils, components } from './import-hub';

globalThis.emDatetimepicker = emDatetimepicker; 

const app = createApp(App)
app.use(createPinia())

window.addEventListener("DOMContentLoaded", (e) => {
    let app_div = document.createElement('div');
    app_div.id = 'em-datepicker-app';
    app_div.style.display = 'none';
    document.body.append(app_div);
    app
    .provide('utils', utils)
    .provide('emitter', emitter)
    .provide('components', components)
    .provide('emDatetimepicker', emDatetimepicker)
    .mount('#em-datepicker-app');
})