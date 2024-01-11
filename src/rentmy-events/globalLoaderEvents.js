import { usingPages } from './_fn';

export default [    
    {
        title: 'Global Loader',
        usingInFile: 'src/components/LoaderGlobal.vue',
        events: [
            {
                hook_type: 'filter',
                name: 'GlobalLoader:Color',
                param: 'color',
                return_type: ':string',
                using_pages: 'In Most of pages',
                description: 'This the background color of global circle loader',
            },
        ],
    },

];


