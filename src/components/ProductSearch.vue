<script setup>
import { onMounted, ref, computed, watch, inject ,toRaw, defineProps } from 'vue';
import debounce from 'lodash/debounce'
import { useUserStore } from '../modules/user/controllers/user.controller';
import helper from '@utils/helper';
import Loader from '@components/Loader.vue'
import { emitter } from '@/import-hub';
let isProductListPage = inject('isProductListPage')

const searchTerms = ref('')
const loader = ref(false)
const allowSearch = ref(false)
const searchItems = ref([])
const searchInputField = ref(null)
let enter_pressed = ref(false);

let props = defineProps({
  showBuyRent: {
    default: true,
    required: false,
    type: Boolean,
  }
})

onMounted(() => {
  searchTerms.value = helper?.withURL?.getQuery('search') || null
})

async function getFilteredResults() {
  try {
    if(allowSearch.value && searchTerms.value && searchTerms.value?.length > 2) {
      loader.value = true;
      const userStore = useUserStore()
      let response = null;
      if(props.showBuyRent){
        response = await userStore.searchProduct(searchTerms.value) // For Auth User
      }else{
        response = await userStore.searchProduct2(searchTerms.value) // No Auth required
      }
      if(response?.status =='OK') {
        loader.value = false;
        searchItems.value = response.result.data
        if(enter_pressed.value){
          enter_pressed.value = false;
          searchItems.value = [];
        }
      }
    } else {
      searchItems.value = []
    }    
  } catch (err) {
    console.error(`${err}`);
  }
}

  const emit = defineEmits(['getProductData', 'view-single-product']);
const debouncedFilter = debounce(getFilteredResults, 500);


watch(() => searchTerms.value, debouncedFilter)   

function clearSearch(event) {
  if(event) event.preventDefault();
  searchTerms.value = ''
  searchItems.value = [];
  emitter.emit('from-widget-search-product', '');
}

function searchDropdownActive() {
  if(searchItems.value?.length) return { active: true }
}

function formatVarientLabel(item) {
    if(item.rent || item.buy) {
      const arr = [];
      for (let i = 0; i < item.variant_chain_name?.length; i++) {
        arr.push(
          `${item.variant_set_name[item.variant_set_id[i]]}: ${
            item.variant_chain_name[i]
          }`
        );
      }
      return item?.variant_set_id?.includes(1) ? "" : arr.join(" -> ");
    }
    return '';
}
async function onClickRent(item) {
  emit('getProductData', {
    type: 'rent',
    data: toRaw(item)
  });
  clearSearch();
}

async function onClickBuy(item) {
  emit('getProductData', {
    type: 'buy',
    data: toRaw(item)
  });
  clearSearch();
}

function pressedEnter(event){
  event.preventDefault();
  enter_pressed.value = true;
  emit('getProductData', searchTerms.value);
  
  if(!isProductListPage){
    helper.productSearchRedirect(searchTerms.value);
  }
  emitter.emit('from-widget-search-product', searchTerms.value);
  searchItems.value = [];
}

let focus_in_timeout = null;
function focusOut(){
  clearTimeout(focus_in_timeout);
  focus_in_timeout = setTimeout(() => {
    searchItems.value = [];
  }, 100)
}
function clear_focus_in_timeout (){
  clearTimeout(focus_in_timeout);
}
function createProductURL(product){  
  let { page } = window?.RENTMY_GLOBAL
  if(product?.type == 1){
      return helper.withURL.setQuery({'uid': product?.uuid,}, page.product_details, true)
  } else {
      return helper.withURL.setQuery({'uid': product?.uuid,}, page.package_details, true)
  } 
}

</script>

<template>
    <div class="m-portlet__body form-panel p-0 pt-0 add-item-form-area-new" v-bind="$attrs">
        <div class="row m-0">
            <div class="form-group admin-cart orderitem-search col-md-12 p-0 mb-0">
                <input
                    v-model="searchTerms"
                    @keyup.enter="pressedEnter"
                    @click="allowSearch = true"
                    @keydown="allowSearch = true"
                    @touchstart="allowSearch = true"
                    @focusin="clear_focus_in_timeout"
                    @focusout="focusOut"
                    @input="searchTerms ? false : helper.withURL.deleteQuery('search')"
                    ref="searchInputField"
                    autocapitalize="off"
                    autocorrect="off"
                    role="combobox"
                    aria-multiline="false"
                    id="typeahead-http"
                    name="search"
                    type="text"
                    class="form-control"
                    placeholder="Search Item"
                    autocomplete="off"
                    aria-autocomplete="list"
                    aria-expanded="false"
                />
                <Loader v-if="loader" margin="5px 0px 0px 5px" absolute="true" top="13px" right="60px"></Loader>
                <div v-if="searchTerms" @click="clearSearch" class="search-close-icon"><i class="fa fa-close"></i></div>
            </div>
        </div>
    </div>
    <div v-if="searchItems?.length" class="item-search-dropdown" :class="searchDropdownActive()">
      <ul class="dropdown dropshadow">
        <li v-for="item in searchItems" :key="item">
          <template v-if="showBuyRent">
            <button v-if="item.buy || item.rent" type="button" role="option" class="dropdown-item">
                <div>{{item.name}}</div>
                <div class="colorPurpel">
                  <small style="font-style: italic;">
                    {{ formatVarientLabel(item) }}
                  </small>
                </div>
                <div class="mt-2">
                    <button v-if="item.buy" @click.stop="onClickBuy(item)" class="btn btn-sm btn-xsm btn-outline-dark" style="margin-right: 10px;">Buy</button>
                    <button v-if="item.rent" @click.stop="onClickRent(item)" class="btn btn-sm btn-xsm btn-outline-danger">Rent</button>
                </div>
            </button>
          </template>
          <template v-else>
            <a v-if="item.buy || item.rent" type="button" role="option" class="dropdown-item" :href="createProductURL(item)">
                <div>{{item.name}}</div>
                <div class="colorPurpel">
                  <small style="font-style: italic;">
                    {{ formatVarientLabel(item) }}
                  </small>
                </div>
            </a>
          </template>
        </li>
      </ul>
    </div>
</template>

<style>
</style>