import { usingPages } from './_fn';

export default [
    {
        title: 'Auth Pages Events',
        usingInFile: 'rc/utilities/domElement/index.js',
        events: [
            {
                hook_type: 'filter',
                name: 'AuthPageAcees:Message',
                param: 'message',
                return_type: ':string',
                using_pages: usingPages(['login', 'registration', 'customer_change_password', 'customer_change_avatar', 'customer_order_history', 'order_details']),
                description: '',
            },
        ],
    },
];

