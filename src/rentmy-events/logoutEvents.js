import { usingPages } from './_fn';

export default [  
    
    {
        title: 'Logout Events',
        usingInFile: 'src/utilities/domElement/index.js',
        events: [
            {
                hook_type: 'filter',
                name: 'logoutRedirectUrl',
                param: 'url',
                return_type: ':string',
                using_pages: usingPages(['login', 'registration', 'customer_change_password', 'customer_change_avatar', 'customer_order_history', 'order_details']),
                description: '',
            },
            {
                hook_type: 'filter',
                name: 'logoutMessage',
                param: 'message',
                return_type: ':string',
                using_pages: usingPages(['login', 'registration', 'customer_change_password', 'customer_change_avatar', 'customer_order_history', 'order_details']),
                description: '',
            },
        ],
    },    

];


