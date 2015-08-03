/**
 * Created by Mark on 03/08/2015.
 */
var app = angular.module('scanner');
app.service('log', ['settingsconfig', function (settingsconfig) {

    this.logMsg=function(msg){
        if(settingsconfig.getLogEnabled()){
            console.log(msg);
        }
    }

}])