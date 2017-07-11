/**
 * Created by zhaowei on 16/12/29.
 */

var md = require("../module/app");
md.service("privilegeServer", privilegeServer);

privilegeServer.$inject = ["$parse", "session"];

function privilegeServer($parse, session) {
    this.getRole = function () {
        var prScope = session.get("scope") ? session.get("scope").split("#%#") : [];
        return prScope;
    };
}
