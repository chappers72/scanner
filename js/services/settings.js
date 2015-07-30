/**
 * Created by StevenChapman on 29/07/15.
 */
var app = angular.module('scanner');
app.service('settingsconfig', ['$q', function ($q) {
   var serverendpoint ='31.49.241.45';
    var inoutstages=[];
    return {
        getVersion: function () {
            return chrome.runtime.getManifest().version;
        },

        get: function (key) {
            var deferred = $q.defer();
            var self = this;
            chrome.storage.local.get(key, function(data) {
                self.serverendpoint = data[key].server;
                deferred.resolve(data[key]);
            });

            return deferred.promise;
        },
        stateconfigdata: function(_data,station){
            console.log('here',_data, station)
            var self = this;
            for(i = 0;i < _data.length;i++){
                console.log(_data[i]);
                if(station==_data[i].stage){
                    this.inoutstages=_data[i].inStages;
                }
            }

        }
    }
}])