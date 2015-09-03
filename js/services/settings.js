/**
 * Created by StevenChapman on 29/07/15.
 */
var app = angular.module('scanner');
app.service('settingsconfig', ['$q', function ($q) {

    //Change to false to turn off console logging
    var logEnabled=true;

    //Default Server Address
    var serverendpoint ='31.49.241.45';
    //This Station Name - held locally
    var station="";
    //Standard User - used for Authentication
    var user = {};

    return {
        //Get Manifest Version Number
        getVersion: function () {
            return chrome.runtime.getManifest().version;
        },

        //Load up settings which have been saved to local storage
        getSettingsFromLocalVariables: function (key) {
            var deferred = $q.defer();
            var self = this;
            chrome.storage.local.get(key, function(data) {
             if(data[key]){
                if(data[key].server){
                    self.serverendpoint = data[key].server;
                }
                if(data[key].user){
                    self.user = data[key].user;
                }
                if(data[key].station){
                    self.station = data[key].station;
                }
                 deferred.resolve(data[key]);
             }else{
                 deferred.reject('No Settings');
             }

            });

            return deferred.promise;
        },

        getLogEnabled:function(){
            return this.logEnabled;
        },
        getServerEndPoint:function(){
            return this.serverendpoint;
        },
        getUser:function(){
            return this.user;
        },
        getStation:function(){
            return this.station;
        }

    }
}])