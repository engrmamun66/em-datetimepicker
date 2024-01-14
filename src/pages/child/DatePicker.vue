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
    output: 'YYYY-MM-DD', //YYYY-MM-DD HH:mm:ss
    week_index: 'd', // 0 to 6
    day_index: 'D', // 1 to 31
    weekday_short: 'ddd', // Sat, Sun ...
    forDisplay: (options.displayFormat ?? 'DD MMM, YYYY'),
};
const TODAY = moment().format(FORMATS.output);
const defaults = {
    displayFormat: FORMATS.forDisplay,
    startDate: helper.makeDate(options?.startDate ?? TODAY, FORMATS.forDisplay),
    endDate: moment().date( options?.endDate ?? TODAY ).format( FORMATS.forDisplay ),
    rangePicker: options?.rangePicker ?? false,
    adjustWeekday: options?.adjustWeekday ?? 0,
    buttons: options?.buttons ?? true,
    monthShorts: [ 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dec' ],
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
    setElementValue: function() {
        if(target.tagName == 'INPUT'){
            let { startDate, endDate } = pickerValues;
            let _startDate = helper.makeDate(startDate, FORMATS.forDisplay);
            let _endDate = helper.makeDate(endDate, FORMATS.forDisplay);         

            let value = _startDate; 
            if(defaults.rangePicker){
                value = value + ' - ' + _endDate;
            }
            target.value = value;
        }
    },   
    /* -------------------------------------------------------------------------- */
    /*                           Start With Date Picker                           */
    /* -------------------------------------------------------------------------- */
    onClickDay: function ({date}) { 
        temp.date1 = date;
        temp.date2 = date;

        let { date1, date2 } = temp;
        pickerValues.startDate = date1;
        pickerValues.endDate = defaults.rangePicker ? date2 : date1; 

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
    onClickMonth: function (monthIndex) { 
        let date = new Date(temp.date1);
        date.setMonth(monthIndex);
        temp.date1 = helper.makeDate(date, FORMATS.output);
        current_view.value = 'days';
    },
    onClickNext: function () { 
        switch (current_view.value) {
            case 'days':
                temp.monthIndex += 1;
                break;        
            case 'months':
                
                break;        
            case 'years':
                
                break;        
            default:
                break;
        }
    },
    onClickPrev: function () { 
        switch (current_view.value) {
            case 'days':
                temp.monthIndex -= 1;
                break;        
            case 'months':
                
                break;        
            case 'years':
                
                break;        
            default:
                break;
        }
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
    let date = new Date(temp.date1);
    let year = date.getFullYear()
    const monthIndex = temp.monthIndex;
    const days = helper.daysOfMonth(year, monthIndex, FORMATS, {currentMonth: true});
    const first_weekday_short = days[0]['weekday_short'];
    temp.start_from = weekDays.value.findIndex(weekday => weekday === first_weekday_short);
    // Left tailing
    year = monthIndex==0 ? (year - 1) : year;
    const previous_month_days = helper.daysOfMonth(year, monthIndex - 1, FORMATS).slice(-temp.start_from);
    const days_after_left_tailing = [...previous_month_days, ...days];
    // Right tailing    
    year = monthIndex==11 ? (year + 1) : year;
    const next_month_days = helper.daysOfMonth(year, monthIndex + 1, FORMATS);
    const days_after_left_and_right_tailing = [...days_after_left_tailing, ...next_month_days];
    days_after_left_and_right_tailing.length = 35;
    return days_after_left_and_right_tailing;
});





onMounted(() => {
    // if(!isMounted.value){
        pickerValues.startDate = defaults.startDate;
        pickerValues.endDate = defaults.endDate;

        temp.date1 = defaults.startDate;
        temp.date2 = defaults.endDate;   
        temp.monthIndex = new Date(pickerValues.startDate).getMonth();   

        methods.setElementValue();
        methods.initPicker();
        isMounted.value = true;
    // }
 
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
                    <i class='bx bx-chevron-left' @click="methods.onClickPrev()"></i>
                    <span class="cp" @click="current_view = 'months'">{{ moment().month(temp.monthIndex).format('MMMM YYYY') }}</span>
                    <i class='bx bx-chevron-right' @click="methods.onClickNext()"></i>
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
                            @click.stop="monthDay.currentMonth ? methods.onClickDay(monthDay) : false"
                            @dblclick.stop="monthDay.currentMonth ? methods.onClickApply() : false"
                            :class="{ 
                                'active': monthDay.currentMonth && (new Date(temp.date1).getDate() == monthDay.day_index) ,
                                'offset-date': !monthDay.currentMonth,
                            }">
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
                    <template v-for="(monthShort, index) in defaults.monthShorts" :key="index">
                        <div class="active" @click="onClickMonth(index)">{{ monthShort }}</div>
                    </template>
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
    color: #777;
    transition: all 300ms;
}
.main-months>div:not(.offset-date),
.main-days>div:not(.offset-date)
 {
    cursor: pointer;
}

.main-days>div {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    transition: all 300ms;
}
.main-months>div.offset-date,
.main-days>div.offset-date {
    color: #d6d6d6 !important;
}

main.box>div:not(.offset-date):hover {
    background-color: #ECE0FD;
    border-radius: 8px;
}

main.box>div:not(.offset-date).active {
    background: #6200EE;
    border-radius: 8px;
    font-weight: 700;
    color: white;
    position: relative;
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

