/**
 * Created by StevenChapman on 19/05/15.
 */
var app = angular.module('scanner', ['ngMaterial', 'ngMdIcons', 'ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/scan');

    $stateProvider

        .state('scan', {
            url: '/scan',
            templateUrl: 'views/partial-scan.html'
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
    $scope.toggleSidenav = toggleSidenav;
    $scope.menuItems = [{title: 'scan code'}, {title: 'manual'}, {title: 'settings'}]
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
            //addLogItem( $scope.watchLog );
        }
    );

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
            thumbs:'=',
            count: '='
        },
        controller: function ($scope,$filter,$window) {
            var orderBy = $filter('orderBy');
            $scope.tablePage = 0;
            $scope.nbOfPages = function () {
                return Math.ceil($scope.content.length / $scope.count);
            },
                $scope.handleSort = function (field) {
                    if ($scope.sortable.indexOf(field) > -1) { return true; } else { return false; }
                };
            $scope.order = function(predicate, reverse) {
                $scope.content = orderBy($scope.content, predicate, reverse);
                $scope.predicate = predicate;
            };
            $scope.order($scope.sortable[0],false);
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