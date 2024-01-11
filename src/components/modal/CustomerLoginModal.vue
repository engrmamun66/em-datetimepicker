<script setup>
import { ref, defineProps, defineEmits } from 'vue';

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
  emit('close');
  emit('update:modelValue', false);
}

let reset_password = RENTMY_GLOBAL.page.reset_password;
let registration = RENTMY_GLOBAL.page.registration;
</script>

<template>
  <teleport to="body">
    <div
      class="modal fade RentMyOrderDetails"
      :class="{ show: modelValue }"
      @click.stop="close()"
      :style="modelValue ? 'display: block' : 'display: none'"
      v-bind="$attrs"
    >
      <div class="modal-dialog" :class="[top ? '' : 'modal-dialog-centered']">
        <div class="modal-content" style="background:transparent !important;border:none !important">
          
          <div class="modal-body">
              <div id="RentMyCustomerLoginContainer" class="RentMyWrapper usingInModal">
                <div class="LoginElement">
                    <h3 class="LoginTitle">Already Registered?</h3>
                    <div class="RentMyAlertMessage"></div>
                    <form class="RentMyFrom" id="RentMyCustomerLoginForm">
                        <div class="RentMyInputGroup">
                            <input type="text" name="email" class="RentMyInputField" placeholder="Email" />
                        </div>
                        <div class="RentMyInputGroup">
                            <input type="password" name="password" class="RentMyInputField" placeholder="Password" />
                        </div>
                        <div class="RentMyButtonGroup">
                            <button type="submit" class="RentMyBtn LoginBtn">Log in</button>
                            <div class="RentMyButtonGroup">
                                <a :href="reset_password" class="ForgotPassword">Forgot Password?</a>
                                <a :href="registration" class="NewAccount" >Sign Up</a>
                            </div>
                        </div>
                    </form>
                </div>
              </div>
          </div>          
        </div>
      </div>
    </div>
  </teleport>
</template>


