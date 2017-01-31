
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

/* service layer to add, update, delete the items. */

app.service("TodoService", function(){

    var todoService = {};

    todoService.todoItems = [
     {id : 1, name: 'one', completed: true},
     {id:2, name:'two', completed:true},
     {id:3, name:'three', completed:false}
    ];

/* find the item by item id */

    todoService.findById = function(id){
        for(var item in todoService.todoItems){
            if(todoService.todoItems[item].id == id) {
                return todoService.todoItems[item];
            }
        }
    };

/* delete the item */
    todoService.removeItem = function(entry){
        var index = todoService.todoItems.indexOf(entry);

        todoService.todoItems.splice(index, 1);
    };

/* save the item */
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

/* home controller to list the items */

app.controller("HomeController", ["$scope", "TodoService", function($scope, TodoService) {

    $scope.todoItems = TodoService.todoItems;
    $scope.todoCount = TodoService.todoItems.length;

/* delete the item */
    $scope.removeItem = function(entry){
        TodoService.removeItem(entry);
        $scope.todoCount = TodoService.todoItems.length;
    };

}]);


/* controller to add, update the items */
app.controller("TodoAddListController", ["$scope", "$routeParams", "$location", "TodoService", function($scope, $routeParams, $location, TodoService){

/* if id exists, update the item else add new item */
    if(!$routeParams.id) {
        $scope.todoItem = {id: "", completed: false, name: ""};
        $scope.todoType = "Add";
    }else{
        $scope.todoItem = _.clone(TodoService.findById(parseInt($routeParams.id)));
        $scope.todoType = "Edit";
    }

/* save the item */
    $scope.save = function(){
        TodoService.save( $scope.todoItem );
        $location.path("/");
    };
    
}]);

/* custom directive to list the items */
app.directive("tbTodoItem", function(){
    return{
        restrict: "E",
        templateUrl: "views/todoItem.html"
    }
});