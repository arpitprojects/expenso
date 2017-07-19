expenso.config([ '$routeProvider' , '$locationProvider' ,  function($routeProvider , $locationProvider){
    $routeProvider
     .when('/analytics' , {
        templateUrl : 'public/analytics.html',
        controller : 'anaController'
    }) 
     .when('/local' , {
        templateUrl : 'public/local_travel.html',
        controller : 'localTravelController'
    }) 
    .when('/travel' , {
        templateUrl : 'public/travel.html',
        controller : 'travelController'
    }) 
    .otherwise({
       redirectTo :  '/local'
    }); 
    
    $locationProvider.hashPrefix('');
}]);