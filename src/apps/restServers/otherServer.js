/**
 * Created by zhaowei on 16/12/9.
 */
var md = require("../module/other");
md.factory('otherServer', ['$resource', function ($resource) {
    return $resource('ms/:param1/:param2/:param3/:param4/:param5', {}, {
        login: {
            method: 'POST',
            params: {param1: 'login'},
            isArray: false
        },
        saveBrowser:{
            method: 'POST',
            params: {param1: 'loginHistory',param2:"save"},
            isArray: false
        },
        goOut: {
            method: 'GET',
            params: {param1: 'quit'},
            isArray: false
        },
        resetPsw:{
            method:'POST',
            params:{param1:'user',param2:'updatePsw'},
            isArray: false
        },
        getLoginTime:{
            method:'GET',
            params:{param1:'user',param2:'queryUserInfo'},
            isArray: false
        },
        getData:{
            method:'GET',
            params:{param1:'statistics',param2:'jobInfo'},
            isArray: false
        },
        getImportantData:{
            method:'GET',
            params:{param1:'statistics',param2:'getNewImportantFileNum'},
            isArray: true
        },
        zip:{
            method:'GET',
            params:{param1:'user',param2:'setJobPsw'},
            isArray: false
        }

    })
}])
;

