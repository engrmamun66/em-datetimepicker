<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useToaster } from '../stores/toaster'
let props = defineProps({
  modelValue: {
    default: null,
    required: true,
  },
  usingPopup: {
    default: false,
    required: true,
  },
})
const noticeArea = document.querySelector('#RentMyNoticeArea');
if(noticeArea) noticeArea.innerHTML = '';
const usingPopup = props.usingPopup;
if(usingPopup){
  let element = document.querySelector('#RentmyOrderDetailsTeleportArea');
  if(element){
    element.insertAdjacentElement("beforebegin", noticeArea);
  }
}


function removeNotice(e){
  const noticeArea = document.querySelector('#RentMyNoticeArea');
  if(noticeArea) noticeArea.remove();
}

</script>

<template>
  <template v-if="noticeArea && modelValue && (['success', 'failed']).includes(modelValue?.status)">
    <teleport :to="noticeArea">
    
      <template v-if="modelValue?.status == 'success'">
        <div class="AlertMessage SuccesMessage">
          <div class="AlertMessageTextIcon">
              <i class="fas fa-check-circle"></i>
              <h3>{{ modelValue.message }}</h3>
          </div>
          <a class="AlertRemove" @click="removeNotice"><i class="fas fa-times"></i></a>
        </div>
      </template>

      <template v-else-if="modelValue?.status == 'failed'">
         <div class="AlertMessage CancelMessage">
            <div class="AlertMessageTextIcon">
                <i class="fas fa-times-circle"></i>
                <h3>{{ modelValue.message }}</h3>
            </div>
            <a class="AlertRemove" @click="removeNotice"><i class="fas fa-times"></i></a>
          </div>
      </template>

    </teleport>
  </template>   
</template>