class EmDatetimePickerClass {
    constructor() {
        this.elements = [];
        this.events = {};
        this.filters = {};
    }

    // adding Element 
    init(inputElement){
        this.elements = [...this.elements, inputElement];
    }  

    

    /* ---------------------------------- */
    /*            Start Listener          */
    /* ---------------------------------- */

    addListener(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    fireEvent(eventName, data, useFilter=true) {
        const eventHandlers = this.events[eventName] || [];
        const allEventHandlers = this.events['*'] || [];

        [...eventHandlers, ...allEventHandlers].forEach(handler => {
            let _data = useFilter ?  this.apply_filters(eventName, data) : data
            handler(_data);
        });
    }

    removeListener(eventName, callback) {
        const eventHandlers = this.events[eventName];
        if (eventHandlers) {
            this.events[eventName] = eventHandlers.filter(handler => handler !== callback);
        }
    }   
    /* ----------- End Listener ----------- */



    /* ---------------------------------- */
    /*          Start Filter Hook         */
    /* ---------------------------------- */
    add_filter(filterName, callback) {
        if (!this.filters[filterName]) {
            this.filters[filterName] = [];
        }
        this.filters[filterName].push(callback);
    }

    apply_filters(filterName, data) {
        const filterCallbacks = this.filters[filterName] || [];
        return filterCallbacks.reduce((filteredData, callback) => callback(filteredData), data);
    }

    remove_filter(filterName, callback) {
        const filterCallbacks = this.filters[filterName];
        if (filterCallbacks) {
            this.filters[filterName] = filterCallbacks.filter(handler => handler !== callback);
        }
    }

    remove_filters(filterName) {
        this.filters[filterName] = [];
    }
    /* --------- End Filter Hook -------- */

    clearAll(){
        this.events = {};
        this.filters = {};
    }
}

export default new EmDatetimePickerClass();

// export default EmDatetimePickerClass;
