/**
 * Created by StevenChapman on 13/07/15.
 */
var app = angular.module('scanner');

app.controller('scan',
    [
        '$scope',
        '$mdSidenav',
        'qrfactory',
        '$state',
        'orderconfig',
        '$http',
        'orderid',
        'utils',
        function ($scope, $mdSidenav, qrfactory, $state, orderconfig, $http, orderid,utils) {

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
            if (!data.station) {
                $scope.changestate('settings');
            } else {
                $scope.station = data.station;
            }
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

        $scope.doScan = function () {
            qrfactory.scan().then(function (_data) {
                $scope.qr.qrresult = _data;
            });
        };

        $scope.changestate = function (s) {
            $state.go(s);
        };

        $scope.resetScanMessage = function () {
            $scope.scanErr = false;
            $scope.scanSucc = false;
        };

        $scope.resetManualMessage = function () {
            $scope.manualerr = false;
        };


        //Start of setting and getting order info
        //Looks up an order and get the data back. Uses service to hold the id from the scan.
        $scope.lookupOrder = function (a) {
            $scope.manualerr = false;
            if (a === '') {
                $scope.manualerr = true;
                return;
            }
            orderid.setOrderId(a);
            $state.go('scan-result');
        };

        //Scans in     
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
                    $scope.scanresult = 'Thank you. Your item has been scanned out and updated successfully.';
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