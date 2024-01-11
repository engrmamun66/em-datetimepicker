<script setup>
import { ref, inject, onMounted, defineProps, defineComponent } from 'vue';
import Modules from '../modules';
let setWraperIsReady = inject('setWraperIsReady');
let { wrapper } = defineProps(['wrapper']);
import { createComponentHTML } from "@utils/functions/withComponent";
let { helper, cookie, domElement, http, labelSelector, currency } = inject("utils");
let showLoginModal = inject("showLoginModal");
let globalLoader = inject("globalLoader");
import { useGlobalStore } from "@stores/global";
import { downloadFile } from "@utils/functions";
const globalStore = useGlobalStore();
createComponentHTML(wrapper, [
  {
    selector: '[Tabs]',
    template: false,
    attr: { 'v-if': '!showDetails' },
    text: false,
      child: [
        {
        selector: '[PdfImageDiv]',
        template: false,
        attr: { '@click.stop': 'onClickPDF' },
        text: false,
        child: [
          {
              selector: 'img',
              template: false,
              attr: { ':src': 'RENTMY_GLOBAL?.download_pdf_image' },
              text: false,
          },
        ]
    },

    {
        selector: '[CalendarImageDiv]',
        template: false,
        attr: { '@click.stop': 'onClickCalendar' },
        text: false,
        child: [
           {
            selector: 'img',
            template: false,
            attr: { ':src': 'RENTMY_GLOBAL?.download_calendar_image' },
            text: false,
          },
        ]
    },

    {
        selector: '[DetailsImageDiv]',
        template: false,
        attr: { '@click.stop': 'showDetails = true' },
        text: false,
        child: [
           {
            selector: 'img[ImageViewDetails]',
            template: false,
            attr: { ':src': 'RENTMY_GLOBAL?.check_list_image' },
            text: false,
          },
        ]
    },
      ]
  },
  {
    selector: '[OrderSummary]',
    template: false,
    attr: { 'v-if': 'showDetails' },
    text: false,
    child: [

      {
        selector: '[OrderItem]',
        template: true,
        attr: { 
          'v-for': '(item, index) in order?.order_items || []', ':key' : 'index'
         },
        text: false,
        child: [
          {
            selector: '[ImageArea]',
            template: false,
            attr: { ':src': 'helper.getProductImage(item)', '@error': 'setDefaultImage' },
            text: false,        
          },
          {
            selector: '[ItemNameArea]',
            template: false,
            attr: { ':src': 'helper.getProductImage(item)', '@error': 'setDefaultImage' },
            text: `
              <strong class="CartItemTitle">{{ item?.product?.name }}</strong>

              <!--Variant Chain-->
              <template v-if="item?.product?.variant_chain && item?.product?.variant_chain?.indexOf('Unassigned') < 0">
                  <div class="CartItemVariantName"><small>{{ item.product.variant_chain }}</small></div>
              </template>

              <!--custom fields-->
              <template v-if="item?.cart_product_options?.length">
                  <ul class="ProductCustomFields">
                      <template v-for="(fields, index) in item?.cart_product_options" :key="index">
                          <template v-if="fields.options && fields.options.length > 0">
                              <template v-for="(option, key) in fields?.options" :key="key">
                                  <template v-if="option.label && option.value">
                                      <li v-if="['rich', 'Delivery Only'].includes(option.label) == false">
                                          {{ option.label }}: {{ option.value }}{{ key === fields.options.length - 1 ? '' : ', ' }}
                                      </li>
                                  </template>
                              </template>
                          </template>
                      </template>
                  </ul>
              </template>
            `,        
          },
          {
            selector: '[ItemPrice]',
            template: false,
            attr: { },
            text: `{{  currency.format(item.price) }}`,        
          },
          {
            selector: '[Quantity]',
            template: false,
            attr: { },
            text: `{{  item.quantity }}`,        
          },
          {
            selector: '[ItemPriceArea]',
            template: false,
            attr: { },
            text: `{{ currency.format(item?.price * item?.quantity) }} <span v-if="getCouponDiscountText(item)">({{ getCouponDiscountText(item) }} Coupon applied)</span>`,        
          },
        ]
      },


      // OptionalService
      {
        selector: '[OptionalService]',
        template: false,
        attr: { 
          'v-if': 'optionalCharges?.length',
          },
        text: false,
        child: [
          {
            selector: '[Service]',
            template: false,
            attr: { 
              'v-for': '(service, index) in optionalCharges', ':key' : 'index',
              },
            text: false,
            child: [
              {
                selector: '[Name]',
                template: false,
                attr: { },
                text: `{{ service?.note || service?.name }}`,        
              },
              {
                selector: '[Price]',
                template: false,
                attr: { },
                text: `{{ currency.format(service?.amount) }}`,        
              },
            ]     
          },
        ]
      },

      // Rental Date
      {
        selector: '[RentalDate]',
        template: false,
        attr: {},
        text: `
          {{ order?.rent_start }}
          {{ order?.rent_end ? '-' : '' }}
          {{ order?.rent_end }}
        `
      },

      // Order Summary Table
      {
        selector: '[SummaryTable]',
        template: false,
        attr: {},
        text: false,
        child: [
          {
            selector: '[SubtotalAmount]',
            template: false,
            attr: {},
            text: `{{ currency.format(order?.sub_total || 0) }}`,
          },
          {
            selector: '[OptionalServices]',
            template: false,
            attr: {},
             text: '{{ currency.format( optionalCharges?.reduce((a, b) => a + b?.amount, 0)  ) }}',
          },
          {
            selector: '[DepositeAmount]',
            template: false,
            attr: {},
             text: '{{ currency.format(order?.deposit_amount || 0) }}',
          },

          // TaxAmountRow
          {
            selector: '[TaxAmountRow]',
            template: true,
            attr: { 'v-if': '!order?.tax?.regular?.length'},
            text: false,
            child: [
              {
                selector: '__SELF__',
                template: false,
                attr: { 'v-for': '(tax, index) in order?.tax?.regular', ':key': 'index' },
                text: false,
                child: [
                    {
                      selector: '[TaxName]',
                      template: false,
                      attr: { },
                      text: `{{ tax?.name }} ({{ tax?.rate + '%' }})`,
                    },
                    {
                      selector: '[TaxAmount]',
                      template: false,
                      attr: { },
                      text: `{{ currency.format(tax?.total || 0) }}`,
                    },
                ]
              },
            ]
          },
          {
            selector: '[TaxAmountRow]',
            template: true,
            attr: { 'v-else': ''},
            text: false,
            child: [
              {
                selector: '[TaxName]',
                template: true,
                attr: { },
                text: false,
                // text: 'Tax Amount',
              },
              {
                selector: '[TaxAmount]',
                template: true,
                attr: { },
                text: false,
                text: '{{ currency.format(order?.tax?.total || 0) }}',
              }
            ]
          },

          // Shipping Charge
          {
            selector: '[TotalAmount]',
            template: true,
            attr: { },
            text: `{{ currency.format(order?.total || 0) }}`,
          },

          // Total
          {
            selector: '[ShippingCharge]',
            template: true,
            attr: { },
            text: `{{ currency.format(order?.delivery_charge || 0) }}`,
          },
        ],
      },      

      // Footer content and back button

      {
        selector: '[AfterOrderPageFooter]',
        template: false,
        attr: { 
          'v-if': 'site_specific?.checkout_payment?.after_order_page_footer',
          'v-html': 'site_specific?.checkout_payment?.after_order_page_footer'
         },
        text: false,        
      },

      {
        selector: '[Back]',
        template: false,
        attr: { '@click.stop': 'showDetails = false' },
        text: false,
      }
    ]
  }
    
]);

