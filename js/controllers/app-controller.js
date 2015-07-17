/**
 * Created by StevenChapman on 13/07/15.
 */
var app = angular.module('scanner');

app.controller('scan', ['$scope', '$mdSidenav', 'qrfactory', '$state', 'orderconfig', '$http','orderid', function ($scope, $mdSidenav, qrfactory, $state, orderconfig, $http,orderid) {
    $scope.$on('$stateChangeSuccess', function (event, toState) {
        if (toState.name === 'scan-result') {
            $scope.back = true;
        }
    });
    $scope.user;
    $scope.$on('$viewContentLoaded',
        function (event, viewConfig) {
            if ($state.current.name == 'scan') {
                qrfactory.scan().then(function (_data) {
                    $scope.qrresult = _data;
                });
            }
        });

    chrome.storage.local.get('station', function (data) {
        $scope.station = data.station;
    });
    chrome.storage.local.get('user', function (data) {
        $scope.user = data.user;
    });
    $scope.version = chrome.runtime.getManifest().version;


    $scope.toggleSidenav = toggleSidenav;
    $scope.menuItems = [{title: 'scan'}, {title: 'manual'}, {title: 'settings'}]
    function toggleSidenav(name) {
        $mdSidenav(name).toggle();
    }

    $scope.loadMe = function () {
        qrfactory.scan().then(function (_data) {
            $scope.qrresult = _data;
        });
    }
    $scope.$watch(
        "qrresult",
        function (newValue, oldValue) {
            if ($scope.qrresult);
            $state.go('scan-result');
        }
    );


    $scope.changestate = function (s) {
        $state.go(s);
    };

    $scope.lookupOrder = function (a) {
        orderid.setOrderId(a);
        $state.go('scan-result');
    };

    $scope.scanIn = function(a){
        $scope.scanresult=orderconfig.orderIn(a,$scope.station);
    };

    $scope.scanOut = function(a){
        $scope.scanresult=orderconfig.orderIn(a,$scope.station);
    }

    //Config code
    $scope.saveConfig = function (val) {
        // Check that there's some code there.
        if (!val) {
            message('Error: No value specified');
            return;
        }
        // Save it using the Chrome extension storage API.
        chrome.storage.local.set({'station': val.station});
        chrome.storage.local.set({'user': val.user});
    }
    //End config code
}]);