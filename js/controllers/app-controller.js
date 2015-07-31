/**
 * Created by StevenChapman on 13/07/15.
 */
var app = angular.module('scanner');

app.controller('scan',
    [
        '$scope',
        'qrfactory',
        '$state',
        'orderconfig',
        '$http',
        'orderid',
        '$timeout',
        'settingsconfig',
        function ($scope, qrfactory, $state, orderconfig, $http, orderid, $timeout, settingsconfig) {

            $scope.qr = {}
            $scope.$on('$viewContentLoaded',
                function (event, viewConfig) {
                    if ($state.current.name == 'scan') {
                        qrfactory.reset();
                        qrfactory.scan().then(function (_data) {
                            $scope.qr.qrresult = _data;
                            $state.go('scan-result-flow');
                        });
                    }
                });


            $scope.version = settingsconfig.getVersion();
            $scope.menuItems = [{title: 'scan'}, {title: 'manual'}, {title: 'settings'}]

            settingsconfig.get('settings').then(function (_data) {
                $scope.settings = _data;
                if ($scope.settings.user.name == '' || $scope.settings.user.password == '' || $scope.settings.station == '' || $scope.settings.server == '') {
                    $scope.changestate('settings');
                }
            }).then(function () {
                orderconfig.getStages().then(function(_data){
                    settingsconfig.stateconfigdata(_data.data,$scope.settings.station)
                }, function (err) {
                    //We cant get to the server to redirect to settings with an error message
                    $scope.changestate('settings');
                });
            });

            $scope.doScan = function () {
                qrfactory.scan().then(function (_data) {
                    $scope.qr.qrresult = _data;
                });
            };

            $scope.reloadApp = function () {
                chrome.runtime.reload();
            };

            $scope.changestate = function (s) {
                $state.go(s);
            };

            $scope.resetScanMessage = function () {
                $scope.scanErr = false;
                $scope.scanSucc = false;
                $scope.changestate('scan home')
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
                $scope.changestate('scan-result-flow');
            };

            //Scans in
            $scope.scanIn = function (a) {
                orderconfig.orderIn(a, $scope.settings.station)
                    .then(function (_data) {
                        $scope.scanErr = false;
                        $scope.scanSucc = true;
                        $scope.scanresult = 'Thank you. Your order has been scanned in and updated successfully.';
                    }, function (err) {
                        $scope.scanErr = true;
                        $scope.scanSucc = false;
                        $scope.scanresult = err.statusText;
                    });
            };

            //Hide / show action button - checks Order Data which holds which buttons to display sent from server
            $scope.hasButton=function(key){
                if(orderid.orderObject.buttons){

                    for(var i=0;i<orderid.orderObject.buttons.length;i++){
                        if(orderid.orderObject.buttons[i]===key) {
                            return true;
                        }
                    }

                }
                return false;
            }

            //QA Reject
            $scope.scanQAReject = function (a) {
                orderconfig.scanQAReject(a, $scope.settings.station)
                    .then(function (_data) {
                        $scope.scanErr = false;
                        $scope.scanSucc = true;
                        $scope.scanresult = 'Thank you. Your order has been updated successfully.';
                    }, function (err) {
                        $scope.scanErr = true;
                        $scope.scanSucc = false;
                        $scope.scanresult = err.statusText;
                    });
            };

            $scope.scanOut = function (a) {
                orderconfig.orderOut(a, $scope.settings.station)
                    .then(function (_data) {
                        $scope.scanErr = false;
                        $scope.scanSucc = true;
                        $scope.scanresult = 'Thank you. Your order has been scanned out and updated successfully.';
                    }, function (err) {
                        $scope.scanErr = true;
                        $scope.scanSucc = false;
                        $scope.scanresult = err.statusText;
                    });
            };

            //Config code
            $scope.saveConfig = function (val) {
                // Check that there's some code there.
                if (!val) {
                    message('Error: No value specified');
                    return;
                }
                $scope.settingsUpdate = true;
                // Save it using the Chrome extension storage API.
                chrome.storage.local.set({'settings': val});
                $timeout(function () {
                    chrome.runtime.reload();
                }, 2000);
            }
            //End config code

            //Type ahead code
            $scope.querySearch = function(query) {
                return $http({
                    method: 'POST',
                    data: {
                        'orderid': query,
                        'command': 'typeahead'
                    },
                    url: 'http://'+settingsconfig.serverendpoint+GENERAL_CONFIG.API_URL
                })
                    .then(function (_data) {
                        return _data.data;
                    })

            }
            //End Type ahead code

        }])