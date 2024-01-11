<script setup>
import 'vue/dist/vue.esm-bundler.js';
import { ref, onMounted, onBeforeUnmount, defineProps, inject, computed, defineCustomElement } from "vue";
import { createComponentHTML } from "@utils/functions/withComponent";
let { helper, currency } = inject("utils");
let { wrapper } = defineProps(["wrapper"]);
let emitter = inject("emitter");
let UseDefaultUI = wrapper.querySelector('[IconArea]') ? false : true;
/**
 * Passing inner HTML of .RentMyMiniCart from /templates/minicart.html
 * This feature, will be help, when client will be cart icon from WordPress Menu
 * From Wordpress menu, there is no way to add html
*/
if(UseDefaultUI) wrapper.innerHTML = '<div class="icon-area" IconArea> <i class="bx bxs-cart-alt"></i> <div class="count"><span TotalQuantity>0</span></div> </div> <div class="RentMyCartBody" RentMyMiniCartContents> <span class="RentMyTopArrow"> <i class="fa fa-caret-up"></i> </span> <div class="RentMyCartBodyInner"> <div class="RentMyCartList" CartItems> <div class="RentMyCartItem" CartItem> <img src=""> <div class="RentMyCartNamePrice"> <h4 ProductName> Dinozaurami Dino World XL </h4> <span PriceAndQty> 141 * 1</span> </div> </div> </div> <div class="RentMyCartTotalBtn"> <div class="RentMyCartTotalPrice"> <h5>Total</h5> <span TotalPrice> $141 </span> </div> <div class="RentMyMiniCartBtn"> <a href="#" class="MiniContinueShoppingBtn" ContinuteShopping> Continue Shopping</a> <a href="#" class="MiniCartBtn" ViewCart> View Cart</a> </div> </div> </div> </div>';

createComponentHTML(wrapper, [
  {
    selector: "[IconArea]",
    template: false,
    attr: { '@click.stop': 'showPopup=!showPopup', 'v-if': 'isMounted' },
    text: false,
  },
  {
    selector: "[TotalQuantity]",
    template: false,
    attr: { },
    text: `{{ totalQuantity }}`,
  },
  {
    selector: "[RentMyMiniCartContents]",
    template: false,
    attr: { ':class': '{Show: showPopup}', '@click.stop': '(e)=>{}' },
    text: false,
  },
  {
    selector: "[CartItems]",
    template: true,
    attr: { 'v-if': 'cartItems?.length' },
    text: false,
  },
  {
    selector: "[CartItems]",
    template: true,
    attr: { 'v-else': '--------' },
    text: `<h5 class="text-center my-4">Cart Is Empty</h5>`,
  },
  {
    selector: "[CartItem]",
    template: true,
    attr: { 'v-for': '(item, index) in cartItems', ':key': 'index' },
    text: false,
  },
  {
    selector: "img",
    template: false,
    attr: { 'v-bind:src': 'helper.getProductImage(item)', '@error' : 'setDefaultImage' },
    text: false,
  },
  {
    selector: "[ProductName]",
    template: false,
    attr: { },
    text: '{{ item?.product?.name }}',
  },
  {
    selector: "[PriceAndQty]",
    template: false,
    attr: { },
    text: '{{ currency.format(item.price) }} * {{ item.quantity }}',
  },
  {
    selector: "[TotalPrice]",
    template: false,
    attr: { },
    text: '{{ totalPrice || "N/F" }}',
  },
  {
    selector: ".RentMyCartTotalBtn",
    template: false,
    attr: { 'v-if': 'cartItems?.length'},
    text: false,
  },
  {
    selector: "a[ContinuteShopping]",
    template: false,
    attr: { 'href': window.RENTMY_GLOBAL.page.products_list },
    text: false,
  },
  {
    selector: "a[ViewCart]",
    template: false,
    attr: { ':href': 'getCartPageUrl()' },
    text: false,
  },
]);

let componenHTML = wrapper.innerHTML;
wrapper.innerHTML = '';
// console.log('componenHTML', componenHTML);

let cartComponent = {
  template: componenHTML,
  props: ['currency', 'helper'],
  setup(props) {
    let { currency, helper } = props;
    let cartData = ref(null);
    let cartItems = ref(null);
    let totalQuantity = ref(0);
    let showPopup = ref(false);
    let isMounted = ref(false);
    const handlePopup = () => showPopup.value = false;

    const totalPrice = computed(()=>{
      if(!cartItems.value && !cartItems.value?.length) return currency.format(0);
      let total = cartItems.value.reduce((a, b) => a + (b.price *  b.quantity), 0);
      return currency.format(total);
    })
 

    function setDefaultImage(event){
      event.target.src = window.RENTMY_GLOBAL?.default_product_image;
    } 

    function getCartPageUrl (){
      return helper.withURL.setQuery({token: cartData.value?.token}, window.RENTMY_GLOBAL.page.cart, true);
    } 

    onMounted(()=>{ 

      // eventEmitter object comming from plugin
      // if(typeof eventEmitter != 'undefined'){
      //   eventEmitter.on('update_cart', (data) => {
      //     console.log(data);
      //   })
      // }
      emitter.on('open_minicart', () => {
        showPopup.value = true
      })
  
      if (!window?.RentMy_cart_items) {
        window.RentMy_cart_items = null;
      }
      setInterval(() => {
        let data = localStorage.getItem("user_cart");   

        if (data && data != "undefined") {
          let _data = JSON.parse(data);          
          if(_data?.token){
            totalQuantity.value = _data.cart_items.reduce((a, b) => a + b.quantity, 0);            
            cartData.value = _data;
            cartItems.value = _data.cart_items;                        
          }          
        }
        // This event for cart page reactivity
        emitter.emit('CartTotal.vue:update_cart', cartData.value);
 
      }, 1000);
            
      document.addEventListener('click', handlePopup);

      //Temporary code
      setTimeout(() => {
        isMounted.value = true;
        try {
          let area = document.querySelector('.rentMyHeaderIcons');
          if(area) area?.classList.remove('rentMyHeaderIcons');
        } catch(error) {
          console.warn(error);
        }
      }, 2000)
    });
     
    
    return {
      helper,
      isMounted,
      cartData,
      cartItems,
      totalQuantity,
      showPopup,
      totalPrice,
      getCartPageUrl,
      setDefaultImage,
    }
  }
}

</script>

<template>
    <teleport :to="wrapper">
      <cartComponent 
      :helper="helper"
      :currency="currency"
      ></cartComponent> 
    </teleport>
</template>


