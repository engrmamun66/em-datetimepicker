<script setup>
import EmDateTimePicker from './EmDateTimePicker.vue'
import { ref, provide, reactive, computed, defineProps, onMounted, useAttrs } from 'vue';
let options = reactive({
    rangePicker: false,
    displayFormat: '',
    startDate: '',
    endDate: '',
    minDate: '',
    maxDate: '',
    adjustWeekday: 0,
    buttons: {
        todayBtn: 'Today',
        cancelBtn: 'Cancel',
        applyBtn: 'Apply',
    },
    // With Time Picker
    timePicker: false,
    onlyTimePicker: false,
    minuteStep: 5,
    use24Format: false,
    timePickerUi: 'standard',
    timePickerButtons: false,
    endTimeAutoValid: true,
    displayIn: 'modal',
    theme: 'light',
    colors: {
        // Just change -----> "primary_bg" to adjust color according any theme color
        body_bg: '#ffffff',
        primary_bg: '#12834f',      
    },
});

const optionsFinal = computed(() => {
    let final = {};

})

console.log(3333);
</script>

<template>
    <div class="emdemo">
       <div class="row">
            <div class="col-md-6 col-12 options-selection">

                <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" value="" id="rangePicker" v-model="options.rangePicker">
                    <label class="form-check-label" for="rangePicker">
                        rangePicker
                    </label>
                </div>
                <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" value="" id="timePicker" :v-model="options.timePicker">
                    <label class="form-check-label" for="timePicker">
                        timePicker
                    </label>
                </div>
                <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" value="" id="onlyTimePicker" v-model="options.onlyTimePicker">
                    <label class="form-check-label" for="onlyTimePicker">
                        onlyTimePicker
                    </label>
                </div>
                <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" value="" id="use24Format" v-model="options.use24Format">
                    <label class="form-check-label" for="use24Format">
                        use24Format
                    </label>
                </div>
                <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" value="" id="timePickerButtons" v-model="options.timePickerButtons">
                    <label class="form-check-label" for="timePickerButtons">
                        timePickerButtons
                    </label>
                </div>
                <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" value="" id="endTimeAutoValid" v-model="options.endTimeAutoValid">
                    <label class="form-check-label" for="endTimeAutoValid">
                        endTimeAutoValid
                    </label>
                </div>


                <div class="form-group mb-2 d-flex justify-content-between align-items-center">
                    <label for="startDate">startDate</label>
                    <input type="text" class="form-control" id="startDate" v-model="options.startDate">
                </div>
                <div class="form-group mb-2 d-flex justify-content-between align-items-center">
                    <label for="endDate">endDate</label>
                    <input type="text" class="form-control" id="endDate" v-model="options.endDate">
                </div>
                <div class="form-group mb-2 d-flex justify-content-between align-items-center">
                    <label for="minDate">minDate</label>
                    <input type="text" class="form-control" id="minDate" v-model="options.minDate">
                </div>
                <div class="form-group mb-2 d-flex justify-content-between align-items-center">
                    <label for="maxDate">maxDate</label>
                    <input type="text" class="form-control" id="maxDate" v-model="options.maxDate">
                </div>
                <div class="form-group mb-2 d-flex justify-content-between align-items-center">
                    <label for="adjustWeekday">adjustWeekday</label>
                    <input type="number" min="0" class="form-control" id="adjustWeekday" v-model="options.adjustWeekday">
                </div>               
                <div class="form-group mb-2 d-flex justify-content-between align-items-center">
                    <label for="minuteStep">minuteStep</label>
                    <input type="number" min="1" class="form-control" id="minuteStep" v-model="options.minuteStep">
                </div>               
                <div class="form-group mb-2 d-flex justify-content-between align-items-center">
                    <label for="displayFormat">displayFormat</label>
                    <input type="text" class="form-control" id="displayFormat">
                </div> 
                <div class="form-group mb-2 d-flex justify-content-between align-items-center">
                    <label for="todayBtn">todayBtn</label>
                    <input type="text" class="form-control" id="todayBtn" v-model="options.buttons.todayBtn">
                </div>              
                <div class="form-group mb-2 d-flex justify-content-between align-items-center">
                    <label for="cancelBtn">cancelBtn</label>
                    <input type="text" class="form-control" id="cancelBtn" v-model="options.buttons.cancelBtn">
                </div>              
                <div class="form-group mb-2 d-flex justify-content-between align-items-center">
                    <label for="applyBtn">applyBtn</label>
                    <input type="text" class="form-control" id="applyBtn" v-model="options.buttons.applyBtn">
                </div>              
                <div class="form-group mb-2 d-flex justify-content-between align-items-center">
                    <label for="timePickerUi">timePickerUi</label>             
                    <select class="form-control" id="timePickerUi" v-model="options.timePickerUi">
                        <option value="standard">standard</option>
                        <option value="classic">classic</option>
                    </select>
                </div>              
                <div class="form-group mb-2 d-flex justify-content-between align-items-center">
                    <label for="displayIn">displayIn</label>             
                    <select class="form-control" id="displayIn" v-model="options.displayIn">
                        <option value="modal">modal</option>
                        <option value="top_left">top_left</option>
                        <option value="top_right">top_right</option>
                        <option value="bottom_left">bottom_left</option>
                        <option value="bottom_right">bottom_right</option>
                        <option value="inline_left">inline_left</option>
                        <option value="inline_right">inline_right</option>
                        <option value="inline_center">inline_center</option>
                    </select>
                </div>              
                <div class="form-group mb-2 d-flex justify-content-between align-items-center">
                    <label for="theme">theme</label>             
                    <select class="form-control" id="theme" v-model="options.theme">
                        <option value="light">light</option>
                        <option value="dark">dark</option>
                    </select>
                </div>       
                <div class="form-group mb-2 d-flex justify-content-between align-items-center">
                    <label for="body_bg">primary_bg</label> <span>Color-code: {{ options.colors.body_bg }} </span>
                    <input type="color" class="form-control" id="applyBtn" v-model="options.colors.body_bg">
                </div>              
                <div class="form-group mb-2 d-flex justify-content-between align-items-center">
                    <label for="primary_bg">primary_bg</label> <span>Color-code: {{ options.colors.primary_bg }} </span>
                    <input type="color" class="form-control" id="applyBtn" v-model="options.colors.primary_bg">
                </div>              

            </div>
            <div class="col-md-6 col-6">
            </div>
       </div>
    </div>
</template>

<style scoped>
.options-selection select,
.options-selection input[type=text],
.options-selection input[type=color],
.options-selection input[type=number]
{
    margin-left: 20px;
}
.options-selection label:has(~input[type=text]),
.options-selection label:has(~input[type=number]),
.options-selection label:has(~input[type=color]),
.options-selection label:has(~select)
{
    width: 200px;
}
</style>