let template = wrapper.innerHTML;
wrapper.innerHTML = "";

const OrderDetailsComponent = defineComponent({
  template,
  data() {
    return {
      helper,
      globalStore,
      currency,
      RENTMY_GLOBAL,
      uid: null,
      site_specific: null,
      isMounted: false,      
      order: null,      
      payment: null,      
      optionalCharges: null,      
      showDetails: false,      
    };
  },
  async mounted() {
    this.site_specific = JSON.parse( localStorage.getItem("rentmy_contents") )?.site_specific;
    const uid = helper.withURL.getQuery('uid');
    if(uid){      
      await globalStore.getCurrencyConfig();
      await this.getOrderDetails(uid);
      await this.getOrderPayment(this.order?.id);
      await this.getOrderViewChanges(this.order?.id);

      this.isMounted = true;
    } else {
      wrapper.innerHTML = `<h1 class="text-center text-danger"> Order UID not found </h1>`;
    }
    setWraperIsReady(wrapper);
  },  
  methods: {
    async getOrderDetails(uid){
      let response = await http.get(`/orders/${uid}/complete`);
      if(response.data.status == 'OK'){
        const data = response.data.result?.data;
        this.order = data;
      }
    },
    async getOrderPayment(id){
      let response = await http.get(`/order/${id}/payments?is_paid=true&list=false&log=false&memo=true`);
      if(response.data.status == 'OK'){
        const data = response.data.result?.data;
        this.payment = data;
      }
    },
    async getOrderViewChanges(id){
      let response = await http.get(`/orders/view-charges/${id}?type=order`);
      if(response.data.status == 'OK'){
        const data = response.data.result?.data;
        this.optionalCharges = data;
      }
    },
    onClickPDF(){
      const locationId = this.RENTMY_GLOBAL?.locationId;
      const { VITE_API_BASE_URL: baseURL } = import.meta.env;
      let aTag = document.createElement('a');
      aTag.href = `${baseURL}pages/pdf?order_id=${this.order?.id}&location=${locationId}`;
      document.body.appendChild(aTag);
      globalLoader.show();
      aTag.click();
      aTag.remove();
      setTimeout(() => {
        globalLoader.hide();
      }, 1500)
    },
    onClickCalendar(){
      const uid = helper.withURL.getQuery('uid');
      globalLoader.show();
      http.get(`orders/${uid}/ical-download`, { responseType: 'blob' })
      .then(response => {
        let fileBlob = response.data; 
        return fileBlob;       
      })
      .then(fileBlob => {
        downloadFile(fileBlob, this.order.id + '_calendar.ics');
      }).finally(()=>{
        globalLoader.hide();
      })
    },
    // Helper Functions
    setDefaultImage(event){
      event.target.src = window.RENTMY_GLOBAL?.default_product_image;
    },
    getCouponDiscountText(item){
      if(item.discount?.coupon_amount){
        return currency.format(item.discount?.coupon_amount);
      }else{
        return null;
      }
    },
  },
})

</script>

<template>
    <teleport :to="wrapper">
        <OrderDetailsComponent></OrderDetailsComponent>
    </teleport>
</template>
