<script setup>
// Documentation: https://www.daterangepicker.com/#google_vignette
import helper from '../utilities/helper';
import { ref, onMounted, defineEmits } from "vue";
import { useGlobalStore } from "../stores/global";
const globalStore = useGlobalStore();
const confg = JSON.parse(localStorage.getItem('rentmy_contents') || '{}')?.site_specific?.confg

const props = defineProps({
    singleDatePicker: {
        default: false,
        required: false,
        type: [Boolean],
    },   
    startDate: {
        default: '',
        required:  false,
        type: [String],
    },
    endDate: {
        default: '',
        required: false,
        type: [String],
    },      
    minDate: {
        default: "",
        required: false,
        type: [String],
    },
    maxDate: {
        default: "",
        required: false,
        type: [String],
    },    
    timePicker: {
        default: true,
        required: false,
        type: [Boolean],
    },  
    timePickerIncrement: {
        default: 1,
        required: false,
        type: [Number],
    },
    disabledPicker: {
        default: null,
        required: false,
        type: [Boolean],
    },
    opens: {
        default: "right",
        required: false,
    },
    drops: {
        default: "down",
        required: false,
    },  
    buttonClasses: {
        default: "btn btn-sm",
        required: false,
        type: [String],
    },
    applyButtonClasses: {
        default: "btn-primary",
        required: false,
        type: [String],
    },
    cancelButtonClasses: {
        default: "btn-default",
        required: false,
        type: [String],
    },
    width: {
        default: "",
        required: false,
        type: [String],
    },
    parentEl: {
        default: "body",
        required: false,
        type: [String, HTMLElement],
    },
});

const emit = defineEmits([ 
    "show", 
    "hide", 
    "change", 
    "reload", 
]);
const getFomat = (forDisplay=false) => {
    if(!forDisplay){
        return props.timePicker ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';
    } else {
        return (confg?.date_format || 'MM/DD/YYYY') + (props.timePicker ? ' HH:mm' : '');
    }
};

let daterangeInput = ref(null);
let options = {
    singleDatePicker: props.singleDatePicker,
    startDate: moment(props.startDate || new Date()).format(getFomat(true)),
    endDate: moment(props.endDate || new Date()).format(getFomat(true)),
    opens: props.opens, // left | right | center
    drops: props.drops, // up | down | auto
    timePicker: props.timePicker,
    timePickerIncrement: props.timePickerIncrement,
    autoUpdateInput: true,
    buttonClasses: props.buttonClasses,
    applyButtonClasses: props.applyButtonClasses,
    cancelButtonClasses: props.cancelButtonClasses,
    parentEl: props.parentEl,
    locale: {
        language: 'en',
        format: getFomat(true),
    },
};

// console.log('options', options);

function fromPicker(event, picker){    
    let startDate = picker.startDate.format(getFomat());
    let endDate = picker.endDate.format(getFomat()); 
    let isSingleEndDate = props.singleDatePicker;

    const old = {
        startDate : picker.oldStartDate.format(getFomat()),
        endDate : picker.oldEndDate.format(getFomat()),  
    };

    return { 
        isSingleEndDate,
        startDate, 
        endDate,
        old,
        picker,
    };
}

function emitHide(ev, picker){
    if(ev.type === 'cancel'){
        let oldStartDate = picker.oldStartDate.format(getFomat(true));
        let oldEndDate = picker.oldEndDate.format(getFomat(true));
        picker.setStartDate(oldStartDate);
        picker.setEndDate(oldEndDate);
    }
    emit('hide');
}


onMounted(() => {
    /* -------------------------------------------------------------------------- */
    /*                                Initilization                               */
    /* -------------------------------------------------------------------------- */
    $(daterangeInput.value).daterangepicker(options);

    /* -------------------------------------------------------------------------- */
    /*                                 Show Event                                 */
    /* -------------------------------------------------------------------------- */
    $(daterangeInput.value).on('show.daterangepicker', function(ev, picker) {
        emit('show', fromPicker(ev, picker));
    });
    
    /* -------------------------------------------------------------------------- */
    /*                                Change Event                                */
    /* -------------------------------------------------------------------------- */
    $(daterangeInput.value).on('apply.daterangepicker', function(ev, picker) {
        emit('change', fromPicker(ev, picker));
        setTimeout(() => {
            emit('reload', true);
        }, 500);
    });

    /* -------------------------------------------------------------------------- */
    /*                                Cancel Events                               */
    /* -------------------------------------------------------------------------- */
    $(daterangeInput.value).on('hide.daterangepicker', emitHide);
    $(daterangeInput.value).on('hideCalendar.daterangepicker', emitHide);
    $(daterangeInput.value).on('cancel.daterangepicker', emitHide);

    if(props.width) daterangeInput.value.style.width = props.width
});
</script>

<template>
    <input 
    ref="daterangeInput" 
    class="form-control RentMyDateRangePicker" 
    type="text" 
    :disabled="disabledPicker"
    v-bind="$attrs"/>
</template>