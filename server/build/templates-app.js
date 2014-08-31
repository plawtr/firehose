angular.module('templates-app', ['app/home/home.tpl.html']);

angular.module("app/home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/home/home.tpl.html",
    "<div class=\"home\">\n" +
    "   <h1>\n" +
    "       {{welcomeMsg}}\n" +
    "   </h1>\n" +
    "\n" +
    "    <input ng-model=\"searchText\" placeholder=\"search\" style=\"color:#000000\">\n" +
    "    <br/>\n" +
    "    <br/>\n" +
    "    <br/>\n" +
    "    <table class=\"reference\" style=\"width:60%\">\n" +
    "        <tbody><tr>\n" +
    "            <th>Message</th>\n" +
    "            <th>Latitude</th>\n" +
    "            <th>Longitude</th>\n" +
    "            <th>Link</th>\n" +
    "        </tr>\n" +
    "        <tr ng-repeat=\"item in data | filter:searchText\">\n" +
    "            <td>{{item.message}}</td>\n" +
    "            <td>{{item.lat}}</td>\n" +
    "            <td>{{item.lng}}</td>\n" +
    "            <td>\n" +
    "                <a ng-href=\"http://www.google.co.uk/maps/@{{item.lat}},{{item.lng}},16z\">go to</a>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tbody></table>\n" +
    "\n" +
    "\n" +
    "</div>");
}]);
