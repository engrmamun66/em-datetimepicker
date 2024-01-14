<script setup>
import { ref, computed, reactive, defineProps, onMounted, inject, defineEmits } from 'vue';
import CancelAndApplyButton from './CancelAndApplyButton.vue'
const { helper } = inject('utils');
const isMounted = inject('isMounted');
const temp = inject('temp');
const pickerValues = inject('pickerValues');
let emits = defineEmits(['init', 'open', 'cancel', 'close', 'change']);
let { target, options, parentDiv, justInitializeValue } = defineProps(['target', 'options', 'parentDiv', 'justInitializeValue']);
const moment = globalThis.moment;
// local Example: https://docs.mobiscroll.com/javascript/languages
const FORMATS = {
    default: 'lll', //YYYY-MM-DD HH:mm:ss
    db: 'YYYY-MM-DD', //YYYY-MM-DD HH:mm:ss
    week_index: 'd', // 0 to 6
    day_index: 'D', // 1 to 31
    weekday_short: 'ddd', // Sat, Sun ...
    forDisplay: (options.displayFormat ?? 'DD MMM, YYYY'),
};
const TODAY = moment().format(FORMATS.db);
const defaults = {
    displayFormat: FORMATS.forDisplay,
    startDate: moment().date( options?.startDate ?? TODAY ).format( FORMATS.forDisplay ),
    endDate: moment().date( options?.endDate ?? TODAY ).format( FORMATS.forDisplay ),
    rangePicker: options?.rangePicker ?? false,
    adjustWeekday: options?.adjustWeekday ?? 0,
    buttons: options?.buttons ?? true,
}; 
let current_view = ref('days');

const events = reactive( {
    init: function(data={}) {
        return helper.createEvent('picker:init', {...data})
    },
    open: function(data={}) {
        return helper.createEvent('picker:open', {...data})
    },
    cancel: function(data={}) {
        return helper.createEvent('picker:cancel', {...data})
    },
    close: function(data={}) {
        return helper.createEvent('picker:close', {...data})
    },
    change: function(data={}) {
        return helper.createEvent('picker:change', {...data})
    },
});

const methods = {     
    initPicker: function(){
        emits('init');
        target.dispatchEvent(events.init());
    },
    openPicker: function(){
        emits('open');
        target.dispatchEvent(events.open());
    },
    cancelPicker: function(){
        emits('cancel');
        target.dispatchEvent(events.cancel());
    },
    closePicker: function(){
        emits('close');
        target.dispatchEvent(events.close());
    },
    changePicker: function(){
        emits('change');
        target.dispatchEvent(events.change(pickerValues));
    },
    makeDate: function(dateTimeString, format){
        let date = new Date(dateTimeString);
        return moment().set({ 
            year: date.getFullYear(), 
            month: date.getMonth(),
            date: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
            }).format(format);

    },
    setElementValue: function() {
        if(target.tagName == 'INPUT'){
            let { startDate, endDate } = pickerValues;
            let _startDate = this.makeDate(startDate, FORMATS.forDisplay);
            let _endDate = this.makeDate(endDate, FORMATS.forDisplay);         

            let value = _startDate; 
            if(defaults.rangePicker){
                value = value + ' - ' + _endDate;
            }

            console.log('value', value);
            target.value = value;
        }
    },   
    /* -------------------------------------------------------------------------- */
    /*                           Start With Date Picker                           */
    /* -------------------------------------------------------------------------- */
    onClickDay: function ({date}) { 
        let range = defaults.rangePicker; 
        temp.date1 = date;
        temp.date2 = date;

        let { date1, date2 } = temp;
        pickerValues.startDate = date1;
        pickerValues.endDate = range ? date2 : date1; 

        if(!defaults.buttons){
            methods.setElementValue();
            this.changePicker();
            this.closePicker();
        }
    },
    onClickApply: function () { 
        methods.setElementValue();
        this.changePicker();
        this.closePicker();
    },
};





// @returns [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
const weekDays = computed( () => { 
    const daysOfWeek = [];
    const adjust = defaults.adjustWeekday;
    for (let i = 1; i <= 7; i++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + (i + adjust));

        const options = { weekday: 'short' };
        const dayOfWeek = currentDate.toLocaleDateString('en-IN', options);
        daysOfWeek.push(dayOfWeek);
    }
    return daysOfWeek;
})
const monthOfDays = computed( () => { 
    const monthIndex = new Date(defaults.startDate || TODAY).getMonth();
    let days = helper.printDaysOfMonth(monthIndex, FORMATS);
    return days;
});





onMounted(() => {
    if(!isMounted.value){
        pickerValues.startDate = defaults.startDate;
        pickerValues.endDate = defaults.endDate;
        methods.setElementValue();
        methods.initPicker();
        isMounted.value = true;
    }

    // Reset temp data
    temp.date1 = null;
    temp.date2 = null;
 
    // console.log(monthOfDays.value);
    // console.log(defaults); 
})

</script>

