<script setup>
import moment from 'moment/moment';
import { ref, computed, reactive, defineProps, onMounted, inject, provide, defineEmits } from 'vue';
import Buttons from './Buttons.vue';
import Switcher from './SwitcherForDate.vue';
import TimePicker from './TimePicker.vue';
const { helper } = inject('utils');
const isMounted = inject('isMounted');
const picker = inject('picker');
const pickerValues = inject('pickerValues');
let emits = defineEmits(['init', 'open', 'cancel', 'close', 'change', 'changeTime']);
let { target, options, parentDiv, justInitializeValue } = defineProps(['target', 'options', 'parentDiv', 'justInitializeValue']);
// options Example: https://docs.mobiscroll.com/javascript/eventcalendar#opt-eventOrder
const FORMATS = {
    date: 'YYYY-MM-DD', //YYYY-MM-DD HH:mm:ss
    output: 'YYYY-MM-DD', //YYYY-MM-DD HH:mm:ss
    week_index: 'd', // 0 to 6
    day_index: 'D', // 1 to 31
    weekday_short: 'ddd', // Sat, Sun ...
    forDisplay: (options.displayFormat ?? 'DD MMM, YYYY'),
    forHeading: 'MMMM YYYY',
    year: 'YYYY',
    month: 'MMMM',
    monthShort: 'MMM',
    time: options?.timeFormat ?? (options?.use24Format ? 'HH:mm' : 'hh:mm A'),
};
const defaults = {
    rangePicker: options?.rangePicker ?? false,
    displayFormat: options.onlyTimePicker ? FORMATS.time : (FORMATS.forDisplay + (options?.timePicker ? (' ' + FORMATS.time) : '')),
    startDate: makeDate(options?.startDate ?? new Date(), FORMATS.date),
    endDate: makeDate(options?.endDate ?? (options?.startDate || new Date()), FORMATS.date),
    minDate: options?.minDate ?? '',
    maxDate: options?.maxDate ?? '',
    adjustWeekday: options?.adjustWeekday ?? 0,
    buttons: (options?.buttons) ?? {
        todayBtn: options?.buttons?.todayBtn ?? 'Today',
        cancelBtn: options?.buttons?.cancelBtn ?? 'Cancel',
        applyBtn: options?.buttons?.cancelBtn ?? 'Apply',
    },
    monthShorts: options?.monthShorts ?? [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
    row: (options.row && options.row >= 3 && options.row <= 10) ? options.row : 6,
    // With Time Picker
    timePicker: options?.timePicker ?? false,
    onlyTimePicker: options?.onlyTimePicker ?? false,
    minuteStep: (options?.minuteStep && [1, 5, 10, 15, 30].includes(options?.minuteStep)) ? options?.minuteStep : 5,
    use24Format: FORMATS?.time ?? false,
    timeZone: options?.timeZone ?? '',
};

const OUTPUT_FORMAT = computed(()=>{
    return FORMATS.output + (defaults.timePicker ? (' ' + FORMATS.time) : '');
})


// Fliping Date when, start is larger than end date
if(new Date(defaults.startDate) > new Date(defaults.endDate)){
    let __d1 = defaults.startDate;
    let __d2 = defaults.endDate;
    defaults.startDate = __d2;
    defaults.endDate = __d1;
}

// Checking Min and Max date
if(defaults.minDate || defaults.maxDate){
    if(defaults.minDate){
        if(new Date(defaults.startDate) < new Date(defaults.minDate)){
            console.log('defaults.startDate', defaults.startDate);
            defaults.startDate = makeDate(defaults.minDate, FORMATS.date);
            console.log('defaults.startDate', defaults.startDate);
        }
    }
    if(defaults.maxDate){     
        if(new Date(defaults.endDate) > new Date(defaults.maxDate)){
            defaults.endDate = makeDate(defaults.maxDate, FORMATS.date);
        }
    }
}

if(defaults.timeZone){
    let _timezones = [
        'America/New_York',
        'Asia/Dhaka',
        'Europe/London',
        'Pacific/Honolulu',
        'Australia/Sydney',
        'Africa/Cairo',
        'Asia/Tokyo',
        'America/Los_Angeles',
        'Europe/Paris',
        'Asia/Kolkata',
    ];
    if(!_timezones.includes(defaults.timeZone)){
        defaults.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
}


let current_view = ref('days');
let selectingStartDate = ref(true);
let hoverDate = ref('');
let openTimePicker = ref(false);
provide('target', target);
provide('defaults', defaults);
provide('makeDate', makeDate);
provide('FORMATS', FORMATS);
provide('openTimePicker', openTimePicker);
provide('createEvent', createEvent);
provide('selectingStartDate', selectingStartDate);


const events = reactive( {
    init: function(data={}) {
        return createEvent('picker:init', {...data})
    },
    open: function(data={}) {
        return createEvent('picker:open', {...data})
    },
    cancel: function(data={}) {
        return createEvent('picker:cancel', {...data})
    },
    close: function(data={}) {
        return createEvent('picker:close', {...data})
    },
    change: function(data={}) {
        return createEvent('picker:change', {...data})
    },
    changeTime: function(data={}) {
        return createEvent('timepicker:change', {...data})
    },
});

function printTimeByZone(date) {
    const timeZone = defaults.timeZone;
    if(!timeZone || !date) return date;
    const currentDate = (date instanceof Date) ? date : new Date();
    const options = { timeZone: timeZone, hour12: !defaults.use24Format, hour: 'numeric', minute: 'numeric', /*second: 'numeric'*/ };
    const dateTimeFormatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = dateTimeFormatter.format(currentDate);
    console.log(`Current time in ${timeZone}: ${formattedDate}`);
}


function makeDate(dateTime, format, {hour, minute}={}){
    if(!dateTime) return;
    if(dateTime instanceof Date){
        var date = dateTime;
    } else {
        var date = new Date(dateTime);
    }
    if(hour) date.setHours(Number(hour) || 0);
    if(minute) date.setMinutes(Number(minute) || 0);
    let details = { 
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(), 
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
    };
    return moment().set(details).format(format);
}
globalThis.makeDate = makeDate;
function daysOfMonth(year, monthIndex, FORMATS, {currentMonth}={}) {
    const firstDayOfMonth = moment().year(year).month(monthIndex).date(1);
    const daysInMonth = firstDayOfMonth.daysInMonth();
    let days = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDay = firstDayOfMonth.date(day);
        const _day = {
            date: currentDay.format(FORMATS.date),
            week_index: currentDay.format(FORMATS.week_index),
            day_index: currentDay.format(FORMATS.day_index),
            weekday_short: currentDay.format(FORMATS.weekday_short),
            month_index: new Date(currentDay.format(FORMATS.date)).getMonth(),
            currentMonth: currentMonth ?? false,
        };
        days = [...days, _day];
    }
    return days;
}
function createEvent(eventName, data={}){
    return new CustomEvent(eventName, {
        bubbles: false,
        cancelable: false,
        detail: data,
    })
}


const fn = {     
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
        let { date1, date2 } = picker;
        let { hour: hour1, minute: minute1 } = picker.time1;
        let { hour: hour2, minute: minute2 } = picker.time2;
        
        picker.date1 = makeDate(picker.date1, FORMATS.date, { hour: hour1, minute: minute1 });
        picker.date2 = makeDate(picker.date2, FORMATS.date, { hour: hour2, minute: minute2 });

        pickerValues.startDate = makeDate(date1, OUTPUT_FORMAT.value, { hour: hour1, minute: minute1 });
        pickerValues.endDate = makeDate(date2, OUTPUT_FORMAT.value, { hour: hour2, minute: minute2 });
        
        emits('change');
        target.dispatchEvent(events.change(pickerValues));
    },
    changeTime: function(data){
        emits('changeTime');
        target.dispatchEvent(events.change(data));
    },
    setElementValue: function() {        
        let { startDate, endDate } = pickerValues;
        let _startDate = makeDate(startDate, FORMATS.forDisplay);
        let _endDate = makeDate(endDate, FORMATS.forDisplay);         

        let value = _startDate; 
        if(defaults.rangePicker){
            value = value + ' - ' + _endDate;
        }
        if(target.tagName == 'INPUT'){
            target.value = value;
        }
    },   
    emitData: function() {
        
    },   
    /* -------------------------------------------------------------------------- */
    /*                           Start With Date Picker                           */
    /* -------------------------------------------------------------------------- */
    isInMinMaxDate: function (_date) {
        let date = new Date(makeDate(_date, FORMATS.date));
        let minDate = new Date(makeDate(defaults.minDate, FORMATS.date));
        let maxDate = new Date(makeDate(defaults.maxDate, FORMATS.date));
        if(defaults.minDate && defaults.maxDate){
            return (date >= minDate) && (date <= maxDate);
        } 
        else if (!defaults.minDate && !defaults.maxDate){
            return true;
        }
        else if (defaults.minDate && !defaults.maxDate){
             return (date >= minDate);
        }
        else if (!defaults.minDate && defaults.maxDate){
             return (date <= maxDate);
        }
    },
    onClickDay: function ({date, currentMonth}) {
        if(!this.isInMinMaxDate(date)) return;
        if(defaults.rangePicker){
            if(selectingStartDate.value){
                // For Date 1
                picker.date2 = '';
                picker.date1 = date;
                selectingStartDate.value = false;
            } else {
                if(date >= picker.date1){
                    picker.date2 = date;
                    selectingStartDate.value = true;             

                    if(!defaults.buttons?.applyBtn){
                        this.onClickApply();
                    }
               } else {
                // return to ► For Date 1
                    picker.date2 = '';
                    picker.date1 = date;
                    selectingStartDate.value = false;
               }
                
            }           
            
        } else {
            picker.date = date;
            picker.date1 = date;
            picker.date2 = date; 

            if(!defaults.buttons?.applyBtn){
                this.onClickApply();
            }
        }
    },
    onClickApply: function () { 
        fn.setElementValue();
        this.changePicker();
        this.closePicker();
    },
    onClickToday: function () { 
        let date = makeDate(new Date(), FORMATS.date);
        picker.date = date;
        if(defaults.rangePicker){
            this.onClickDay({date});
            this.onClickDay({date});
        } else {
            this.onClickDay({date});
        }
        current_view.value = 'days';
        fn.setElementValue();
        this.changePicker();
        this.closePicker();
    },
    onClickMonth: function (monthIndex) { 
        let date = new Date(picker.date);
        date.setMonth(monthIndex);
        picker.date = makeDate(date, FORMATS.date);        
        current_view.value = 'days';
    },
    onClickYear: function (year) { 
        let date = new Date(picker.date);
        date.setFullYear(year);        
        date.setFullYear(year);
        picker.date = makeDate(date, FORMATS.date); 
        current_view.value = 'months';
    },
    onClickPrev: function () { 
        let date;
        switch (current_view.value) {
            case 'days':
                date = new Date(picker.date);
                date.setMonth(date.getMonth() - 1)
                picker.date = makeDate(date, FORMATS.date);
                break;        
            case 'years':
                if(years.value.includes(1924)) return;
                date = new Date(picker.date);
                date.setFullYear(date.getFullYear() - 12)
                picker.date = makeDate(date, FORMATS.date);
                break; 
        }
    },
    onClickNext: function () { 
        let date;
        switch (current_view.value) {
            case 'days':
                 date = new Date(picker.date);
                date.setMonth(date.getMonth() + 1)
                picker.date = makeDate(date, FORMATS.date);
                break;         
            case 'years':
                date = new Date(picker.date);
                date.setFullYear(date.getFullYear() + 12)
                picker.date = makeDate(date, FORMATS.date);
                break; 
        }
    },    
    /* -------------------------------------------------------------------------- */
    /*                               Check Functions                              */
    /* -------------------------------------------------------------------------- */
    isInSelectedDate: function ({date}) { 
        let { date1, date2 } = picker;
        let d1 = new Date(date1);
        let d2 = new Date(date2 || date1);
        let d3 = new Date(date);
        return d3 > d1 && d3 < d2;
    },
    isHoverDate: function ({date: loopDate}) { 
        let { date1, date2 } = picker;  
        if(!date2){ 
            return (
                (new Date(loopDate) <= new Date(hoverDate.value))
                && (new Date(date1) < new Date(hoverDate.value))
                && (new Date(loopDate) > new Date(date1))
            );
        }
        return false;
    },
    /* -------------------------------------------------------------------------- */
    /*                           with time picker emits                           */
    /* -------------------------------------------------------------------------- */
    onCloseTimePicker: function (data) { 
        console.log('here');
        console.log(openTimePicker);
        openTimePicker.value = false;
        this.closePicker(data);
    },
    onOkTimePicker: function (data) { 
        openTimePicker.value = false;
        this.changeTime(data);
        this.closePicker();
    },
};


