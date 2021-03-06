/**
 * Created by StevenChapman on 19/05/15.
 */
var app = angular.module('scanner', ['ngMaterial', 'ngMdIcons', 'ui.router', 'http-post-fix', 'scanner.config']);

app.config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $mdThemingProvider.definePalette('trulifePalette', {
        '50': 'ffebee',
        '100': 'ffcdd2',
        '200': 'ef9a9a',
        '300': 'E8F0FB',
        '400': 'ef5350',
        '500': '009999',
        '600': 'e53935',
        '700': 'd32f2f',
        '800': 'c62828',
        '900': 'b71c1c',
        'A100': 'ff8a80',
        'A200': 'ff5252',
        'A400': 'ff1744',
        'A700': 'd50000',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
            '200', '300', '400', 'A100'],
        'contrastLightColors': ['50', 'A100']    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.theme('default')
        .primaryPalette('trulifePalette')


    $urlRouterProvider.otherwise('/scan-home');
    $stateProvider
        .state('scan home', {
            url: '/scan-home',
            templateUrl: 'views/partial-scan-home.html',
            controller:function($scope,promiseObj){
                if(promiseObj.data){
                    $scope.availableStages = promiseObj.data;
                }
            },
            resolve:{
                    promiseObj: function (orderconfig,log) {
                    return  orderconfig.getStages().then(function (_data) {
                        return _data;
                    });
                }
            }
        })
        .state('scan', {
            url: '/scan',
            templateUrl: 'views/partial-scan.html'
        })
        .state('manual', {
            url: '/manual',
            templateUrl: 'views/partial-manual.html'
        })
        .state('report', {
            url: '/report',
            templateUrl: 'views/partial-report.html',
            controller: function ($scope, promiseObj) {
                $scope.reportData={}
                if(promiseObj.data.Orders){
                    $scope.reportData = promiseObj.data.Orders;
                }

            },
            resolve: {
                promiseObj: function (orderconfig,log) {
                    // $http returns a promise for the url data
                    return orderconfig.sendCommand('','report').then(function (_data) {
                        if(!_data.data){
                            return{'data':{'Orders':[]}}
                        }
                        if (_data.data.Orders) {
                            log.logMsg("Success in getting Report");
                            return _data
                        }
                        else {
                            log.logMsg("ERROR >> No Order found but we got a HTTP 200");
                            return {'data': {'Orders':[], 'msg': 'No order data was found for this reference.'}}
                        };
                    }, function (err) {
                        log.logMsg("ERROR >> " + err.statusText);
                        if (err.statusText == '') {
                            err.statusText = 'A connection error has occurred. No data can be retrieved. Click OK to edit your settings.'
                        }
                        return {'data': {'order': '', 'msg': err.statusText}}
                    });


                }
            }
        })
        .state('settings', {
            url: '/config',
            templateUrl: 'views/partial-settings.html',
            controller: function ($scope, promiseObj) {
                 $scope.config = {};
                 $scope.items = promiseObj.data; //Setting Information got via AJAX request
            },
            resolve: {
                promiseObj: function (orderconfig,log) {
                    return orderconfig.getStages().then(function (_data) {
                        log.logMsg("Got List of Stages in preparation for displaying Settings Screen")
                        return _data;
                    }, function (err) {

                        log.logMsg("ERROR >> " + err.statusText)
                        return {'data': {'networkerror': 'true'}}
                    });

                }
            }
        })
        .state('scan-result-flow', {
            url: '/scan-result-flow',
            templateUrl: 'views/partial-scan-result-flow.html',
            controller: function ($scope, promiseObj, orderid) {
                $scope.item = orderid.setStageGraduation(promiseObj.data.order);
                orderid.orderObject = promiseObj.data.order;
                $scope.errMsg = promiseObj.data.msg;
            },
            resolve: {
                promiseObj: function (orderid, orderconfig,log) {
                    // $http returns a promise for the url data
                    return orderconfig.sendCommand(orderid.getOrderId(),'check').then(function (_data) {
                        if (_data.data.order) {
                            log.logMsg("Success in getting Order " + _data.data.order.orderid);
                            return _data
                        }
                        else {
                            log.logMsg("ERROR >> No Order found but we got a HTTP 200");
                            return {'data': {'order':'', 'msg': 'No order data was found for this reference.'}}
                        };
                    }, function (err) {
                        log.logMsg("ERROR >> " + err.statusText);
                        if (err.statusText == '') {
                            err.statusText = 'A connection error has occurred. No data can be retrieved. Click OK to edit your settings.'
                        }
                        return {'data': {'order': '', 'msg': err.statusText}}
                    });


                }
            }
        });
})

angular.module('http-post-fix', [], function ($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '';
            var name, value, subName, fullSubName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});