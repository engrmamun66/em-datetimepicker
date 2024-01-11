import checkoutEvents from './checkoutEvents'
import noceSecurityEvents from './noceSecurityEvents'
import authEvents from './authEvents'
import cartEvents from './cartEvents'
import logoutEvents from './logoutEvents'
import ResetPasswordEvents from './ResetPasswordEvents'
import globalLoaderEvents from './globalLoaderEvents'

const retnmy_events = [ 
    ...authEvents,
    ...cartEvents,
    ...logoutEvents,
    ...ResetPasswordEvents,
    ...globalLoaderEvents,
    ...checkoutEvents,
    ...noceSecurityEvents,
];


export default retnmy_events;


