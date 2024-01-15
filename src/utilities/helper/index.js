import moment from 'moment/moment';

const helpers = {    
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
}

export default helpers