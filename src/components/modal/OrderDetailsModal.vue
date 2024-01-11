<script setup>
import { defineProps } from 'vue';
defineProps({
  modelValue: {
        type: Boolean,
        default: false,
        required: true
  },
  title: {
    type: String,
    default: 'Order Details',
    required: false,
  },
  top: {
    type: Boolean,
    default: false,
    required: false,
  },
});
let emit = defineEmits(['update:modelValue', 'close']);
let close = (event) => {
  emit('close')
  emit('update:modelValue', false)
}

</script>

<template>
  <teleport to="body">
    <div
      class="modal fade RentMyOrderDetails"
      :class="{ show: modelValue }"
      :style="modelValue ? 'display: block' : 'display: none'"
      v-bind="$attrs"
    >
      <div class="modal-dialog" :class="[top ? '' : 'modal-dialog-centered']">
        <div @click.stop="false" class="modal-content">
          <div class="modal-header">
              <h6 class="modal-title"> {{ title }} </h6>
              <button @click="close()" type="button" class="btn-close" aria-label="Close"><i class="la la-close"></i></button>
          </div>
          
          <div class="modal-body" id="RentmyOrderDetailsTeleportArea" :class="{ 'RentMyWrapper': modelValue }">
              <!-- Teleport Area -->
          </div>          
        </div>
      </div>
    </div>
  </teleport>
</template>


