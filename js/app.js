/**
 * Created by StevenChapman on 19/05/15.
 */
var app = angular.module('scanner', ['ngMaterial', 'ngMdIcons', 'ui.router','http-post-fix']);

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
                $scope.items = promiseObj;
            },
            resolve: {
                promiseObj: function ($http) {
                    return [{val: "Scanning Room", key: '0'}, {val: "Production", key: '1'}, {
                        val: "Q.A. Inspection",
                        key: '2'
                    }, {val: "Delivery", key: '3'}];
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
                promiseObj: function ($http) {
                    // $http returns a promise for the url data
                    return $http({method: 'GET', url: '/sample.json'});
                }
            }
        });
    var config_data = {
        'GENERAL_CONFIG': {
            // 'API_URL': 'http://bromo.trailfinders.com:8002', //Node Server for Superfacts API
            'API_URL': 'http://31.49.241.45/org/orderconfig.nsf/data.xsp', //Node Server for Superfacts API
        }
    }
    angular.forEach(config_data,function(key,value) {
        app.constant(value,key);
    })
})

app.controller('scan', ['$scope', '$mdSidenav', 'qrfactory', '$state','orderconfig', function ($scope, $mdSidenav, qrfactory, $state, orderconfig) {
    $scope.$on('$stateChangeSuccess', function (event, toState) {
        if (toState.name === 'scan-result') {
            $scope.back = true;
        }
    });
    $scope.$on('$viewContentLoaded',
        function (event, viewConfig) {
            if ($state.current.name=='scan') {
                qrfactory.scan().then(function (_data) {
                    $scope.qrresult = _data;
                });
            }
            ;
        });

    chrome.storage.local.get('station', function (data) {
        $scope.station = data.station;
    });
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
            if ($scope.qrresult)
                $state.go('scan-result')
        }
    );

    $scope.changestate = function (s) {
        $state.go(s);
        orderconfig.checkOrder('ROHH-95YM6Q');
    }

    //Config code
    $scope.saveStation = function (val) {
        // Check that there's some code there.
        if (!val) {
            message('Error: No value specified');
            return;
        }
        // Save it using the Chrome extension storage API.
        chrome.storage.local.set({'station': val.station});
    }


    //End config code
}]);


app.directive('mdTable', function () {
    return {
        restrict: 'E',
        scope: {
            headers: '=',
            content: '=',
            sortable: '=',
            filters: '=',
            customClass: '=customClass',
            thumbs: '=',
            count: '='
        },
        controller: function ($scope, $filter, $window) {
            var orderBy = $filter('orderBy');
            $scope.tablePage = 0;
            $scope.nbOfPages = function () {
                return Math.ceil($scope.content.length / $scope.count);
            },
                $scope.handleSort = function (field) {
                    if ($scope.sortable.indexOf(field) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                };
            $scope.order = function (predicate, reverse) {
                $scope.content = orderBy($scope.content, predicate, reverse);
                $scope.predicate = predicate;
            };
            $scope.order($scope.sortable[0], false);
            $scope.getNumber = function (num) {
                return new Array(num);
            };
            $scope.goToPage = function (page) {
                $scope.tablePage = page;
            };
        },
        template: angular.element(document.querySelector('#md-table-template')).html()
    }
});

angular.module('http-post-fix', [], function ($httpProvider) {
    // This code is taken from http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/

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