/**
 * Created by Mark on 26/05/2015.
 */
var app = angular.module('scanner');
app.service('orderconfig', ['$http', 'GENERAL_CONFIG', 'settingsconfig','log', function ($http, GENERAL_CONFIG, settingsconfig,log) {


    var stages={}; //The stages

    //Command to send to service
    //This will cover check, in, out, outreject
    this.sendCommand=function(orderid,command){
        var url='http://' + settingsconfig.getServerEndPoint() + GENERAL_CONFIG.API_URL
        log.logMsg('EXTERNAL >> sendCommand ('+command+') - '+orderid+' >> ' + url);

        var username="";
        var password="";
        var station="";

        if(settingsconfig.getUser()){
            username=settingsconfig.getUser().name;
            password=settingsconfig.getUser().password;
        }
        if(settingsconfig.getStation()){
            station=settingsconfig.getStation();
        }
        return $http({
            method: 'POST',
            data: {
                'orderid': orderid,
                'command': command,
                'currentstage':station.toLowerCase().replace(/ /g, '')
            },
            headers: {
                'Authorization': 'Basic ' + window.btoa(username+':'+password)},
            timeout: 3000,
            url: url
        })

    }


    this.getStages = function () {
        var url='http://' + settingsconfig.getServerEndPoint() + GENERAL_CONFIG.API_URL
        log.logMsg('EXTERNAL >> getStages >> ' + url);

        var username="";
        var password="";

        if(settingsconfig.getUser()){
            username=settingsconfig.getUser().name;
            password=settingsconfig.getUser().password;
        }

        return $http({
            method: 'POST',
            data: {
                'command': 'getstages'
            },
            headers: {
                'Authorization': 'Basic ' + window.btoa(username+':'+password)},
            timeout: 3000,
            url: url
        });
    }

    this.resetConnectionError = function () {
        $scope.connectionError = false;
    }

}])