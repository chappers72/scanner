/**
 * Created by Mark on 26/05/2015.
 */
var app = angular.module('scanner');
app.service('orderconfig', ['$http', 'GENERAL_CONFIG', 'settingsconfig','log', function ($http, GENERAL_CONFIG, settingsconfig,log) {


    //Command to send to service
    //This will cover check, in, out, outreject
    this.sendCommand=function(orderid,command){
        var url='http://' + settingsconfig.serverendpoint + GENERAL_CONFIG.API_URL
        log.logMsg('EXTERNAL >> sendCommand ('+command+') - '+orderid+' >> ' + url);

        return $http({
            method: 'POST',
            data: {
                'orderid': orderid,
                'command': command,
                'stage':settingsconfig.station.toLowerCase().replace(/ /g, '')
            },
            headers: {
                'Authorization': 'Basic ' + window.btoa(settingsconfig.user.name+':'+settingsconfig.user.password)},
            timeout: 3000,
            url: 'http://' + settingsconfig.serverendpoint + GENERAL_CONFIG.API_URL
        })

    }


    this.getStages = function () {
        var url='http://' + settingsconfig.serverendpoint + GENERAL_CONFIG.API_URL
        log.logMsg('EXTERNAL >> getStages >> ' + url);

        return $http({
            method: 'POST',
            data: {
                'command': 'getstages'
            },
            headers: {
                'Authorization': 'Basic ' + window.btoa(settingsconfig.user.name+':'+settingsconfig.user.password)},
            timeout: 3000,
            url: url
        });
    }

    this.resetConnectionError = function () {
        $scope.connectionError = false;
    }

}])