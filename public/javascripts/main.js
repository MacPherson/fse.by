"use strict";

angular.module("app", [])
	.controller("devpackCtrl", function($scope, $http) {
		$scope.text = "";
		$scope.items = [];
		$scope.expanded = false;
		$scope.type = '';
		$scope.tab = 'all';
		$scope.count = 0;

		$scope.showtab = function(index) {
			console.log(index);
			$scope.tab = index
		};

		$scope.typesearch = function(type) {
			$scope.type = type;
		};

		$scope.submit = function(event) {
			$http({
				method: event.target.getAttribute('type'),
				url: event.target.action,
				params: {query: this.text}
			})
			.success(function(res) {
				$scope.items = res.items;
				$scope.expanded = res.items.length > 0;
				$scope.count = res.items.length;
			});
			event.preventDefault();
		}
	});
