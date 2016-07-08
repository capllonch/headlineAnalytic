function setConfig($locationProvider, $routeProvider){
	$locationProvider.html5Mode(true);
	$routeProvider
	.when('/', {
		controller:'indexController',
		templateUrl:'./views/index.html',
		controllerAs: 'index'
	})
	.when('/graph/:concept/:filter/:title/:id', {
		controller: 'dataReqController',
		templateUrl: './views/graph.html',
		controllerAs: 'dataReq'
		//pillo controlador, prillo template y le asigno alias
	})
};

(function(){
	angular.module('myApp', ['ngRoute','myApp.controllers','myApp.directives'])
	.config(['$locationProvider','$routeProvider', setConfig])
})();