// @returns [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
const weekDays = computed( () => { 
    const daysOfWeek = [];
    const adjust = defaults.adjustWeekday;
    for (let i = 1; i <= 7; i++) {
        const currentDate = new Date('1 Jan 2024');
        currentDate.setDate(currentDate.getDate() - 2 + adjust + i);
        const dayOfWeek = currentDate.toLocaleDateString('en-IN', { weekday: 'short' });
        daysOfWeek.push(dayOfWeek);
    }
    return daysOfWeek;
})
const monthOfDays = computed( () => { 
    let date = new Date(picker.date);
    const monthIndex = new Date(picker.date).getMonth();
    const days = daysOfMonth(date.getFullYear(), monthIndex, FORMATS, {currentMonth: true});
    const first_weekday_short = days[0]['weekday_short'];
    const startFrom = weekDays.value.findIndex(weekday => weekday === first_weekday_short);
    // Left tailing
    let _date = new Date(picker.date);
    _date.setMonth(_date.getMonth() - 1);
    const previous_month_days = daysOfMonth(_date.getFullYear(), _date.getMonth(), FORMATS).slice(-startFrom);
    const days_after_left_tailing = startFrom ? [...previous_month_days, ...days] : [...days];
    // Right tailing    
    let __date = new Date(picker.date);
    __date.setMonth(__date.getMonth() + 1);
    const next_month_days = daysOfMonth(__date.getFullYear(), __date.getMonth(), FORMATS);
    const days_after_left_and_right_tailing = [...days_after_left_tailing, ...next_month_days];
    days_after_left_and_right_tailing.length = defaults.row * 7;
    return days_after_left_and_right_tailing;
});
const years = computed(() => {
    let limit = 12
    let start = new Date(picker.date).getFullYear();
    let end = start + limit;
    let rangeArray = Array.from({ length: end - start }, (_, index) => start - index);
    rangeArray = rangeArray.sort((a, b) => {
        if(a - b){
            return -1;
        } else {
            1
        }
    })    
    return rangeArray;
})


