/**
 * Created by StevenChapman on 13/07/15.
 */
var app = angular.module('scanner');

app.controller('scan', ['$scope', '$mdSidenav', 'qrfactory', '$state', 'orderconfig', '$http', 'orderid','$timeout', function ($scope, $mdSidenav, qrfactory, $state, orderconfig, $http, orderid, $timeout) {
    $scope.$on('$stateChangeSuccess', function (event, toState) {
        if (toState.name === 'scan-result') {
            $scope.back = true;
        }else if (toState.name === 'scan home') {
            $scope.stageStatus = '';
        }
    });
    $scope.qr = {};
    $scope.$on('$viewContentLoaded',
        function (event, viewConfig) {
            if ($state.current.name == 'scan') {
                qrfactory.reset();
                qrfactory.scan().then(function (_data) {
                    $scope.qr.qrresult = _data;
                    $state.go('scan-result');
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
            $scope.qr.qrresult = _data;
        });
    }

    $scope.changestate = function (s) {
        $state.go(s);
        $mdSidenav('left').close();
    };



    $scope.resetManualMessage = function () {
        $scope.manualerr = false;
    }


    $scope.lookupOrder = function (a) {
        $scope.manualerr = false;
        if (a === '') {
            $scope.manualerr = true;
            return;
        }
        orderid.setOrderId(a);
        $state.go('scan-result');
    };

    $scope.scanIn = function (a) {
        orderconfig.orderIn(a, $scope.station)
            .then(function (_data) {
                $scope.scanErr = false;
                $scope.scanSucc = true;
                $scope.scanresult = 'Thank you. Your item has been scanned in and updated successfully.';
            }, function (err) {
                $scope.scanErr = true;
                $scope.scanSucc = false;
                $scope.scanresult = err.statusText;
            });
    };

    $scope.scanOut = function (a) {
        orderconfig.orderOut(a, $scope.station)
            .then(function (_data) {
                $scope.scanErr = false;
                $scope.scanSucc = true;
                $scope.scanresult = 'Thank you. Your item has been scanned out and updated succesfully.';
            }, function (err) {
                $scope.scanErr = true;
                $scope.scanSucc = false;
                $scope.scanresult = err.statusText;
            });
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
        $scope.changestate('scan home');
    }
    //End config code

}]);