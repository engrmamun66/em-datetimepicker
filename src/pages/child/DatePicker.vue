<script setup>
import { ref, computed, reactive, defineProps, onMounted, inject, defineEmits } from 'vue';
import Buttons from './Buttons.vue'
const { helper } = inject('utils');
const isMounted = inject('isMounted');
const picker = inject('picker');
const pickerValues = inject('pickerValues');
let emits = defineEmits(['init', 'open', 'cancel', 'close', 'change']);
let { target, options, parentDiv, justInitializeValue } = defineProps(['target', 'options', 'parentDiv', 'justInitializeValue']);
const moment = globalThis.moment;
// local Example: https://docs.mobiscroll.com/javascript/languages
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
};
const TODAY = moment().format(FORMATS.date);
const defaults = {
    displayFormat: FORMATS.forDisplay,
    startDate: makeDate(options?.startDate ?? TODAY, FORMATS.displayFormat),
    endDate: moment().date( options?.endDate ?? TODAY ).format( FORMATS.displayFormat ),
    rangePicker: options?.rangePicker ?? false,
    adjustWeekday: options?.adjustWeekday ?? 0,
    buttons: (options?.buttons) ?? {
        todayBtn: options?.buttons?.todayBtn ?? 'Today',
        cancelBtn: options?.buttons?.cancelBtn ?? 'Cancel',
        applyBtn: options?.buttons?.cancelBtn ?? 'Apply',
    },
    monthShorts: options?.monthShorts ?? [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
    row: (options.row && options.row >= 3 && options.row <= 10) ? options.row : 6,
}; 
let current_view = ref('days');
let selectingStartDate = ref(true);
let hoverDate = ref('');

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
});

function makeDate(dateTime, format){
    if(!dateTime) return;
    if(dateTime instanceof Date){
        var date = dateTime;
    } else {
        var date = new Date(dateTime);
    }
    return moment().set({ 
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(), 
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        }).format(format);
}
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
        emits('change');
        target.dispatchEvent(events.change(pickerValues));
    },
    setElementValue: function() {
        if(target.tagName == 'INPUT'){
            let { startDate, endDate } = pickerValues;
            let _startDate = makeDate(startDate, FORMATS.forDisplay);
            let _endDate = makeDate(endDate, FORMATS.forDisplay);         

            let value = _startDate; 
            if(defaults.rangePicker){
                value = value + ' - ' + _endDate;
            }
            target.value = value;
        }
    },   
    emitData: function() {
        
    },   
    /* -------------------------------------------------------------------------- */
    /*                           Start With Date Picker                           */
    /* -------------------------------------------------------------------------- */
    onClickDay: function ({date}) {
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
               } else {
                // return to ► For Date 1
                    picker.date2 = '';
                    picker.date1 = date;
                    selectingStartDate.value = false;
               }
                if(!defaults.buttons){
                    fn.setElementValue();
                    this.changePicker();
                    this.closePicker();
                }
            }           
            
        } else {
            picker.date1 = date;
            picker.date2 = date;        

            let { date1, date2 } = picker;
            pickerValues.startDate = date1;
            pickerValues.endDate = defaults.rangePicker ? date2 : date1; 

            if(!defaults.buttons){
                fn.setElementValue();
                this.changePicker();
                this.closePicker();
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
        if(defaults.rangePicker){
            this.onClickDay({date});
            this.onClickDay({date});
        } else {
            this.onClickDay({date});
        }
        current_view.value = 'days';
    },
    onClickMonth: function (monthIndex) { 
        let date = new Date(picker.date1);
        date.setMonth(monthIndex);
        picker.date1 = picker.date2 = makeDate(date, FORMATS.date);        
        current_view.value = 'days';
    },
    onClickYear: function (year) { 
        let date = new Date(picker.date1);
        date.setFullYear(year);        
        date.setFullYear(year);
        picker.date1 = picker.date2 = makeDate(date, FORMATS.date); 
        current_view.value = 'months';
    },
    onClickPrev: function () { 
        switch (current_view.value) {
            case 'days':
                    picker.monthIndex -= 1;
                break;        
            case 'years':
                picker.yearIndex = picker.yearIndex + 1;
                break; 
        }
    },
    onClickNext: function () { 
        switch (current_view.value) {
            case 'days':
                picker.monthIndex += 1;
                break;         
            case 'years':
                if(picker.yearIndex > 0){
                    picker.yearIndex = picker.yearIndex - 1;
                }
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
};


// @returns [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
const weekDays = computed( () => { 
    const daysOfWeek = [];
    const adjust = defaults.adjustWeekday;
    for (let i = 1; i <= 7; i++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + i - 1 + adjust);
        const dayOfWeek = currentDate.toLocaleDateString('en-IN', { weekday: 'short' });
        daysOfWeek.push(dayOfWeek);
    }
    return daysOfWeek;
})
const monthOfDays = computed( () => { 
    let date = new Date(picker.date1);
    const monthIndex = picker.monthIndex;
    const days = daysOfMonth(date.getFullYear(), monthIndex, FORMATS, {currentMonth: true});
    const first_weekday_short = days[0]['weekday_short'];
    const startFrom = weekDays.value.findIndex(weekday => weekday === first_weekday_short);
    // Left tailing
    let _date = new Date(picker.date1);
    _date.setMonth(_date.getMonth() - 1);
    const previous_month_days = daysOfMonth(_date.getFullYear(), _date.getMonth(), FORMATS).slice(-startFrom);
    const days_after_left_tailing = startFrom ? [...previous_month_days, ...days] : [...days];
    // Right tailing    
    let __date = new Date(picker.date1);
    __date.setMonth(__date.getMonth() + 1);
    const next_month_days = daysOfMonth(__date.getFullYear(), __date.getMonth(), FORMATS);
    const days_after_left_and_right_tailing = [...days_after_left_tailing, ...next_month_days];
    days_after_left_and_right_tailing.length = defaults.row * 7;
    return days_after_left_and_right_tailing;
});
const years = computed(() => {
    let limit = 12
    let start = new Date().getFullYear() - (picker.yearIndex * limit);
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

        picker.date1 = makeDate(defaults.startDate, FORMATS.date);
        picker.date2 = makeDate(defaults.endDate, FORMATS.date);
        picker.monthIndex = new Date(pickerValues.startDate).getMonth();   

        fn.setElementValue();
        fn.initPicker();
        isMounted.value = true;
    }
})

</script>

<template>
    <template v-if="!justInitializeValue">
        <!-- days of month -->
        <template v-if="current_view=='days'">
            <div class="days-month-box content">
                <header>
                    <i class='bx bx-chevron-left' @click="fn.onClickPrev()"></i>
                    <span class="cp" @click="current_view = 'months'">{{ makeDate(monthOfDays.filter(d => d.currentMonth)[0]?.date, FORMATS.forHeading) }}</span>
                    <i class='bx bx-chevron-right' @click="fn.onClickNext()"></i>
                </header>
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
                <pre>
                    {{ picker }}
                </pre>
                <Buttons
                :defaults="defaults"
                @onCancel="fn.cancelPicker()"
                @onApply="fn.onClickApply()"
                @onToday="fn.onClickToday()"
                ></Buttons>
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
    gap: 0px;
    row-gap: 4px;
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
.main-months>div.offset-date:not(.start-date):not(.end-date),
.main-days>div.offset-date:not(.start-date):not(.end-date) {
    color: #d6d6d6 !important;
}

main.box>div:not(.offset-date):not(.date-in-selected-range):not(.start-date):not(.end-date):hover
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
.visibility-hidden{
    visibility: hidden;
    pointer-events: none;
}
</style>

