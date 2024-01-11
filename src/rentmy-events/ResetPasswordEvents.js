import { usingPages } from './_fn';

export default [  
    
    {
        title: 'Reset Password Events',
        usingInFile: 'src/pages/UserResetPassword.vue',
        events: [
            {
                hook_type: 'filter',
                name: 'ResetPassword:SendEmailSuccessMsg',
                param: 'message',
                return_type: ':string',
                using_pages: usingPages(['reset_password']),
                description: '',
            },
            {
                hook_type: 'filter',
                name: 'ResetPassword:SendEmailErrorMsg',
                param: 'message',
                return_type: ':string',
                using_pages: usingPages(['reset_password']),
                description: '',
            },
            {
                hook_type: 'filter',
                name: 'ResetPassword:SuccessMsg',
                param: 'message',
                return_type: ':string',
                using_pages: usingPages(['reset_password']),
                description: '',
            },
            {
                hook_type: 'filter',
                name: 'ResetPassword:ErrorMsg',
                param: 'message',
                return_type: ':string',
                using_pages: usingPages(['reset_password']),
                description: '',
            },
        ],
    },
];


