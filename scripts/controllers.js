(function(){
var conceptsJSON;
///////////////CONTROLLER1/////////////////////////////////////////////////////
	function indexController(indexApi, $scope){
		indexApi.query().$promise.then(function(response){
			$scope.datas = response;
			conceptsJSON = response;
		});
	};
///////////////CONTROLLER2/////////////////////////////////////////////////////
	function dataReqController($routeParams, euroApi, $scope, d3Line, $http){

		function euroJSON(response, geo , geoREF){
		 //Work with euro-stat response before the d3 chart myTitle
			$scope.graphCountry = response.geo.label[geo]

			var graphArr = [];
			angular.forEach(response.time.index, function(val,key){
				graphArr.push({
					time: key,
					value: response.value[val + response.size.time * response.geo.index[geo]],
					value2: response.value[val + response.size.time * response.geo.index[geoREF]]})
			})
			return graphArr
		}

		function FTRequestConfig(){
			var svg = d3.select("#mainGR")

			svg.selectAll("rect").on("click", function(d,i){
				var months = ["01", "02", "03", "04", "05", "06", "07",
				"08", "09", "10", "11", "12"];
				
				console.log(d3.select(svg.selectAll(".circlesChart")[0][i]));
				console.log(d3.select(svg.selectAll("text")[0][i]).attr("fill","#505050"));

				var date = d.time.replace("Q","-");
				var initialTime = moment(date, "YYYY-Q");
				var iYear = moment(initialTime).year().toString();
				var iMonth = months[moment(initialTime).month()];
				var finalTime = moment(initialTime).add(1,"Q");
				var fYear = moment(finalTime).year().toString();
				var fMonth = months[moment(finalTime).month()];
				initialTime = iYear + "-" + iMonth + "-01T00:00:00Z";
				finalTime = fYear + "-" + fMonth + "-01T00:00:00Z";
				console.log($scope.infoCard.dataName.split("-")[0].split("by")[0])
				FTRequest($http, $scope.graphCountry, $scope.infoCard.dataName, initialTime, finalTime)
				//console.log($scope.graphCountry)
				$scope.infosearch = "Financial Times search for " + $scope.infoCard.dataName.split("-")[0].split("by")[0] +
				" of " + $scope.graphCountry + " since "  + iMonth + "/" + iYear + " to " + fMonth + "/" + fYear + ":";
			})
		}

		function chartConfig($routeParams, myObject, country){
			//Order for generate Chart
			console.log($routeParams.title)
			switch ($routeParams.title){
				//Without operations, one country and time
				case "Gross Debt" :
				case "Unemployment" :
				case "Labour Cost" :
				case "Labour productivity" :
				case "Youth Unemployment" :
					var result = euroJSON(myObject, country)
					d3Line.graphConstructor(result, $scope.graphCountry)
					FTRequestConfig()
				break;
				//Two parameters one country
				case "Bond Yields 10 years" :
				    var result = euroJSON($scope.myObj, country, "DE")
				    d3Line.graphConstructor(result, $scope.graphCountry)
				    FTRequestConfig()
				break;
			}
		}

		$scope.repeatFunction = function(country){
		 //Generate new Chart for others countries when you had generated one chart
		 	$scope.headlines = []
		 	$scope.infosearch = ""
			d3.select("svg").remove()
			chartConfig($routeParams, $scope.myObj, Object.keys($scope.myObj.geo.label)[country])
		}

		//Get euro-stat data////////////////////////////////////////////////////
		euroApi.get({concept: $routeParams.concept, filter: $routeParams.filter})
		.$promise.then(function(response){
			console.log(response)
			console.log($routeParams)
			
			function myObjSize(response){
				var mySize = {};
				angular.forEach(response.id, function(value, key){
					this[value] = response.size[key];
				}, mySize)
				console.log(mySize)
				return mySize
			}
			$scope.infoCard = {
				dataName: $routeParams.title,
				source: response.source,
				unit: conceptsJSON[$routeParams.id-1].unit
			}

			$scope.myObj = {
				size: myObjSize(response),
				since: response.dimension.time.category.label[Object.keys(response.dimension.time.category.label)[0]],
				to: response.dimension.time.category.label[Object.keys(response.dimension.time.category.label)[Object.keys(response.dimension.time.category.label).length - 1]],//obj[Object.keys(obj)[0]]
				time: {label: response.dimension.time.category.label,
					index: response.dimension.time.category.index},
				geo: {label: response.dimension.geo.category.label,
					index: response.dimension.geo.category.index},
				value: response.value
			}
			
			chartConfig($routeParams, $scope.myObj, "ES")
		});

		function timeNewConfig(){
			$scope.headline.lifecycle.initialPublishDateTime.substring(0,10)
		}

		function FTRequest($http, country, term, initialTime, finalTime){
			country = country.split(" ")[0]
			console.log(term.replace(" ", " OR "))
			var RequestFT = '/content/search/'
			var REQUESTConstant = 'http://api.ft.com'
			var REQKey = 'v1?apiKey=6qxxxuty6ypxf6ngndqa5zk7'

		  	$http({
		  		method: 'POST',
		  		url: REQUESTConstant + RequestFT + REQKey,
		  		headers: {
		  			'Content-Type': 'application/json'
		  		},
		  		data: {
		  			"queryString": term.replace(" ", " OR ") +" AND "+ country  
		  			+" AND (lastPublishDateTime:>"+ initialTime +" AND lastPublishDateTime:<"
		  			+ finalTime + ") AND title: " + country,

		  			"resultContext" : {
			        "aspects" : [ "title", "lifecycle","location",
								"summary","editorial"]
			      	}
		  		}
		  	}).then(function successCallback(response){
		  		console.log($scope.graphCountry)
		  		console.log(response.data.results[0].results)

		  		if(response.data.results[0].results === undefined){
		  			console.log('ooops')
		  			$scope.headlines = ["",{
		  				title: {
		  					title: "This point is irrelevant: no results found"
		  				}
		  			}]
		  		} else {
		  			$scope.headlines = response.data.results[0].results
		  		}
		  		
		  	},
		  	function errorCallback(response){
		  		console.log(response)
		  	})
		}
	}

	angular.module('myApp.controllers', ['myApp.services','myApp.servicesd3'])
	.controller('indexController', indexController)
	.controller('dataReqController', dataReqController)
})();