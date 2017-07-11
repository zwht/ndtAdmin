/**
 * Created by zhaowei on 16/12/9.
 */
var md = require("../module/task");
md.factory('taskServer', ['$resource', function ($resource) {
    return $resource('ms/:param1/:param2/:param3/:param4/:param5/:param6/:param7', {}, {
        getTaskList: {
            method: 'POST',
            params: {param1: 'jobs', param2: 'processing', param3: 'handler'},
            isArray: false
        },
        FilterTaskList: {
            method: 'POST',
            params: {param1: 'jobs', param2: 'processing', param3: 'handler', param4: "group"},
            isArray: false
        },
        getFilterTaskList: {
            method: 'POST',
            params: {param1: 'jobs', param2: 'processing', param3: 'handler', param4: "group", param5: "assign"},
            isArray: false
        },
        TaskSource: {
            method: 'GET',
            params: {param1: 'targetPost', param2: 'queryAllForSelect'},
            isArray: true
        },
        screenUser: {method: 'GET', params: {param1: 'user'}, isArray: true},
        distribution: {
            method: 'POST',
            params: {param1: 'jobs', param2: 'processing', param3: 'handler', param4: "assign"},
            isArray: false
        },
        getFilterList: {
            method: 'POST',
            params: {param1: 'jobs', param2: 'processing', param3: 'handler', param4: 'group'},
            isArray: false
        },
        getFilterDetailsList: {
            method: 'POST',
            params: {param1: 'jobs', param2: 'processing', param3: 'handler', param4: 'group', param5: 'do'},
            isArray: false
        },
        getFileDetailsList: {
            method: 'GET',
            params: {param1: 'file', param2: 'detail'},
            isArray: true
        },
        getEmailDetailsList: {
            method: 'GET',
            params: {param1: 'file', param2: 'email'},
            isArray: true
        },
        FilterListFinish: {
            method: 'POST',
            params: {
                param1: 'jobs',
                param2: 'processing',
                param3: 'handler',
                param4: 'group',
                param5: 'finish',
                param6: 'filter'
            },
            isArray: false
        },
        reviewFilterListFinish: {
            method: 'POST',
            params: {
                param1: 'jobs',
                param2: 'processing',
                param3: 'handler',
                param4: 'group',
                param5: 'finish',
                param6: 'review'
            },
            isArray: false
        },
        signImportant: {
            method: 'POST',
            params: {param1: 'jobs', param2: 'processing', param3: 'handler', param4: 'filter', param5: 'important'},
            isArray: false
        },
        signUnimportant: {
            method: 'POST',
            params: {param1: 'jobs', param2: 'processing', param3: 'handler', param4: 'filter', param5: 'unimportant'},
            isArray: false
        },
        getFinishJob: {
            method: 'POST',
            params: {param1: 'jobs', param2: 'finish', param3: 'handler'},
            isArray: false
        },
        getTranslate: {
            method: 'GET',
            params: {param1: 'file', param2: 'production'},
            transformResponse: noJsonTransform
        },
        translateBack: {
            method: 'POST',
            params: {param1: 'jobs', param2: 'processing', param3: 'handler', param4: 'back'},
            headers: {'Content-Type': 'text/plain'}
        },
        createAnalyze: {
            method: 'POST',
            params: {param1: 'jobs', param2: 'processing', param3: 'analyze', param4: 'create'},
            isArray: false
        },
        getEmail: {
            method: 'GET',
            params: {param1: 'file', param2: 'email'},
            isArray: true
        },
        getFileDetail: {
            method: 'GET',
            params: {param1: 'file', param2: 'detail'},
            isArray: true
        },
        getFilePdf: {
            method: 'GET',
            params: {param1: 'file', param2: 'pdf'},
            isArray: false
        },
        setFileRead: {
            method: 'POST',
            params: {param1: 'file', param2: 'read', param3: 'save'},
            isArray: false
        },
        setFileNoRead: {
            method: 'POST',
            params: {param1: 'file', param2: 'read', param3: 'delete'},
            isArray: false
        },
        filterAudit: {
            method: 'POST',
            params: {param1: 'jobs', param2: 'processing', param3: 'handler', param4: 'review'},
            isArray: false

        },
        saveTranslate: {
            method: 'POST',
            params: {param1: 'jobs', param2: 'processing', param3: 'handler', param4: 'finish'},
            isArray: false,
            headers: {'Content-Type': 'text/plain'}
        },
        cacheTranslate: {
            method: 'POST',
            params: {param1: 'file', param2: 'production', param3: 'save'},
            headers: {'Content-Type': 'text/plain'},
            isArray: false
        },
        upLoad: {
            method: 'POST',
            params: {param1: 'file', param2: 'updload', param3: 'history'},
            isArray: false
        },
        upLoadDetail: {
            method: 'POST',
            params: {param1: 'file', param2: 'updload', param3: 'history', param4: 'detail'},
            isArray: false
        },
        listFileExport: {
            method: 'GET',
            params: {param1: 'file', param2: 'updload', param3: 'history', param4: 'detail', param5: 'export'},
            isArray: false
        },
        cancelTranslateTask:{
            method: 'POST',
            params: {param1: 'jobs', param2: 'processing', param3: 'handler', param4: 'cancel'},
            isArray: false
        },
        cancelFilterTask: {
            method: 'POST',
            params: {param1: 'jobs', param2: 'processing', param3: 'handler', param4: 'group',param5: 'cancel'},
            isArray: false
        },
        ModifyTime: {
            method: 'POST',
            params: {param1: 'jobs', param2: 'processing', param3: 'handler', param4: 'deadline'},
            isArray: false
        },
        getNoPassList:{
            method:"POST",
            params:{param1:'jobs',param2:"processing",param3:"handler",param4:'notpass'},
            isArray: false
        },
        reCreate:{
            method:"POST",
            params:{param1:'jobs',param2:"processing",param3:"handler",param4:'filter',param5:'recreate'},
            isArray: true
        }
    });
    function noJsonTransform(data) {
        return {data: data};
    }
}]);