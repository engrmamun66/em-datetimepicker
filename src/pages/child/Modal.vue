<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
    required: true
  },
});
let emit = defineEmits(['update:modelValue', 'close', 'is-accepted']);
let close = (event) => {
  emit('close');
  emit('update:modelValue', false);
}

</script>

<template>
  <teleport to="body">
    <div class="modal fade show" @click.stop="close()" v-bind="$attrs" style="display:block;">
      <div class="modal-dialog" :class="[top ? '' : 'modal-dialog-centered']" style="max-width: 0px;height:0px">
        <div class="modal-content">          
          <div class="modal-body d-flex justify-content-center" @click.stop="false">
              <slot></slot>
          </div>
        </div>      
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal-dialog{
  max-width: 0px;
  height:0px;
}
.modal-content{
  background-color: transparent;
  border: none;
}
</style>