/* -------------------------------------------------------------------------- */
/*                                  onMounted                                 */
/* -------------------------------------------------------------------------- */
onMounted(() => {
    if(!isMounted.value){        

        pickerValues.startDate = defaults.startDate;
        pickerValues.endDate = defaults.endDate;

        picker.date = makeDate(defaults.startDate, FORMATS.date);
        picker.date1 = makeDate(defaults.startDate, FORMATS.date);
        picker.date2 = makeDate(defaults.endDate, FORMATS.date); 

        if(defaults.timePicker){
            picker.time1 = makeDate(defaults.startDate, FORMATS.time);
            picker.time2 = makeDate(defaults.endDate, FORMATS.time);             
        }

        fn.setElementValue();
        fn.initPicker();
        isMounted.value = true;
    }

})

</script>

<template>
    <template v-if="!justInitializeValue && defaults.onlyTimePicker">
        <TimePicker @close="onCloseTimePicker" v-if="defaults.timePicker"></TimePicker>
    </template>
    <template v-if="!justInitializeValue">
        <!-- days of month -->
        <template v-if="!defaults.onlyTimePicker">
            <template v-if="current_view=='days'">
                <div class="days-month-box content">
                    <header>
                        <i class='bx bx-chevron-left' @click="fn.onClickPrev()"></i>
                        <span class="cp" @click="current_view = 'months'">
                            <!-- {{ makeDate(monthOfDays.filter(d => d.currentMonth)[0]?.date, FORMATS.forHeading) }} -->
                            {{ makeDate(monthOfDays.filter(d => d.currentMonth)[0]?.date, FORMATS.forHeading) }}
                        </span>
                        <i class='bx bx-chevron-right' @click="fn.onClickNext()"></i>
                    </header>
                    <Switcher v-if="defaults.rangePicker"></Switcher>
                    <main class="main-weekdays">
                        <template v-for="(day, index) in weekDays" :key="index">
                            <div class="active">{{ day }}</div>            
                        </template>
                    </main>
                    <main class="main-days box" :class="{'rangePicker': defaults.rangePicker}">
                        <template v-for="(monthDay, index) in monthOfDays" :key="index">
                            <template v-if="defaults.rangePicker">
                                <div 
                                @click.stop="fn.onClickDay(monthDay)"
                                @dblclick.stop="()=>{
                                    if(picker.date1 && picker.date2){
                                        /**Reseting to re-select*/
                                        picker.date2 = '';
                                        picker.date1 = monthDay.date;
                                        selectingStartDate.value = true;
                                    }
                                }"
                                @mouseenter="hoverDate = monthDay.date"
                                :class="{ 
                                    'active':  (picker.date1 === picker.date2) && (picker.date1 === monthDay.date),
                                    'offset-date': !monthDay.currentMonth,
                                    'start-date': (monthDay.date === picker.date1) && (picker.date1 != picker.date2),
                                    'end-date': (monthDay.date === picker.date2) && (picker.date1 != picker.date2),
                                    'date-in-selected-range': fn.isInSelectedDate(monthDay),
                                    'hover-date': fn.isHoverDate(monthDay),
                                    'not-in-minmax-date': !fn.isInMinMaxDate(monthDay.date),
                                }">
                                    {{ monthDay.day_index }}
                                </div>
                            </template>
                            <template v-else>
                                <div 
                                @click.stop="fn.onClickDay(monthDay)"
                                @dblclick.stop="fn.onClickApply()"
                                :class="{ 
                                    'active': monthDay.currentMonth && (new Date(picker.date1).getDate() == monthDay.day_index) ,
                                    'offset-date': !monthDay.currentMonth,
                                }">
                                    {{ monthDay.day_index }}
                                </div>
                            </template>
                        </template>
                    </main>
                    <Buttons
                    :defaults="defaults"
                    @onCancel="fn.cancelPicker()"
                    @onApply="fn.onClickApply()"
                    @onToday="fn.onClickToday()"
                    ></Buttons>
                    
                    <div v-if="openTimePicker==true" class="time-picker-display-area" @click.stop="openTimePicker=false">
                        <div>
                            <TimePicker @close="openTimePicker=false"></TimePicker>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else-if="current_view == 'months'">
                <div class="months-box content">
                    <header>
                        <i class='bx bx-chevron-left visibility-hidden'></i>
                        <span class="cp" @click="current_view = 'years'">{{ makeDate(picker?.date1, FORMATS.month) }}</span>
                        <i class='bx bx-chevron-right visibility-hidden'></i>
                    </header>
                    <main class="main-months box">
                        <template v-for="(monthShort, index) in defaults.monthShorts" :key="index">
                            <div 
                            :class="{'active': makeDate(picker?.date1, FORMATS.monthShort) === monthShort}" 
                            @click="fn.onClickMonth(index)">{{ monthShort }}</div>
                        </template>
                    </main>
                    <Buttons
                    :defaults="defaults"
                    @onCancel="fn.cancelPicker()"
                    @onApply="fn.onClickApply()"
                    @onToday="fn.onClickToday()"
                    :applyBtn="false"
                    ></Buttons>
                </div>
            </template>
            <template v-else-if="current_view == 'years'">
                <div class="months-box content">
                    <header>
                        <i class='bx bx-chevron-left' @click="fn.onClickPrev()"></i>
                        <span>{{ years[0] }} - {{ years[years?.length - 1] }}</span>
                        <i class='bx bx-chevron-right' @click="fn.onClickNext()"></i>
                    </header>
                    <main class="main-months box">
                        <template v-for="(year, index) in years" :key="index">
                            <div 
                            :class="{'active': new Date(picker.date1).getFullYear() == year}" 
                            @click="fn.onClickYear(year)"> {{ year }}</div>
                        </template>
                    </main>
                    <Buttons
                    :defaults="defaults"
                    @onCancel="fn.cancelPicker()"
                    @onApply="fn.onClickApply()"
                    @onToday="fn.onClickToday()"
                    :applyBtn="false"
                    ></Buttons>
                </div>
            </template>
        </template>        
    </template>



