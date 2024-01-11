<template>
    <teleport to="body">
      <span class="loader"></span>
    </teleport>
</template>

<script setup>
let props = defineProps({
  left:{
    default: '0px', //left: 66px; for login page
    type: String
  }
});
let globalLoaderColor = RentMyEvent.apply_filters('GlobalLoader:Color', '#131313 ');
let loaderColor = `0 3px 0 ${globalLoaderColor} inset`
</script>

<style scoped>
/* Absolute Center Spinner */
.loader {
  position: fixed;
  top: calc(50% - 100px);
  left: calc(50% - 50px);
  width: 100px !important;
  height: 100px !important;
  pointer-events: none !important;
  z-index: 100;
}

.loader:before , .loader:after{
  content: '';
  border-radius: 50%;
  position: absolute;
  inset: 0;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.068) inset;
}
.loader:after {
  /**box-shadow: 0 3px 0 #131313 inset;*/
  box-shadow: v-bind(loaderColor);
  animation: rotate 0.6s linear infinite;
}

@keyframes rotate {
  0% {  transform: rotate(0)}
  100% { transform: rotate(360deg)}
} 
</style>