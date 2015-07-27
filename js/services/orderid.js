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
        if(_data ==''){
            return 'error';
        }
        for (i = 0; i < _data.stageInformation.length; i++) {
            if(station==_data.stageInformation[i].stageName){
                if(_data.stageInformation[i].in===''){
                    return 'in';
                }else if(_data.stageInformation[i].out===''){
                    return 'out';
                }else{
                    return 'none'
                }
            };
        }
    };


}])