</template>


<style scoped>
.content {
    display: grid;
    grid-template-rows: 40px 1fr;
    gap: 20px;
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
    gap: 0px;
    row-gap: 4px;
}
.main-weekdays>div{
    text-align: center;
}

.main-months>div {
    width: 82px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #777;
    transition: all 300ms;
}
.main-months>div,
.main-days>div
 {
    cursor: pointer;
}

.main-days>div {
    width: 50px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    transition: all 300ms;
}
.main-months>div.offset-date:not(.start-date):not(.end-date):not(.date-in-selected-range),
.main-days>div.offset-date:not(.start-date):not(.end-date):not(.date-in-selected-range) {
    color: #d6d6d6 !important;
}

main.box>div:not(.active):not(.offset-date):not(.date-in-selected-range):not(.start-date):not(.end-date):hover
 {
    background-color: #ECE0FD;
    border-radius: 8px;
}

div.hover-date {
    background-color: #ECE0FD !important;
    border-radius: 0px !important;
}

main.box>div:not(.offset-date).active {
    background: #6200EE;
    border-radius: 8px;
    font-weight: 700;
    color: white;
    position: relative;
}

main.box>div.start-date {
    background: #6200EE;
    color: #d6d6d6 !important;
    border-radius: 8px 0px 0px 8px;
}

