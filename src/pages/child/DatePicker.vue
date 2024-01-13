<script setup>
import { ref, reactive, defineProps, onMounted } from 'vue';
let { target, parentDiv } = defineProps(['target', 'parentDiv']);

const state = reactive({
    current_view: 'days',
});

onMounted(() => {
    console.log('target', target);
    console.log('parentDiv', parentDiv);
})

</script>

<template>

    <!-- Months of year -->
    <template v-if="state.current_view=='days'">
        <!-- days of month -->
        <div id="dayMonth" class="days-month-box content">
            <header>
                <i class='bx bx-chevron-left'></i>
                <span class="cp" @click="state.current_view = 'months'">J`ANEIRO 2024</span>
                <i class='bx bx-chevron-right'></i>
            </header>
            <main class="main-days">
                <div class="">1</div>
                <div class="">2</div>
                <div class="">3</div>
                <div class="">4</div>
                <div class="">5</div>
                <div class="">6</div>
                <div class="">7</div>
                <div class="">8</div>
                <div class="">9</div>
                <div class="">10</div>
                <div class="active">11</div>
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
    border-radius: 16px;
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