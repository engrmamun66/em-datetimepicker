<script setup>
import { onMounted, ref, computed, defineProps, inject } from 'vue';
import { useToaster } from '../stores/toaster'
let toaster = useToaster()

let animation = "left"; // 'left' | 'right' | 'top' | 'bottom'

let hasMessage = computed(() => toaster?.messages?.length)

</script>

<template>
    <teleport to="body">
        <section v-if="hasMessage" class="global-toaster justify-content-end">
            <div class="inner-contents">
            <template v-for="(message, index) in toaster?.messages" :key="index">                
                <p
                class="alert shadow fade_out"
                :class="[
                    message.type == 'success'
                    ? 'alert-success'
                    : message.type == 'error'
                    ? 'alert-danger'
                    : message.type == 'warning'
                    ? 'alert-warning'
                    : '',
                    'animation_' + animation,
                ]"
                >         
                <span class="message"> {{ message.message }} </span>
                <i @click.stop="toaster.remove(message)" class="fas fa-times-circle text-white ps-2" style="font-size: 16px;cursor:pointer"></i>
                </p>
            </template>
            </div>
        </section>
    </teleport>
</template>


<style scoped>
.global-toaster {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 999999;
  width: 100%;
  height: 100vh;
  padding: 15px;
  pointer-events: none;
}
.global-toaster .inner-contents {
  display: flex;
  justify-content: flex-end;
  flex-wrap: nowrap;
  flex-direction: column;
  text-align: right;
  direction: rtl;
}
.global-toaster .inner-contents p {
  pointer-events: all;
  text-align: right;
  width: max-content;
  direction: ltr;
}
@media (max-width: 575px) {
  .global-toaster .inner-contents {
    align-items: center;
  }
  .global-toaster .inner-contents p {
    padding: 5px 10px;
  }
}
.global-toaster .alert {
    background-color: #60bc60e8;
    color: white;
    padding: 12px 18px;
    border: none !important;
}
.global-toaster .alert.alert-danger {
    background-color: #bc6060e8;
}
.global-toaster .alert.alert-warning {
    background-color: #d4b13de8;
}
.global-toaster .btn-close,
.global-toaster .btn-close:hover
 {
  padding: 0 0 0px 10px;
  width: 20px;
  height: 12px;
  color: white !important;
  background-color: transparent !important;
}
.btn-close:focus {
  box-shadow: none !important;
}

/* -------------------------------------------------------------------------- */
/*                              Animation classes                             */
/* -------------------------------------------------------------------------- */
.animation_left {
  animation: mymove_left 0.5s ease-in-out;
}
.animation_right {
  animation: mymove_right 0.5s ease-in-out;
}
.animation_top {
  animation: mymove_top 0.5s ease-in-out;
}
.animation_bottom {
  animation: mymove_bottom 0.5s ease-in-out;
}
.fade_out {
  animation: fade_out 1s ease-in-out;
  animation-delay: 3s;
}
@keyframes mymove_left {
  from {
    right: 100px;
    opacity: 0;
  }
  to {
    right: 0px;
    opacity: 1;
  }
}
@keyframes mymove_right {
  from {
    right: -100px;
    opacity: 0;
  }
  to {
    right: 0px;
    opacity: 1;
  }
}
@keyframes mymove_top {
  from {
    bottom: 100px;
    opacity: 0;
  }
  to {
    bottom: 0px;
    opacity: 1;
  }
}
@keyframes mymove_bottom {
  from {
    top: 100px;
    opacity: 0;
  }
  to {
    top: 0px;
    opacity: 1;
  }
}
@keyframes fade_out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>