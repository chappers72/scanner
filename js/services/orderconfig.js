/**
 * Created by Mark on 26/05/2015.
 */
var app = angular.module('scanner');
app.service('orderconfig', ['$http', 'GENERAL_CONFIG', function ($http, GENERAL_CONFIG) {

    //CHECK ORDER
    this.checkOrder = function (orderid) {
        return $http({
            method: 'POST',
            data: {
                'orderid': orderid,
                'command': 'check'
            },
            url: GENERAL_CONFIG.API_URL
        });
    };

    this.orderIn = function (orderid, stage) {
       return $http({
            method: 'POST',
            data: {
                'orderid': orderid,
                'command': 'in',
                'stage': stage.toLowerCase()
            },
            url: GENERAL_CONFIG.API_URL
        })
    };

    this.orderOut = function (orderid, stage) {
        return $http({
            method: 'POST',
            data: {
                'orderid': orderid,
                'command': 'out',
                'stage': stage.toLowerCase()
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
                'stage': stage.toLowerCase()
            },
            url: GENERAL_CONFIG.API_URL
        });
    };

    this.getStages = function () {
        return $http({
            method: 'POST',
            data: {
                'command': 'getstages'
            },
            url: GENERAL_CONFIG.API_URL
        });
    }

}])