main.box>div.end-date {
    background: #6200EE;
    color: #d6d6d6 !important;
    border-radius: 0px 8px 8px 0px;
}

main.box>div.date-in-selected-range {
    background: #6300ee1c;
    border-radius: 0px;
}

.buttons{
    display: flex;
    justify-content: end;
}
.buttons .btn-cancel, .btn-apply{
    padding: 6px 10px;
    border:none;
    text-align: center;
    border-radius: 4px;
}
.buttons .btn-cancel{
    color: black;
    background-color: #e2e3ee;
}
.buttons.adjustment-weekday{
    flex-direction: column;
}
.buttons .btn-cancel:has(~.btn-apply){
    margin-right: 10px;
}
.buttons .btn-apply{
    color: white;
    background-color: #6200EE;
}
.visibility-hidden{
    visibility: hidden;
    pointer-events: none;
}
.not-in-minmax-date{
    text-decoration: line-through;
    cursor: no-drop !important;
}
div:has(>.time-picker-display-area){
    position: relative;
}
.time-picker-display-area{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 9999999;
    background-color: #0000008a;
    backdrop-filter: blur(0px);
}
.time-picker-display-area{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 9999999;
    background-color: #0000008a;
    -webkit-backdrop-filter: blur(0px);
    backdrop-filter: blur(0px);
}
.time-picker-display-area>div {
    animation: modalOpen .3s ease-out forwards;
    box-shadow: 0 4px 96px #0000004d;
}
@keyframes modalOpen {
  from {
    opacity: 0;
    transform: translate(0%, 60%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(0%, 0%) scale(1);
  }
}
</style>

