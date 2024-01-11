<script setup>
defineProps({
  modelValue: {
        type: Boolean,
        default: false,
        required: true
  },
  title: {
    type: String,
    default: 'Confirmation',
    required: false,
  },
  top: {
    type: Boolean,
    default: false,
    required: false,
  },
  locationName: {
    type: String,
    default: '',
    required: false,
  },
  message: {
    type: String,
    default: '',
    required: false,
  },
});
let emit = defineEmits(['update:modelValue', 'clicked-yes', 'clicked-no'])
let yes = (event) => {
  emit('clicked-yes')
  emit('update:modelValue', false)
}
let no = (event) => {
  emit('clicked-no')
  emit('update:modelValue', false)
}
let close = (event) => {
  emit('clicked-no')
  emit('update:modelValue', false)
}

</script>


<template>
  <!-- How To Use
  ==================================
  <modal-confirm v-model="isShow" @clicked-yes="false" @clicked-no="false">
    <div class="pt-3">
      <p class="text-muted">Custom Message Here</p>
    </div>
  </modal-confirm>
  ==================================
   -->
  <teleport to="body">
    <div
      class="modal fade RentMyConfirmationModal"
      :class="{ show: modelValue }"
      :style="modelValue ? 'display: block' : 'display: none'"
    >
      <div class="modal-dialog" :class="[top ? '' : 'modal-dialog-centered']">
        <div @click.stop="false" class="modal-content">
          <div class="modal-body">
            <div class="col-12">              
              <div class="RentMyWrapper" wrapper-is-ready style="--duration:0.2s">
                  <div class="d-flex justify-content-center my-3">
                      <i class="fa fa-exclamation-circle" style="color:#a2caef;font-size:60px"></i>
                  </div>
                  <h5 class="text-center"> 
                    <slot> <!-- Message Here --> </slot>
                  </h5>
                  <div class="closing-btn text-center pt-3 pb-3">
                      <button type="button" class="RentMyBtn" @click="no()" style="background-color: #5ba1e0;"> Ok </button>
                  </div>
              </div>              
            </div>
          </div>          
        </div>
      </div>
    </div>
  </teleport>
</template>

