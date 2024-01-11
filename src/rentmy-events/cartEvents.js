import { usingPages } from './_fn';

export default [   
    {
        title: 'Cart Events',
        usingInFile: 'src/modules/cart/views/cart.vue',
        events: [
            {
                hook_type: 'filter',
                name: 'Cart:ShoppingBagImage',
                param: 'imageUrl',
                return_type: ':string',
                using_pages: usingPages([]), // need to add cart page
                description: 'When the cart is empty, the output will be visible',
            },
            {
                hook_type: 'filter',
                name: 'Cart:ContinueShoppingUrl',
                param: 'pageUrl',
                return_type: ':string',
                using_pages: usingPages([]), // need to add cart page
                description: '',
            },
        ],
    },    

];


