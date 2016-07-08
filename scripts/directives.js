var Directives = (function(){
	_headerDirective = function(){
		return {
			restrict: 'A',
			templateUrl: './views/header.html'
		}
	};

	_footerDirective = function(){
		return{
			restrict: 'A',
			templateUrl: './views/footer.html'
		};
	};


	return {
		headerDirective: _headerDirective,
		footerDirective: _footerDirective
	};
})();

(function(){
	angular.module('myApp.directives', [])
	.directive('headerDirective', Directives.headerDirective)
	.directive('footerDirective', Directives.footerDirective)
})();