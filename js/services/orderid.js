/**
 * Created by Mark on 26/05/2015.
 */
var app = angular.module('scanner');
app.service('orderid',['$http', function ($http) {

    //Set ORDERID
    this.setOrderId = function (orderid) {
        this.orderid = orderid;
    };
    //Get ORDERID
    this.getOrderId = function () {
        return this.orderid;
    };

    //Set stage status
    this.setStatus = function(_data,station){
        for (i = 0; i < _data.length; i++) {
            if(station==_data[i].stageName){
                if(_data[i].in===''){
                    return 'in';
                }else if(_data[i].out===''){
                    return 'out';
                }else{
                    return 'none'
                }
            };
        }
    };

    //Set network status
    this.setNetworkStatus = function(t){
        return t;
    }

}])