/**
 * Created by StevenChapman on 19/05/15.
 */
var app = angular.module('scanner', ['ngMaterial','ngMdIcons']);

app.controller('scan', ['$scope','$mdSidenav','QRService', function($scope, $mdSidenav, QRService) {

    $scope.toggleSidenav = toggleSidenav;
    $scope.menuItems = [{title: 'scan code'},{title: 'manual'},{title: 'settings'}]
    function toggleSidenav(name) {
        $mdSidenav(name).toggle();
    }

    $scope.loadMe = function(){
        $scope.qrcode = QRService.qrservice();
        $scope.sss = QRService.res;

    };
    $scope.$watch('sss', function() {
        console.log('hey, myVar has changed!');
    });
}]);
