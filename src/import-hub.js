import mitt from 'mitt'
export const emitter = mitt()
// Doc: https://www.npmjs.com/package/mitt

/* -------------------------------------------------------------------------- */
/*                                  Utitilies                                 */
/* -------------------------------------------------------------------------- */
import helper from '@utils/helper';
import http from '@utils/http';
import cookie from '@utils/cookie';

export const utils = {
    helper,
    http,
    cookie,
}

/* -------------------------------------------------------------------------- */
/*                                  toaster                                   */
/* -------------------------------------------------------------------------- */
/**
 >>> Usecase
import { Toaster } from '@/import-hub';
 Toaster().success('Message here')
 Toaster().warning('Message here')
 Toaster().error('Message here')
 */
import { useToaster } from '@/stores/toaster';
export const Toaster = useToaster;


/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */
import Loader from '@components/Loader.vue';
import LoaderGlobal from '@components/LoaderGlobal.vue';
import toaster from '@components/Toaster.vue';

export const components = {
    Loader,
    LoaderGlobal,
    Toaster: toaster,
}
