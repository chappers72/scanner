/**
 * Created by StevenChapman on 19/05/15.
 */
var app = angular.module('scanner', ['ngMaterial', 'ngMdIcons', 'ui.router']);

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
        })
})

app.controller('scan', ['$scope', '$mdSidenav', 'qrfactory', '$state', function ($scope, $mdSidenav, qrfactory, $state) {
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

