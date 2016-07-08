(function(){
	angular.module('myApp.servicesd3',[])
		.factory('d3Line',function(){

			function dOperator(d){
				var transfromVal;
				if(d.value2 == undefined){
					transfromVal = d.value;
				} else {
					transfromVal = (d.value - d.value2)*100
				}
				return transfromVal;
			}

			function readDate(string){
				//"2001Q1" 03/2001 "2001Q2" 06/2001
				var year = string.substring(0,4);
				var month = (parseInt(string.substring(5,6),10)*3).toString();
				return month + "/" + year;
			}

			function graphConstructor(result, country){
				console.log(result)

				var w = parseInt(d3.select("#mainGR").style("width"));
				var h = parseInt(d3.select("#mainGR").style("width"))/3;

				var padding = [20,10,20,40] //top,right,bottom,left
				var dateFormat = d3.time.format("%m/%Y")

				var customTimeFormat = d3.time.format.multi([
				  ["%Y", function() { return true; }]
				]);

				var xScale = d3.time.scale()
					.range([padding[3], w -padding[1]-padding[3]]);

				var yScale = d3.scale.linear()
					.range([padding[0], h - padding[2]]);

				var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
					.tickFormat(customTimeFormat);

				var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left");

				var line = d3.svg.line()
						.defined(function(d) { return !isNaN(d.value); })
						.x(function(d){
							//console.log(d.time)
							return xScale(dateFormat.parse(readDate(d.time)));
						})
						.y(function(d){
							return yScale(dOperator(d));
						})

				var svg = d3.select("#mainGR")
					.append("svg")
					.attr("width", w)
					.attr("height", h);

				xScale.domain([
					d3.min(result, function(d){
						return dateFormat.parse(readDate(d.time));
					}),
					d3.max(result, function(d){
						return dateFormat.parse(readDate(d.time));
					})]);

				yScale.domain([
					d3.max(result, function(d){
					
						return +dOperator(d);
					}),
					d3.min(result, function(d){
						
						return +dOperator(d) -dOperator(d) * 0.4;
					})
				])

				var text = svg.selectAll("text")
					.data(result)
					.enter()
					.append("text");

				text.attr("x", function(d){
					if(xScale(dateFormat.parse(readDate(d.time))) < 0.6*w){
						return xScale(dateFormat.parse(readDate(d.time))) + 6;
					} else {
						return xScale(dateFormat.parse(readDate(d.time))) - 120;
					}
					
				})
					.attr("y", function(d){

					if(d.value == undefined){
								//If value is undefined
								this.remove()
							} else {
								return yScale(dOperator(d)) -10;
							}
				})
				.text(function(d){
					return "Value: " + d.value + ", Time: " +d.time
				})
				.attr("font-family", "sans-serif")
				.attr("font-size", "14px")
				.attr("fill", "transparent")

				var circles = svg.selectAll("circles")
							.data(result)
							.enter()
							.append("circle")

				circles.attr("cx", function(d){
							return xScale(dateFormat.parse(readDate(d.time)));
						})
						.attr("cy", function(d){
							if(d.value == undefined){
								//If value is undefined
								this.remove()
							} else {
								return yScale(dOperator(d));
							}
						})
						.attr("r",4)
						.attr("fill","transparent")
						.attr("class","circlesChart")

				var rects = svg.selectAll('rects')
					.data(result)
					.enter()
					.append('rect')

				rects.attr("x", function(d){
					return xScale(dateFormat.parse(readDate(d.time))) - 5;
				})
					.attr("width", function(){
						return w/result.length;
					})
					.attr("y", 0)
					.attr("height", h)
					.attr("fill","transparent")
					.on('mouseover', function(d,i){
						d3.select(circles[0][i]).attr("fill","rgb(155,22,79)");
						d3.select(text[0][i]).attr("fill","#505050");
					})
      				.on('mouseout', function(d,i){
      					d3.select(circles[0][i]).attr("fill","transparent");
						d3.select(text[0][i]).attr("fill","transparent");
					})

				svg.data([result])
					.append("path")
					.attr("class", "line")
					.attr("d",line)
					.attr("fill", "none")
					.attr("stroke", "rgb(155,22,79)")
					.attr("stroke-width",2)


				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + (h - padding[2]) + ")")
					.call(xAxis)

				svg.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate(" + (padding[3]) + ",0)")
					.call(yAxis)
			}

			return {
				graphConstructor : graphConstructor,
				readDate : readDate
			}
		})
})();