import moment from 'moment/moment';

const helpers = {
    domParser: function(html_content=''){
        if(!html_content) return;
        let parser = new DOMParser();
        let dom = parser.parseFromString(html_content, 'text/html');
        return dom;
    },
    createEvent(eventName, data={}){
        return new CustomEvent(eventName, {
            bubbles: false,
            cancelable: false,
            detail: data,
        })
    },
    makeDate: function(dateTimeString, format){
        let date = new Date(dateTimeString);
        return moment().set({ 
            year: date.getFullYear(), 
            month: date.getMonth(),
            date: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
            }).format(format);

    },
    daysOfMonth: function(year, monthIndex, FORMATS, {currentMonth}={}) {
        const firstDayOfMonth = moment().year(year).month(monthIndex).date(1);
        const daysInMonth = firstDayOfMonth.daysInMonth();
        let days = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDay = firstDayOfMonth.date(day);
            const _day = {
                date: currentDay.format(FORMATS.db),
                week_index: currentDay.format(FORMATS.week_index),
                day_index: currentDay.format(FORMATS.day_index),
                weekday_short: currentDay.format(FORMATS.weekday_short),
                month_index: new Date(currentDay.format(FORMATS.db)).getMonth(),
                currentMonth: currentMonth ?? false,
            };
            days = [...days, _day];
        }
        return days;
    },
      
     
       
    /* -------------------------------------------------------------------------- */
    /*                           Device Identify with JS                          */
    /* -------------------------------------------------------------------------- */
    /**
     * How to call this device function
     * Examples:
     * device().type;
     * device().isMobile();
     * device().is('mobile');
     * device().in(['mobile', 'tablet']);
     */
    device: function() {
        const getType = () => {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return 'mobile';
            }
            else if (/iPad/i.test(navigator.userAgent)) {
                return 'tablet';
            }
            else {
                return 'desktop';
            }
        }

        function DeviceType(){
            this.type = getType();
        }

        DeviceType.prototype.is = function (deviceType='') {
            return deviceType ? this.type === deviceType : false;
        }

        DeviceType.prototype.in = function (deviceTypes=[]) {
            if(deviceTypes && Array.isArray(deviceTypes) && deviceTypes?.length){
                return deviceTypes.includes(this.type);
            } else {
                return false;
            }
        }

        DeviceType.prototype.isMobile = function (extra=null) {
            return this.type === 'mobile';
        }

        DeviceType.prototype.isTable = function () {
            return this.type === 'tablet';
        }

        DeviceType.prototype.isDesktop = function () {
            return this.type === 'desktop';
        }

        return new DeviceType();        

    },
    /* -------------------------------------------------------------------------- */
    /*                                  With URL                                  */
    /* -------------------------------------------------------------------------- */
    withURL: {
        setQuery: function(params, url = window.location.href, _return=false){
            if(!url) url = window.location.href;
            url = url?.replace(/\/$/, '')?.replace(/#$/, '');
            const currentUrl = new URL(url);
            Object.entries(params)?.forEach(param => {
                currentUrl.searchParams.set(param[0], param[1]);
            })
            if(_return){
                return currentUrl.href; // fullurl with query params
            }else{
                window.history.pushState({}, '', currentUrl);
            }
        },        
        getQuery: function(param='', url = window.location.href){        
            const currentUrl = new URL(url);            
            if(param){
                return currentUrl.searchParams.get(param);
            } else {
                const urlParams = new URLSearchParams(window.location.search);
                const paramObj = {};
                for(var value of urlParams.keys()) {
                    paramObj[value] = urlParams.get(value);
                }
                return paramObj;
            }
        },
        hasQuery: function(param='', url = window.location.href){       
            const urlParams = new URLSearchParams(new URL(url).search);
            const paramObj = {};
            for(var value of urlParams.keys()) {
                paramObj[value] = urlParams.get(value);
            }
            return param in paramObj;            
        },
        deleteQuery: function(param, url = window.location.href){
            url = url?.replace(/\/$/, '')?.replace(/#$/, '');
            const currentUrl = new URL(url);
            currentUrl.searchParams.delete(param);
            window.history.pushState({}, '', currentUrl);
        },
        encodeString: function(data) {
            try {
                return btoa(unescape(encodeURIComponent(data)))
            } catch (error) {
                return data
            }
        },
    
        decodeString: function(data) {
            try {
                return decodeURIComponent(escape(atob(data)))
            } catch (error) {
                return data
            }
        },    
        urlEncoded: function(url) {
            return encodeURIComponent(url);
        },
    },  
    toggleLoopItem: function (data, index, key = 'isShow') {
        if (!data) return
        console.log('here');
        data?.forEach((item, i) => {
            if (i == index) {
                item[key] = !(item[key] ?? false)
            } else {
                item[key] = false
            }
        })
    }, 
}

export default helpers