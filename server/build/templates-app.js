angular.module('templates-app', ['app/home/home.tpl.html']);

angular.module("app/home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/home/home.tpl.html",
    "<div class=\"home\">\n" +
    "   <h1>\n" +
    "       {{welcomeMsg}}\n" +
    "   </h1>\n" +
    "</div>");
}]);
