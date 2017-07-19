expenso.config(['$qProvider', function($qProvider){
    $qProvider.errorOnUnhandledRejections(false);

}]);

expenso.filter('searchFor', function(){
    return function(arr, searchString){
        if(!searchString){
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(arr, function(item){
            if(item.title.toLowerCase().indexOf(searchString) !== -1){
                result.push(item);
            }
        });
        return result;
    };
});


expenso.controller('travelController' , ['$scope','$rootScope','$http' ,'$sce', function($scope ,$rootScope, $http , $sce){
    
    $scope.modal_open = function(){
        $('.modal1').modal('open');
    }
    
    $scope.demoFromHTML =  function(x , y , z) {
        console.log(x + y + z);
        var pdf = new jsPDF('p', 'pt', 'letter');
        // source can be HTML-formatted string, or a reference
        // to an actual DOM element from which the text will be scraped.
        source = '<div style="width : 60%"><center><h2 style="font-family:sans-serif;">Bill Update</h2></center><p style="font-size:16px;font-family:sans-serif;">Journey From - '+y+'</p><p style="font-size:16px;font-family:sans-serif;">Journey Till - '+z+'</p><hr/><p style="font-size:18px;font-family:sans-serif;">Price - '+x+' </p><center><img src="../../assests/img/train.png" alt="Ola Logo" height="200" width="500"></center></div>';

        // we support special element handlers. Register them with jQuery-style 
        // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
        // There is no support for any other type of selectors 
        // (class, of compound) at this time.
        specialElementHandlers = {
            // element with id of "bypass" - jQuery style selector
            '#bypassme': function (element, renderer) {
                // true = "handled elsewhere, bypass text extraction"
                return true
            }
        };
        margins = {
            top: 80,
            bottom: 60,
            left: 40,
            width: 522
        };
        // all coords and widths are in jsPDF instance's declared units
        // 'inches' in this case
        pdf.fromHTML(
            source, // HTML string or DOM elem ref.
            margins.left, // x coord
            margins.top, { // y coord
                'width': margins.width, // max width of content on PDF
                'elementHandlers': specialElementHandlers
            },

            function (dispose) {
                // dispose: object with X, Y of the last line add to the PDF 
                //          this allow the insertion of new lines after html
                pdf.save('Bill.pdf');
            }, margins);
    }
    if($scope.all_card_details){
        $scope.error_empty = "No Bills Found!";
    }

    $scope.update = function(val){
        var index = $scope.all_card_details.indexOf(val);
        console.log(index);
        console.log(val);
        $('.modal1').modal('open');
        $scope.taxi_name  = $scope.all_card_details[index].car;
        $scope.start  = $scope.all_card_details[index].starting;
        $scope.end  = $scope.all_card_details[index].ending;
        $scope.price  = $scope.all_card_details[index].price;
        $scope.crn = $scope.all_card_details[index].crn;
        $scope.tier = $scope.all_card_details[index].coach;
        $scope.index_all = index;
        
        
        
    }

    $http.get('../data/train.json').then(function(data){
        console.log(data.data); 

        $scope.all_card_details = data.data;

        $rootScope.train_price = $scope.all_card_details.map(function(a) {return a.price;});

        $rootScope.train_label = $scope.all_card_details.map(function(a) {return 'Bill no '+a.id;});
        
        //        console.log($rootScope.price_all); 
    } , function(data){
        console.log(data.data);
    });

    $scope.remove = function(index){
        $scope.all_card_details.splice(index,1);
        Materialize.toast('Item removed!', 1500);
    }

    $scope.add = function(){
        console.log('OK');
        var push_object ={};
        var i= 3;
        i = i+1;
        push_object = {
            "id": i,
            "category" : "train",
            "price" : $scope.price,
            "starting" : $scope.start,
            "ending" : $scope.end,
            "crn" : $scope.crn,
            "car" :$scope.taxi_name,
            "coach":$scope.tier
        };

        console.log(push_object);
        $scope.all_card_details.unshift (push_object);
        $rootScope.train_price.push(push_object.price);
        //        console.log($rootScope.price_all); 
        $rootScope.train_label.push('Bill no '+push_object.id);
Materialize.toast('Bill Added!', 1500);

    }
    
    $scope.update_add = function(a,b,c,d,e,f,g){
        index = g;
        $scope.all_card_details[index].car = a;
        $scope.all_card_details[index].price = b;
        $scope.all_card_details[index].starting = c;
        $scope.all_card_details[index].ending = d;
        $scope.all_card_details[index].crn = e;
        $scope.all_card_details[index].coach = f;
        $('.modal1').modal('close');
        Materialize.toast('Bill Updated!', 1500);
    }




}]);

expenso.controller('anaController' , ['$scope','$rootScope','$http' ,'$sce', function($scope,$rootScope , $http , $sce){
    


    Highcharts.chart('container', {

        title: {
            text: 'Taxi Bill Expenses Reciept Wise'
        },

        subtitle: {
            text: 'Refreshing May Delete Data'
        },

        yAxis: {
            title: {
                text: 'Price(Rupees)'
            }
        },
        xAxis: {
            categories: $rootScope.label_all
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        series: [{

            data: $rootScope.price_all
        }]

    });

    Highcharts.chart('container1', {

        title: {
            text: 'Train Price Expenses Reciept Wise'
        },

        subtitle: {
            text: 'Refreshing May Delete Data'
        },

        yAxis: {
            title: {
                text: 'Price(Rupees)'
            }
        },
        xAxis: {
            categories: $rootScope.train_label
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        series: [{

            data: $rootScope.train_price
        }]

    });

}]);

expenso.controller('localTravelController' , ['$scope' ,'$rootScope' ,'$http' ,'$sce', function($scope, $rootScope , $http , $sce){
    
    
    $scope.modal_open = function(){
        $('.modal1').modal('open');
    }
    $scope.demoFromHTML =  function(x , y , z) {
        console.log(x + y + z);
        var pdf = new jsPDF('p', 'pt', 'letter');
        // source can be HTML-formatted string, or a reference
        // to an actual DOM element from which the text will be scraped.
        source = '<div style="width : 60%"><center><h2 style="font-family:sans-serif;">Bill Update</h2></center><p style="font-size:16px;font-family:sans-serif;">Journey From - '+y+'</p><p style="font-size:16px;font-family:sans-serif;">Journey Till - '+z+'</p><hr/><p style="font-size:18px;font-family:sans-serif;">Price - '+x+' </p><center><img src="../../assests/img/ola.png" alt="Ola Logo" height="200" width="500"></center></div>';

        // we support special element handlers. Register them with jQuery-style 
        // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
        // There is no support for any other type of selectors 
        // (class, of compound) at this time.
        specialElementHandlers = {
            // element with id of "bypass" - jQuery style selector
            '#bypassme': function (element, renderer) {
                // true = "handled elsewhere, bypass text extraction"
                return true
            }
        };
        margins = {
            top: 80,
            bottom: 60,
            left: 40,
            width: 522
        };
        // all coords and widths are in jsPDF instance's declared units
        // 'inches' in this case
        pdf.fromHTML(
            source, // HTML string or DOM elem ref.
            margins.left, // x coord
            margins.top, { // y coord
                'width': margins.width, // max width of content on PDF
                'elementHandlers': specialElementHandlers
            },

            function (dispose) {
                // dispose: object with X, Y of the last line add to the PDF 
                //          this allow the insertion of new lines after html
                pdf.save('Bill.pdf');
            }, margins);
    }
    if($scope.all_card_details){
        $scope.error_empty = "No Bills Found!";
    }

    $scope.update = function(val){
        var index = $scope.all_card_details.indexOf(val);
        console.log(index);
        console.log(val);
        $('.modal1').modal('open');
        $scope.taxi_name  = $scope.all_card_details[index].car;
        $scope.start  = $scope.all_card_details[index].starting;
        $scope.end  = $scope.all_card_details[index].ending;
        $scope.price  = $scope.all_card_details[index].price;
        $scope.crn = $scope.all_card_details[index].crn;
        $scope.index_pass = index;
    }

    $http.get('../data/data.json').then(function(data){
        console.log(data.data); 

        $scope.all_card_details = data.data;

        $rootScope.price_all = $scope.all_card_details.map(function(a) {return a.price;});

        $rootScope.label_all = $scope.all_card_details.map(function(a) {return 'Bill no '+a.id;});

        //        console.log($rootScope.price_all); 
    } , function(data){
        console.log(data.data);
    });

    $scope.remove = function(index){
        $scope.all_card_details.splice(index,1);
        Materialize.toast('Item removed!', 1500);
    }

    $scope.add = function(){
        //        console.log('OK');
        var push_object ={};
        var i= 3;
        i = i+1;
        push_object = {
            "id": i,
            "category" : "taxi",
            "price" : $scope.price,
            "starting" : $scope.start,
            "ending" : $scope.end,
            "crn" : $scope.crn,
            "car" :$scope.taxi_name
        };

        //        console.log(push_object);
        $scope.all_card_details.unshift (push_object);
        $rootScope.price_all.push(push_object.price);
        //        console.log($rootScope.price_all); 
        $rootScope.label_all.push('Bill no '+push_object.id);
        console.log($rootScope.label_all);
        console.log($rootScope.price_all);
        Materialize.toast('Bill Added!', 1500);

    }
    $scope.update_add = function(a,b,c,d,e,f){
        index = f;
        $scope.all_card_details[index].car = a;
        $scope.all_card_details[index].price = b;
        $scope.all_card_details[index].starting = c;
        $scope.all_card_details[index].ending = d;
        $scope.all_card_details[index].crn = e;
        $('.modal1').modal('close');
        Materialize.toast('Bill Updated!', 1500);
        
    }

}]);

expenso.filter('trustUrl' , function($sce){
    return function(url){
        return $sce.trustAsResourceUrl(url);
    }
});