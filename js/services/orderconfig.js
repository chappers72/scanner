/**
 * Created by Mark on 26/05/2015.
 */
var app = angular.module('scanner');
app.service('orderconfig',['$http', function ($http) {

    //CHECK ORDER
    this.checkOrder = function (orderid) {
        console.log(GENERAL_CONFIG);
        return $http({
            method: 'POST',
            data: {
                'orderid': orderid,
                'command': 'check'
            },
            //url: GENERAL_CONFIG.API_URL
            url: 'http://31.49.241.45/org/orderconfig.nsf/data.xsp'
        });
    };

    this.orderIn = function (orderid, stage) {
        return $http({
            method: 'POST',
            data: {
                'orderid': orderid,
                'command': 'in',
                'stage': stage
            },
            url: GENERAL_CONFIG.API_URL
        });
    };

    this.orderOut = function (orderid, stage) {
        return $http({
            method: 'POST',
            data: {
                'orderid': orderid,
                'command': 'out',
                'stage': stage
            },
            url: GENERAL_CONFIG.API_URL
        });
    };

    this.orderReject = function (orderid, stage) {
        return $http({
            method: 'POST',
            data: {
                'orderid': orderid,
                'command': 'outreject',
                'stage': stage
            },
            url: GENERAL_CONFIG.API_URL
        });
    };

}])