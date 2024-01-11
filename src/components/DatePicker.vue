<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import { Toaster } from '@/import-hub';
const instance = ref(null);
const selected = ref(null);
const controls = ref([]);
const format = ref({});
const buttons = ref([]);
const responsive = ref({});
const content = ref({});
const colors = ref([]);
const weekDays = ref(["SU", "MO", "TU", "WE", "TH", "FR", "SA"]);
const startDayErrorMessage = ref('');
const dateApply = ref('Apply');
const dateCancel = ref('Cancel');
const availableListTemp = ref([]);
const onNextPageClick = ref(false);

const props = defineProps({
  _id: {
    default: "datepicker",
    required: true
  },
  placeholderStart: {
    default: null,
    required: false
  },
  placeholderEnd: {
    default: null,
    required: false
  },
  displayTime: {
    default: null,
    required: false
  },
  onlyStartDate: {
    default: false,
    required: false,
    type: [Boolean]
  },
  mindate: {
    default: null,
    required: false,
    type: [String]
  },
  disabledPicker: {
    default: null,
    required: false,
    type: [Boolean]
  },
  isSingleEndDate: {
    default: null,
    required: false,
    type: [Boolean]
  },
  availableList: {
    default: [],
    required: false,
    type: [Array, Object]
  },
  invalidDate: {
    default: [],
    required: false,
    type: [Array, Object]
  },
  showOuterDays: {
    default: null,
    required: false,
    type: [Boolean]
  },
  pages: {
    default: 1,
    required: false,
    type: [Boolean]
  },
  hideActionBtn: {
    default: null,
    required: false,
    type: [Boolean]
  },
  showRangeLabels: {
    default: null,
    required: false,
    type: [Boolean]
  },
  stepMinute: {
      default: 30,
      required: false
  },
  clickAfterMount: {
      default: false,
      required: false
  }
});

const picker_min_date = ref(null);
let clicked = ref(false);

onMounted(()=>{
  if(props.clickAfterMount){
    if(!clicked.value){
      setTimeout(() => {
        let els = Array.from(document.querySelectorAll(`#${props._id}`));
        if(els.length){
          clicked.value = true;
          els.forEach(el => el.click());
        }
      }, 500);
    }
  }
})

const emit = defineEmits([
  'dateModel',
  'startDateTime',
  'endDateTime',
  'reload',
  'cancel',
  'onClickNext',
])

// RENTMY CONFIG
function onPageChange(event) {
  onNextPageClick.value = true;
  let month = {
    start_date: moment(event.firstDay).format('YYYY-MM-DD'),
    end_date: moment(event.firstDay).endOf('month').format('YYYY-MM-DD')
  }
  emit('onClickNext', month);
}

function setButtons() {
  buttons.value = [
    {
      text: dateCancel.value,
      cssClass: 'my-btn',
      handler: event => {
        checkEvent(dateCancel.value);
      },
    },
    {
      text: dateApply.value,
      cssClass: 'my-btn',
      handler: event => {
        checkEvent(dateApply.value);
      },
    },
  ];
}


function checkEvent(action) {
  if (action === dateApply.value) {
    // onClose(instance.value); // MULTIPLE API CALL ISSUE
    instance.value.close();
  }
  if (action === dateCancel.value) {
    instance.value.close();
  }
}

function setHolidays(holidays) {

  if (!Array.isArray(holidays) || holidays.length == 0) return;

  props.invalidDate.push({
    recurring: {
      repeat: 'weekly',
      weekDays: holidays.join(',')
    }
  });
}


function setColors(holidays) {
  if (!Array.isArray(holidays) || !holidays.length) { return; }
  const workingDays = weekDays.value.filter(x => !holidays.includes(x));

  colors.value.push({
    highlight: "#e2e2e2",
    recurring: {
      repeat: 'weekly',
      weekDays: workingDays.join(',')
    }
  });
}

function setDefaultConfigForMbscDatePicker() {
  controls.value = ['calendar'];
  responsive.value = {
    small: {
      display: 'center'
    },
    medium: {
      display: 'center'
    },
    large: {
      display: 'center'
    }
  };
}

function setDisplayTime() {
  if (props.displayTime) {
    controls.value.push('time');
  }
}

function setMinDate() {
  if (props.mindate instanceof Date) {
    picker_min_date.value = formatDate(props.mindate).split(' ')[0] + "T00:00:00";
    picker_min_date.value = new Date(props.mindate);
  } else if (typeof props.mindate === 'string' && props.mindate !== '') {
    picker_min_date.value = props.mindate.split(' ')[0] + "T00:00:00";
    picker_min_date.value = new Date(props.mindate);
  } else {
    picker_min_date.value = new Date();
    picker_min_date.value.setHours(0, 0, 0);
  }
}

