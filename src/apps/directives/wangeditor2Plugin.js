(function () {
    var E = window.wangEditor;
    E.createMenu(function (check) {
        var menuId = 'head2';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;
        // 创建 menu 对象
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.head,
            commandName: 'formatBlock'
        });
        // 初始化数据
        var data  = {
            '<h1>': '正文大标题',
            '<h2>': '一级小标题',
            '<h3>': '二级小标题',
            '<p>': '正文'
        };
        /*
         data 需要的结构
         {
         'commandValue': 'title'
         ...
         }
         */
        var isOrderedList;
        function beforeEvent(e) {
            if (editor.queryCommandState('InsertOrderedList')) {
                isOrderedList = true;

                // 先取消有序列表
                editor.command(e, 'InsertOrderedList');
            } else {
                isOrderedList = false;
            }
        }

        function afterEvent(e) {
            if (isOrderedList) {
                // 再设置有序列表
                editor.command(e, 'InsertOrderedList');
            }
        }

        // 创建droplist
        var tpl = '{#commandValue}{#title}';
        menu.dropList = new E.DropList(editor, menu, {
            data: data,
            tpl: tpl,
            // 对 ol 直接设置 head，会出现每个 li 的 index 都变成 1 的问题，因此要先取消 ol，然后设置 head，最后再增加上 ol
            beforeEvent: beforeEvent,
            afterEvent: afterEvent
        });

        // 定义 update selected 事件
        menu.updateSelectedEvent = function () {
            var rangeElem = editor.getRangeElem();
            rangeElem = editor.getSelfOrParentByName(rangeElem, 'h1,h2,h3,p');
            if (rangeElem) {
                return true;
            }
            return false;
        };

        // 增加到editor对象中
        editor.menus[menuId] = menu;
    });
})();