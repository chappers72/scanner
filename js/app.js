/**
 * Created by StevenChapman on 19/05/15.
 */
var app = angular.module('scanner', ['ngMaterial', 'ngMdIcons', 'ui.router', 'http-post-fix', 'scanner.config']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/scan-home');
    $stateProvider
        .state('scan home', {
            url: '/scan-home',
            templateUrl: 'views/partial-scan-home.html',
        })
        .state('scan', {
            url: '/scan',
            templateUrl: 'views/partial-scan.html',
        })
        .state('settings', {
            url: '/config',
            templateUrl: 'views/partial-config.html',
            controller: function ($scope, promiseObj) {
                // You can be sure that promiseObj is ready to use!
                $scope.config = {};
                $scope.items = promiseObj.data;
            },
            resolve: {
                promiseObj: function (orderconfig) {
                    return orderconfig.getStages();
                }
            }

        })
        .state('scan-result', {
            url: '/scan-result',
            templateUrl: 'views/partial-scan-result.html',
            controller: function ($scope, promiseObj) {
                // You can be sure that promiseObj is ready to use!
                $scope.item = promiseObj.data.order;
            },
            resolve: {
                promiseObj: function (orderid, orderconfig) {
                    // $http returns a promise for the url data
                    return orderconfig.checkOrder(orderid.getOrderId());
                    //return $http({method: 'GET', url: '/sample.json'});
                }
            }
        });
})

angular.module('http-post-fix', [], function ($httpProvider) {
    // This code is taken from http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/

    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.common.Authorization = 'Basic ' + window.btoa("Test User:password");

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