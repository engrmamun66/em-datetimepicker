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
const desplayPositions = inject('desplayPositions');
const theme = inject('theme');
const isHexColor = inject('isHexColor');
let emits = defineEmits(['init', 'open', 'cancel', 'close', 'change', 'changeTime']);
let { target, options, teleportDiv, justInitializeValue } = defineProps({
    target: {
        type: [HTMLElement, Object],
        required: true,
        default: null,
    },
    options: {
        type: [Object],
        required: false,
        default: {},
    },
    teleportDiv: {
        type: [Object],
        required: false,
        default: {},
    },
    justInitializeValue: {
        type: [Boolean],
        required: false,
        default: {},
    },
});
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
    time: options?.timeFormat ?? (options?.use24Format ? 'HH:mm A' : 'hh:mm A'),
};
const color_vars_light = {
    body_bg: '#ffffff',
    primary_bg: '#12834f',
    bg_grey: '#e2e3ee',
    font_dark: '#444444',
    font_dark_low: '#777777',
    font_light: '#f7f7f7',
    date_disable: '#cacaca',
};
const defaults = {
    rangePicker: options?.rangePicker ?? false,
    displayFormat: options.onlyTimePicker ? FORMATS.time : (FORMATS.forDisplay + (options?.timePicker ? (' ' + FORMATS.time) : '')),
    startDate: makeDate(options?.startDate || new Date(), FORMATS.date),
    endDate: makeDate(options?.endDate || (options?.startDate || new Date()), FORMATS.date),
    minDate: options?.minDate || '',
    maxDate: options?.maxDate || '',
    adjustWeekday: options?.adjustWeekday ?? 0,
    buttons: {
        todayBtn: ((options?.buttons?.todayBtn && (typeof options?.buttons?.todayBtn) == 'boolean') ? 'Today' : options?.buttons?.todayBtn) ?? 'Today',
        cancelBtn: ((options?.buttons?.cancelBtn && (typeof options?.buttons?.cancelBtn) == 'boolean') ? 'Cancel' : options?.buttons?.cancelBtn) ?? 'Cancel',
        applyBtn: ((options?.buttons?.applyBtn && (typeof options?.buttons?.applyBtn) == 'boolean') ? 'Apply' : options?.buttons?.applyBtn) ?? 'Apply',
    },
    monthShorts: options?.monthShorts ?? [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
    row: (options.row && options.row >= 3 && options.row <= 10) ? options.row : 6,
    // With Time Picker
    timePicker: options?.onlyTimePicker ? true : (options?.timePicker ?? false),
    onlyTimePicker: options?.onlyTimePicker ?? false,
    minuteStep: (options?.minuteStep && options?.minuteStep >= 1 && options?.minuteStep <= 30) ? options?.minuteStep : 5,
    use24Format: FORMATS?.use24Format ?? false,
    timePickerUi: (options?.timePickerUi && ['classic', 'standard']?.includes(options?.timePickerUi)) ? options?.timePickerUi : 'standard',
    timePickerButtons: options?.timePickerButtons ?? false,
    endTimeAutoValid: options?.endTimeAutoValid ?? true,
    displayIn: ((options?.displayIn && desplayPositions.includes(options?.displayIn ?? 'modal'))) ? options?.displayIn : 'modal',
    theme: theme,
    colors: {
        // Just change -----> "primary_bg" to adjust color according any theme color
        body_bg: isHexColor(options?.colors?.body_bg) ? options?.colors?.body_bg : (theme=='light' ? color_vars_light.body_bg : '#0d111e'),
        primary_bg: isHexColor(options?.colors?.primary_bg) ? options?.colors?.primary_bg : (theme=='light' ? color_vars_light.primary_bg : color_vars_light.primary_bg),
        bg_grey: isHexColor(options?.colors?.bg_grey) ? options?.colors?.bg_grey : (theme=='light' ? color_vars_light.bg_grey : '#282f36'),
        font_dark: isHexColor(options?.colors?.font_dark) ? options?.colors?.font_dark : (theme=='light' ? color_vars_light.font_dark : color_vars_light.font_light),
        font_dark_low: isHexColor(options?.colors?.font_dark_low) ? options?.colors?.font_dark_low : (theme=='light' ? color_vars_light.font_dark_low : color_vars_light.font_dark_low),
        font_light: isHexColor(options?.colors?.font_light) ? options?.colors?.font_light : (theme=='light' ? color_vars_light.font_light : color_vars_light.font_dark),
        date_disable: isHexColor(options?.colors?.date_disable) ? options?.colors?.date_disable : (theme=='light' ? color_vars_light.date_disable : color_vars_light.font_dark),
    },
};

/**
 * This color variable must be samcolor_vars*.ll .vue files 
 * ...............
 * DateTimePicker.vue
 * TimePicker.vue
 * Buttons.vue
 * Modal.vue
 * SwitcherForDate.vue
 * SwitcherForTime.vue
*/

const {
    body_bg: color_body_bg,
    primary_bg: color_primary_bg,
    bg_grey: color_bg_grey,
    font_dark: color_font_dark,
    font_dark_low: color_font_dark_low,
    font_light: color_font_light,
    date_disable: color_date_disable,
} = defaults.colors
const color_transparent_1 = color_primary_bg + '3d';
const color_transparent_2 = color_primary_bg + '1c';
/* --------------- End color variables -------------- */

const OUTPUT_FORMAT = computed(()=>{
    if(defaults.onlyTimePicker) return FORMATS.time;
    else return FORMATS.output + (defaults.timePicker ? (' ' + FORMATS.time) : '');
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
            defaults.startDate = makeDate(defaults.minDate, FORMATS.date);
        }
    }
    if(defaults.maxDate){     
        if(new Date(defaults.endDate) > new Date(defaults.maxDate)){
            defaults.endDate = makeDate(defaults.maxDate, FORMATS.date);
        }
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

function makeDate(dateTime, format, {hour, minute}={}){
    if(!dateTime) return;
    if(dateTime instanceof Date){
        var date = dateTime;
    } else {
        var date = new Date(dateTime);
    }
    date.setHours(Number(hour ?? 0));
    date.setMinutes(Number(minute ?? 0));
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
const emitableData = computed(()=>{
    let { startDate, endDate, startTime, endTime } = pickerValues;
    if(defaults.onlyTimePicker){
        return { startTime, endTime };
    } else {  
        if(defaults.timePicker){
            return pickerValues
        } else {
            return { startDate, endDate };
        }
    }
});


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
    changePicker: function(emit=true){
        let { date1, date2 } = picker;
        let { hour: hour1, minute: minute1 } = picker.time1;
        let { hour: hour2, minute: minute2 } = picker.time2;
        
        picker.date1 = makeDate(picker.date1, FORMATS.date, { hour: hour1, minute: minute1 });
        picker.date2 = makeDate(picker.date2, FORMATS.date, { hour: hour2, minute: minute2 });

        pickerValues.startDate = makeDate(date1, OUTPUT_FORMAT.value, { hour: hour1, minute: minute1 });
        pickerValues.endDate = makeDate(date2, OUTPUT_FORMAT.value, { hour: hour2, minute: minute2 });
        
        if(emit){
            emits('change', emitableData.value);
            target.dispatchEvent(events.change(emitableData.value));
        }
    },
    changeTime: function(data){
        emits('changeTime', data);
        target.dispatchEvent(events.change(data));
    },
    setTargetValue: function() {      
        this.changePicker(false) // updating pickerValues 
        let { startDate, endDate, startTime, endTime } = pickerValues;
        let value;
        if(defaults.onlyTimePicker && defaults.timePicker){
            if(defaults.rangePicker){
                value = `${startTime || '12:00 AM'} - ${endTime || '12:00 AM'}`;
            } else {
                value = `${startTime || '12:00 AM'}`;
            }
        } else {
            if(defaults.rangePicker){
                value = `${startDate} - ${endDate}`;
            } else {
                value = `${startDate}`;
            }
        }
        
        if(target.tagName == 'INPUT'){
            target.value = value;
        } else {
            target.innerHTML = value;
        }
        target.setAttribute('data-empicker', JSON.stringify(value));
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
        fn.setTargetValue();
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
        fn.setTargetValue();
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
    onInitTimePicker: function (data) {
        fn.setTargetValue();
    },
    onCloseTimePicker: function (data) { 
        openTimePicker.value = false;
        fn.closePicker();
    },
    onOkTimePicker: function (data) { 
        openTimePicker.value = false;
        fn.changeTime(data);
        fn.setTargetValue();
        fn.changePicker();
        if(!data.do_not_hide){
            fn.closePicker();
        }
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
    const first_weekday_short = days?.[0]?.['weekday_short'];
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
            picker.time1.time = makeDate(defaults.startDate, 'hh:mm A');
            picker.time2.time = makeDate(defaults.endDate, 'hh:mm A');       
        }

        fn.setTargetValue();
        fn.initPicker();
        if(!defaults.onlyTimePicker){
            isMounted.value = true;
        }
    }

})

</script>

<template>
    <template v-if="!justInitializeValue && defaults.onlyTimePicker">
        <TimePicker :justInitializeValue="justInitializeValue"
        @init="fn.onInitTimePicker" 
        @close="fn.onCloseTimePicker" 
        @change="fn.onOkTimePicker" 
        v-if="defaults.timePicker">
        </TimePicker>
    </template>
    <template v-if="!justInitializeValue">
        <!-- days of month -->
        <template v-if="!defaults.onlyTimePicker">
            <template v-if="current_view=='days'">
                <div class="days-month-box content" @click.stop="false">
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
                            <div class="active fade-in">{{ day }}</div>            
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
                                class="fade-in"
                                :class="{ 
                                    'active':  (picker.date1 === picker.date2) && (picker.date1 === monthDay.date),
                                    'offset-date': !monthDay.currentMonth,
                                    'start-date': (monthDay.date === picker.date1) && (picker.date1 != picker.date2),
                                    'end-date': (monthDay.date === picker.date2) && (picker.date1 != picker.date2),
                                    'date-in-selected-range': fn.isInSelectedDate(monthDay),
                                    'hover-date': fn.isHoverDate(monthDay),
                                    'not-in-minmax-date': !fn.isInMinMaxDate(monthDay.date),
                                    ['theme-' + theme]: true,
                                }">
                                    {{ monthDay.day_index }}
                                </div>
                            </template>
                            <template v-else>
                                <div 
                                @click.stop="fn.onClickDay(monthDay)"
                                @dblclick.stop="fn.onClickApply()"
                                class="fade-in"
                                :class="{ 
                                    'active': monthDay.currentMonth && (new Date(picker.date1).getDate() == monthDay.day_index) ,
                                    'offset-date': !monthDay.currentMonth,
                                    ['theme-' + theme]: true,
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
                            <TimePicker :justInitializeValue="justInitializeValue"
                            @init="fn.onInitTimePicker"  
                            @close="fn.onCloseTimePicker" 
                            @change="fn.onOkTimePicker"></TimePicker>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else-if="current_view == 'months'">
                <div class="months-box content" @click.stop="false">
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
                <div class="months-box content" @click.stop="false">
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
    background-color: v-bind(color_body_bg);
    box-shadow: 0px 8px 32px rgba(0, 0, 0, .16);
    border-radius: 6px;
    width: fit-content;
}

