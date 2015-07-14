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



}])