<template>
    <template v-if="!justInitializeValue">
        <!-- Months of year -->
        <template v-if="current_view=='days'">
            <!-- days of month -->
            <div class="days-month-box content">
                <header>
                    <i class='bx bx-chevron-left'></i>
                    <span class="cp" @click="current_view = 'months'">January 2024</span>
                    <i class='bx bx-chevron-right'></i>
                </header>
                <main class="main-weekdays">
                    <template v-for="(day, index) in weekDays" :key="index">
                        <div class="active">{{ day }}</div>            
                    </template>
                </main>
                <main class="main-days box">
                    <template v-for="(monthDay, index) in monthOfDays" :key="index">
                        <template v-if="monthDay">
                            <div 
                            @click="methods.onClickDay(monthDay)"
                            :class="{ 'active': (new Date(temp.date1 || pickerValues.startDate).getDate() == monthDay.day_index) }">
                                {{ monthDay.day_index }}
                            </div>
                        </template>
                    </template>
                </main>
                <CancelAndApplyButton
                :defaults="defaults"
                @onCancel="methods.cancelPicker()"
                @onApply="methods.onClickApply()"
                ></CancelAndApplyButton>
            </div>
        </template>
        <template v-else-if="current_view == 'months'">
            <div class="months-box content">
                <header>
                    <i class='bx bx-chevron-left'></i>
                    <span class="cp" @click="current_view = 'years'">2024</span>
                    <i class='bx bx-chevron-right'></i>
                </header>
                <main class="main-months box">
                    <div class="active" @click="current_view = 'days'">Jan</div>
                    <div class="" @click="current_view = 'days'">Fev</div>
                    <div class="" @click="current_view = 'days'">Mar</div>
                    <div class="" @click="current_view = 'days'">Abr</div>
                    <div class="" @click="current_view = 'days'">Mai</div>
                    <div class="" @click="current_view = 'days'">Jun</div>
                    <div class="" @click="current_view = 'days'">Jul</div>
                    <div class="" @click="current_view = 'days'">Ago</div>
                    <div class="" @click="current_view = 'days'">Set</div>
                    <div class="" @click="current_view = 'days'">Out</div>
                    <div class="" @click="current_view = 'days'">Nov</div>
                    <div class="" @click="current_view = 'days'">Dez</div>
                </main>
            </div>
        </template>
        <template v-else-if="current_view == 'years'">
            <div class="months-box content">
                <header>
                    <i class='bx bx-chevron-left'></i>
                    <span></span>
                    <i class='bx bx-chevron-right'></i>
                </header>
                <main class="main-months box">
                    <div class="" @click="current_view = 'months'">2013</div>
                    <div class="" @click="current_view = 'months'">2014</div>
                    <div class="" @click="current_view = 'months'">2015</div>
                    <div class="" @click="current_view = 'months'">2016</div>
                    <div class="" @click="current_view = 'months'">2017</div>
                    <div class="" @click="current_view = 'months'">2018</div>
                    <div class="" @click="current_view = 'months'">2019</div>
                    <div class="" @click="current_view = 'months'">2020</div>
                    <div class="" @click="current_view = 'months'">2021</div>
                    <div class="" @click="current_view = 'months'">2022</div>
                    <div class="" @click="current_view = 'months'">2023</div>
                    <div class="active" @click="current_view = 'months'">2024</div>
                </main>
            </div>
        </template>
    </template>
</template>


<style scoped>
.content {
    display: grid;
    grid-template-rows: 40px 1fr;
    gap: 24px;
    padding: 32px;
    background-color: #fff;
    box-shadow: 0px 8px 32px rgba(0, 0, 0, .16);
    border-radius: 6px;
    width: fit-content;
}

header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 700;
    color: #333;
}

header i {
    padding: 16px;
    border-radius: 50%;
    color: #666;
    font-size: 20px;
    cursor: pointer;
}

header i:hover {
    background-color: #ECE0FD;
}

.main-months {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.main-weekdays,
.main-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
}

.main-months>div {
    width: 82px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    cursor: pointer;
    transition: all 300ms;
}

.main-days>div {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    cursor: pointer;
    transition: all 300ms;
}

main.box>div:hover {
    background-color: #ECE0FD;
    border-radius: 8px;
}

main.box>div.active {
    background: #6200EE;
    border-radius: 8px;
    font-weight: 700;
    color: white;
    position: relative;
}

.----main.box>div.active::after {
    content: '';
    width: 4px;
    height: 4px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    bottom: 6px;
}
.buttons{
    display: flex;
    justify-content: end;
}
.buttons .btn-cancel, .btn-apply{
    padding: 6px 15px;
    border:none;
    text-align: center;
    border-radius: 4px;
}
.buttons .btn-cancel{
    color: black;
    background-color: #e2e3ee;
}
.buttons .btn-cancel:has(~.btn-apply){
    margin-right: 10px;
}
.buttons .btn-apply{
    color: white;
    background-color: #6200EE;
}
</style>

