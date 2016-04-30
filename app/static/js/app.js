'use strict';

var app = angular.module('glavApp', ['ngRoute', 'ngCookies']); 



var myapp = function() {};

myapp.prototype.checkUserFields = function(user) {
    return user
        ? user.city && user.email
        : false;
};
myapp.prototype.run  = function(data) {

        if(!data.user || this.checkUserFields(data.user)) {
            app.config(['$routeProvider', function($routeProvide){
            $routeProvide
                .when('/', {
                    templateUrl: 'partials/home.html',
                    controller: 'CoursesCtrl'
                })
                .when('/about',{
                  templateUrl:'partials/profile_form.html',
                  controller:'AboutCtrl'
                })
                .when('/contact', {
                  templateUrl:'partials/contact.html',
                  controller:'ContactCtrl'
                })
                .when('/search',{
                    templateUrl:'partials/search.html',
                    controller:'SearchCtrl'
                })
                .when('/courses/:id',{
                    templateUrl: 'partials/courses-detail.html',
                    controller: 'CourseDetailCtrl'
                })
                .otherwise({
                    redirectTo:'/'
                });
        }]);
        } else {
            app.config(['$routeProvider', function($routeProvide){
            $routeProvide
                .when('/', {
                    templateUrl: 'partials/profile_form.html',
                    controller: 'FormController',
                    resolve : {
                        user: function(){
                            return data.user; // or primitive, or promise or something else
                        }
                    } 
            });
            
        }]);
        }
 
        app.controller('CookieCtrl', ['$cookies', '$scope', function($cookies, $scope){

            var myCookie = $cookies.get('user_id');
            $scope.vivod=myCookie;    

        }]);
    
        app.controller('FormController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies){
            $scope.formInfo = {};
            var myCookie = $cookies.get('user_id');
            $scope.uid = myCookie;
            $scope.saveData = function() {
                $scope.formInfo.id = $scope.uid;
                console.log($scope.formInfo);
                $http({
                    method: "POST",
                    url: '/create_profile',
                    headers: {'Content-Type': 'application/json' },
                    data: {"data": $scope.formInfo}
                }).success(function(data){
                    console.log(data);
                    console.log(headers)
                });
                //$http.post('/create_profile/', data).success(function(data){
                    //���-�� ������ � ����������� � ����� �������.��������� ������ �������
                //})
                
};
            console.log(data)
}]);

        app.controller('SearchCtrl', function($scope, $http, $location){
            $scope.submitFunc = function (form) {

                $scope.res = [];

                // http://127.0.0.1/search
                $http.get("/search", {
                    params: {q: $scope.query}
                })
                .then(
                function (response) {
                    console.log('success');
                    console.log(response.data);
                    $scope.res = response.data;
                    console.log($scope.res)
                },
                function (response) {
                    console.log("Err " + response.status + " " + response.statusText);
                }
            )
            }

        });

        app.config(['$interpolateProvider', function($interpolateProvider) {
          $interpolateProvider.startSymbol('{[');
          $interpolateProvider.endSymbol(']}');
        }]);


        /*phonecatApp.controller('AboutCtrl',[
          '$scope','$http', '$location',
          function($scope) {
          }
        ]);
        
        phonecatApp.controller('ContactCtrl',[
          '$scope','$http', '$location',
          function($scope, $http, $location) {
          }
        ]);*/

        app.controller('CoursesCtrl', function($scope, $http, $location){
            console.log('$location.url() - ', $location.url());
            console.log('$location.path() - ', $location.path());
            console.log('$location.search() - ', $location.search());
            console.log('$location.hash() - ', $location.hash());

            $http.get('/courses').success(function(data){
                    $scope.courses=data;
                })
        });

    };

window.application = new myapp();