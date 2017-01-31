/**
 * Created by Thomas on 5/28/2015.
 */
var app = angular.module('todoApp', ["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider
        .when("/",{
            templateUrl: "views/todoList.html",
            controller: "HomeController"
        })
        .when("/addItem",{
            templateUrl: "views/todoadd.html",
            controller: "TodoAddListController"
        })
        .when('/addItem/edit/:id',{
            templateUrl: 'views/todoAdd.html',
            controller: 'TodoAddListController'
        })
        .otherwise({
            redirectTo: "/"
        })
});

app.service("TodoService", function(){

    var todoService = {};

    todoService.todoItems = [
     {id : 1, name: 'one', completed: true},
     {id:2, name:'two', completed:true},
     {id:3, name:'three', completed:false}
    ];

    /*

    var groceryService = {};

    groceryService.groceryItems = [
        {id: 1, completed: true, itemName: 'milk', date: new Date("October 1, 2014 11:13:00")},
        {id: 2, completed: true, itemName: 'cookies', date: new Date("October 1, 2014 11:13:00")},
        {id: 3, completed: true, itemName: 'ice cream', date: new Date("October 1, 2014 11:13:00")},
        {id: 4, completed: true, itemName: 'potatoes', date: new Date("October 2, 2014 11:13:00")},
        {id: 5, completed: true, itemName: 'cereal', date: new Date("October 3, 2014 11:13:00")},
        {id: 6, completed: true, itemName: 'bread', date: new Date("October 3, 2014 11:13:00")},
        {id: 7, completed: true, itemName: 'eggs', date: new Date("October 4, 2014 11:13:00")},
        {id: 8, completed: true, itemName: 'tortillas', date: new Date("October 5, 2014 11:13:00")}
    ];
*/

    todoService.findById = function(id){
        for(var item in todoService.todoItems){
            if(todoService.todoItems[item].id == id) {
                return todoService.todoItems[item];
            }
        }
    };

    todoService.removeItem = function(entry){
        var index = todoService.todoItems.indexOf(entry);

        todoService.todoItems.splice(index, 1);
    };

    todoService.save = function(entry) {

        var updatedItem = todoService.findById(entry.id);

        if(updatedItem){

            updatedItem.completed = entry.completed;
            updatedItem.name = entry.name;
            updatedItem.id = entry.id;

        }else {
            todoService.todoItems.push(entry);

                console.log(todoService.todoItems.length + ":" +   todoService.todoItems[3].name);
        }

    };


    return todoService;

});

app.controller("HomeController", ["$scope", "TodoService", function($scope, TodoService) {

    $scope.todoItems = TodoService.todoItems;
    $scope.todoCount = TodoService.todoItems.length;

    $scope.removeItem = function(entry){
        TodoService.removeItem(entry);
        $scope.todoCount = TodoService.todoItems.length;
    };
/*
    $scope.markCompleted = function(entry){
        GroceryService.markCompleted(entry);
    };
    */

}]);

app.controller("TodoAddListController", ["$scope", "$routeParams", "$location", "TodoService", function($scope, $routeParams, $location, TodoService){

    if(!$routeParams.id) {
        $scope.todoItem = {id: "", completed: false, name: ""};
        $scope.todoType = "Add";
    }else{
        $scope.todoItem = _.clone(TodoService.findById(parseInt($routeParams.id)));
        $scope.todoType = "Edit";
    }

    $scope.save = function(){
        TodoService.save( $scope.todoItem );
        $location.path("/");
    };
    
}]);

app.directive("tbTodoItem", function(){
    return{
        restrict: "E",
        templateUrl: "views/todoItem.html"
    }
});