header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 700;
    color: v-bind(color_font_dark);
}

header i {
    padding: 16px;
    border-radius: 50%;
    color: v-bind(color_font_dark);
    font-size: 20px;
    cursor: pointer;
}

header i:hover {
    /*background-color: #ECE0FD;*/
    background-color: v-bind(color_transparent_1);
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
    color: v-bind(color_font_dark);
}

.main-months>div {
    width: 82px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: v-bind(color_font_dark_low);
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
    color: v-bind(color_font_dark);
    transition: all 300ms;
}
.main-months>div.offset-date:not(.start-date):not(.end-date):not(.date-in-selected-range),
.main-days>div.offset-date:not(.start-date):not(.end-date):not(.date-in-selected-range) {
    color: v-bind(color_date_disable) !important;
}

main.box>div:not(.active):not(.offset-date):not(.date-in-selected-range):not(.start-date):not(.end-date):hover
 {
    background-color: v-bind(color_transparent_1);
    color: v-bind(color_font_dark);
    border-radius: 8px;
}

div.hover-date {
    background-color: v-bind(color_transparent_1) !important;
    color: v-bind(color_font_dark);
    border-radius: 0px !important;
}

main.box>div:not(.offset-date),
main.box>div:not(.offset-date).active 
{
    border-radius: 4px;
}