function loadChanges() {
  props.placeholderStart = props.placeholderStart?.includes(' ') ?
    (props.placeholderStart + ":00").replace(' ', 'T') : props.placeholderStart;
  props.placeholderEnd = props.placeholderEnd?.includes(' ') ? (props.placeholderEnd + ":00").replace(' ', 'T') : props.placeholderEnd;
  props.placeholderEnd = moment(props.placeholderEnd || new Date());
  props.placeholderStart = moment(props.placeholderStart || new Date());
  selected.value = [props.placeholderStart, props.placeholderEnd];

  if (props.onlyStartDate) {
    props.placeholderEnd = '';
    selected.value = [props.placeholderStart];
  }

}

function getPlaceholder() {
  const placeholderStart = moment(selected.value[0]).format(format.value);
  const placeholderEnd = selected.value[1] ? moment(selected.value[0]).format(format.value) : '';
  return placeholderEnd ? `${placeholderStart} - ${placeholderEnd}` : placeholderStart;
}

function onCancel(event) {
  emit('cancel', true);
}
function onClose(inst) {
  const value = inst.value;
  if (!value) return;

  if (startDayErrorMessage.value.length) { 
    // if start date is holiday show error message
    Toaster().error(startDayErrorMessage.value);
  }
  startDayErrorMessage.value = '';
  let startDate, endDate;
  if (props.onlyStartDate) {
    startDate = formatDate(value);
    endDate = formatDate(value);
  } else {
    startDate = formatDate(value[0]);
    endDate = formatDate(value[1] || value[0]);
  }
  emit('startDateTime', startDate);
  emit('endDateTime', endDate);
  emit('dateModel', { startDate, endDate, isSingleEndDate: props.isSingleEndDate });
  setTimeout(() => {
    emit('reload', true);
  }, 500);


}


function onCellClick(event) {
  const date = event.date;
  const day = weekDays.value[date.getDay()];
  if (content?.site_specific?.confg?.holidays &&
    content?.site_specific?.confg?.checkout?.show_separate_date_picker &&
    content.value.site_specific.confg.checkout.show_separate_date_picker) {
    const holidays = content.value.site_specific.confg.holidays;
    const flagStart = (event.active === 'start' || props.onlyStartDate);
    if (flagStart) {
      if (holidays.includes(day)) {
        startDayErrorMessage.value = "Can't select a holiday as a start date";
        Toaster.error(startDayErrorMessage.value)
      } else {
        startDayErrorMessage.value = "";
      }
    }
  }
}

function formatDate(d) {
  const dformat = [
    d.getFullYear(),
    ("0" + (d.getMonth() + 1)).slice(-2),
    ("0" + d.getDate()).slice(-2),
  ].join('-')
    + ' ' +
    [
      ("0" + d.getHours()).slice(-2),
      ("0" + d.getMinutes()).slice(-2)
    ].join(':');
  return dformat;
}

function onActiveDateChange(event) {
  if (event.active == 'end') {
    availableListTemp.value = props.availableList;
    props.availableList = [];
  } else {
    if (availableListTemp.value.length) {
      props.availableList = availableListTemp.value;
    }
  }
}

const loaded = ref(false);
function onInit() {
  setDefaultConfigForMbscDatePicker();
  const contents = localStorage.getItem('rentmy_contents') ? JSON.parse(localStorage.getItem('rentmy_contents')) : null;
  content.value = contents;
  if (content?.site_specific?.confg?.checkout?.show_separate_date_picker &&
    content.value.site_specific.confg.checkout.show_separate_date_picker) {
    setColors(content?.site_specific?.confg?.holidays);
  } else {
    setHolidays(contents?.site_specific?.confg?.holidays);
  }
  startDayErrorMessage.value = "";

  format.value = contents.site_specific.confg.hasOwnProperty('date_format')
    ? contents.site_specific.confg.date_format
    : 'DD MMM YYYY';

  onNextPageClick.value = false;
  setMinDate();
  setDisplayTime();
  if (!props.hideActionBtn) setButtons();
  loadChanges();
  loaded.value = true;
}
onInit();

// OPEN DATEPICKER
function openDatepicker() {
  instance.value = mobiscroll.datepicker(`#${props._id}`, {
    select: props.onlyStartDate ? 'date' : 'range',
    dateFormat: format.value,
    controls: controls.value,
    stepMinute: props.stepMinute,
    calendarType: 'month',
    disabled: props.disabledPicker ? true : false,
    min: picker_min_date.value,
    setText: 'Apply',
    responsive: responsive.value,
    touchUi: true,
    inRangeInvalid: true,
    invalid: props.invalidDate,
    colors: colors.value,
    showOuterDays: props.showOuterDays,
    labels: props.availableList,
    pages: props.pages,
    buttons: buttons.value,
    showRangeLabels: props.showRangeLabels,
    onClose: onClose,
    onCellClick: onCellClick,
    onCancel: onCancel,
    onPageChange: onPageChange,
    onActiveDateChange: onActiveDateChange
  })
}

</script>
<template>
  <div v-if="loaded" v-bind="$attrs">
    <input :id="props._id" @click="openDatepicker()" mbsc-input class="form-control" :placeholder="getPlaceholder()" readonly/>
    <!-- <button @click="openDatepicker()" class="btn btn-success">Open Datepicker</button> -->
  </div>
</template>