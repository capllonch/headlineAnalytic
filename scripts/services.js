(function(){
angular.module('myApp.services', ['ngResource'])
	.factory('indexApi',function($resource){
		return $resource('./data/eurostatConfig.json')
		//@ es variable no literal
	})
	.constant('BaseUrl', 'http://ec.europa.eu/eurostat/wdds/rest/data/v2.1/json/en/')
	.factory('euroApi',function($resource, BaseUrl){
		return $resource(BaseUrl + ':concept' + '?' + ':filter' +':title' +':id',
			{concept: '@concept', filter: '@filter', title: '@title', id: '@id'})
		//@ es variable no literal
	});

})();