main.box>div:not(.offset-date).active {
    background: v-bind(color_primary_bg);
    font-weight: 700;
    position: relative;
}

main.box>div:not(.offset-date).theme-light.active {
    color: v-bind(color_font_light) !important;
}

main.box>div:not(.offset-date).theme-dark.active {
    color: v-bind(color_font_dark) !important;
}

main.box>div.start-date {
    background: v-bind(color_primary_bg);
    border-radius: 8px 0px 0px 8px;
}

main.box>div.start-date.theme-light {
    color: v-bind(color_font_light) !important;
}

main.box>div.start-date.theme-dark {
    color: v-bind(color_font_dark) !important;
}

main.box>div.end-date {
    background: v-bind(color_primary_bg);
    border-radius: 0px 8px 8px 0px;
}

main.box>div.end-date.theme-light {
    color: v-bind(color_font_light) !important;
}

main.box>div.end-date.theme-dark {
    color: v-bind(color_font_dark) !important;
}

main.box>div.date-in-selected-range {
    background: v-bind(color_transparent_1);
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
    color: v-bind(color_font_dark);
    background-color: v-bind(color_bg_grey);
}
.buttons.adjustment-weekday{
    flex-direction: column;
}
.buttons .btn-cancel:has(~.btn-apply){
    margin-right: 10px;
}
.buttons .btn-apply{
    color: v-bind(color_font_light);
    background-color: v-bind(color_primary_bg);
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out; /* Adjust the duration and timing function as needed */
}
</style>

