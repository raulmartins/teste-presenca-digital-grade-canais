angular.module('myApp', ['ngRoute','myApp.canal']).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/canal'});
}]);
