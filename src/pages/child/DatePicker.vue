<script setup>
import { ref, computed, reactive, defineProps, onMounted, inject, defineEmits } from 'vue';
const { helper } = inject('utils');
let emits = defineEmits(['open', 'close', 'change'])
let { target, options, parentDiv } = defineProps(['target', 'options', 'parentDiv']);
const defaultOptions = {
    startDate: options?.rangePicker ?? new Date(),
    rangePicker: options?.rangePicker ?? false,
    adjustWeekday: options?.adjustWeekday ?? 0,
};
// let emDatetimepicker = inject('emDatetimepicker');

const current= reactive({
    day: ''
});
const picker= {};
picker.setStartDate = function  (date) {
    
}
picker.setEndDate = function  (date) {
    
}


const state = reactive({
    current_view: 'days',
    events: {
        open: function(data={}) {
            return helper.createEvent('picker:open', {picker, ...data})
        },
        close: function(data={}) {
            return helper.createEvent('picker:close', {picker, ...data})
        },
        change: function(data={}) {
            return helper.createEvent('picker:change', {picker, ...data})
        },
    },
    selected: {
        startDate: '',
        endDate: '',
        old: {
            startDate: '',
            endDate: '',
        }
    }, 
});

const get = {
    /**
     * @returns [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
    */
    weekDays: computed( () => { 
        const daysOfWeek = [];
        const adjust = defaultOptions.adjustWeekday;
        for (let i = 1; i <= 7; i++) {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + (i + adjust));

            const options = { weekday: 'short' };
            const dayOfWeek = currentDate.toLocaleDateString('en-IN', options);
            daysOfWeek.push(dayOfWeek);
        }
        return daysOfWeek;
    }),
    weekDays: computed( () => { 
        const monthIndex = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const firstDayOfMonth = new Date(currentYear, monthIndex, 1);
        const lastDayOfMonth = new Date(currentYear, monthIndex + 1, 0); 
        let days = [];
        const options = {
            weekday: 'long', // long or 'short', 'narrow'
            year: 'numeric', // numeric or '2-digit'
            month: 'long', // long or 'short', 'narrow'
            day: 'numeric', // numeric or '2-digit'
            hour: 'numeric', // numeric or '2-digit'
            minute: 'numeric', // numeric or '2-digit'
            second: 'numeric', // numeric or '2-digit'
            timeZoneName: 'short', // short or 'long'
        };       
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const currentDate = new Date(currentYear, monthIndex, day);
            console.log(currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        }

    }),


};




onMounted(() => {
    console.log('mounted');
    console.log(options);
    // target.dispatchEvent(state.events.open());
    console.log(fn.weekDays);
})

</script>

<template>

    <!-- Months of year -->
    <template v-if="state.current_view=='days'">
        <!-- days of month -->
        <div class="days-month-box content">
            <header>
                <i class='bx bx-chevron-left'></i>
                <span class="cp" @click="state.current_view = 'months'">January 2024</span>
                <i class='bx bx-chevron-right'></i>
            </header>
            <main class="main-weekdays">
                <template v-for="(day, index) in get.weekDays" :key="index">
                    <div class="active">{{ day }}</div>            
                </template>
            </main>
            <main class="main-days">
                <div class="active">1</div>
                <div class="">2</div>
                <div class="">3</div>
                <div class="">4</div>
                <div class="">5</div>
                <div class="">6</div>
                <div class="">7</div>
                <div class="">8</div>
                <div class="">9</div>
                <div class="">10</div>
                <div class="">11</div>
                <div class="">12</div>
                <div class="">13</div>
                <div class="">14</div>
                <div class="">15</div>
                <div class="">16</div>
                <div class="">17</div>
                <div class="">18</div>
                <div class="">19</div>
                <div class="">20</div>
                <div class="">21</div>
                <div class="">22</div>
                <div class="">23</div>
                <div class="">24</div>
                <div class="">25</div>
                <div class="">26</div>
                <div class="">27</div>
                <div class="">28</div>
                <div class="">29</div>
                <div class="">30</div>
                <div class="">31</div>
            </main>
        </div>
    </template>
    <template v-else-if="state.current_view == 'months'">
        <div class="months-box content">
            <header>
                <i class='bx bx-chevron-left'></i>
                <span class="cp" @click="state.current_view = 'years'">2024</span>
                <i class='bx bx-chevron-right'></i>
            </header>
            <main class="main-months">
                <div class="active" @click="state.current_view = 'days'">Jan</div>
                <div class="" @click="state.current_view = 'days'">Fev</div>
                <div class="" @click="state.current_view = 'days'">Mar</div>
                <div class="" @click="state.current_view = 'days'">Abr</div>
                <div class="" @click="state.current_view = 'days'">Mai</div>
                <div class="" @click="state.current_view = 'days'">Jun</div>
                <div class="" @click="state.current_view = 'days'">Jul</div>
                <div class="" @click="state.current_view = 'days'">Ago</div>
                <div class="" @click="state.current_view = 'days'">Set</div>
                <div class="" @click="state.current_view = 'days'">Out</div>
                <div class="" @click="state.current_view = 'days'">Nov</div>
                <div class="" @click="state.current_view = 'days'">Dez</div>
            </main>
        </div>
    </template>
    <template v-else-if="state.current_view == 'years'">
        <div class="months-box content">
            <header>
                <i class='bx bx-chevron-left'></i>
                <span></span>
                <i class='bx bx-chevron-right'></i>
            </header>
            <main class="main-months">
                <div class="" @click="state.current_view = 'months'">2013</div>
                <div class="" @click="state.current_view = 'months'">2014</div>
                <div class="" @click="state.current_view = 'months'">2015</div>
                <div class="" @click="state.current_view = 'months'">2016</div>
                <div class="" @click="state.current_view = 'months'">2017</div>
                <div class="" @click="state.current_view = 'months'">2018</div>
                <div class="" @click="state.current_view = 'months'">2019</div>
                <div class="" @click="state.current_view = 'months'">2020</div>
                <div class="" @click="state.current_view = 'months'">2021</div>
                <div class="" @click="state.current_view = 'months'">2022</div>
                <div class="" @click="state.current_view = 'months'">2023</div>
                <div class="active" @click="state.current_view = 'months'">2024</div>
            </main>
        </div>
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

main>div:hover {
    background-color: #ECE0FD;
    border-radius: 8px;
}

main>div.active {
    background: #6200EE;
    border-radius: 8px;
    font-weight: 700;
    color: white;
    position: relative;
}

main>div.active::after {
    content: '';
    width: 4px;
    height: 4px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    bottom: 6px;
}
</style>