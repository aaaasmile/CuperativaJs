//file: home_view.js

define([],
    function () {
        var m_exports = {};
        var _body_sel, _controller;
        var _log = log_ctor("home_view");
        var _tmpl_view = [
            '<p>Welcome to home</p>',
            '<h3>You are on board!</h3>',
            '<div id=listView></div>'];

        var _kendotempl_item = [
            '<div class="product">',
                '<h3>${productName}</h3>',
                '<p>${kendo.toString(unitPrice, "c")}</p>',
            '</div>'
        ];

        m_exports.activate = function (opt) {
            _controller = opt.controller_view;
            _body_sel = "#" + opt.root_ctrl;
            $(_body_sel).empty();
            $(_body_sel).append(_tmpl_view.join('\n'));

            var products = [{ productName: 'Micro Br2', unitPrice: 45, game_name: 'brisc2' }, { productName: 'Radio', unitPrice: 23}];
            _dataSource = new kendo.data.DataSource({
                data: products
            });

            $("#listView").kendoListView({
                dataSource: _dataSource,
                selectable: true,
                template: kendo.template(_kendotempl_item.join('\n')),
                change: function (e) {
                    var data = _dataSource.view();
                    var sel_game_name = $.map(this.select(), function (item) {
                        return data[$(item).index()].game_name;
                    });
                    _log.debug('Selected game is ' + sel_game_name);
                    if (sel_game_name[0]) {
                        _controller.navigate_to_game(sel_game_name[0]);
                    }
                }
            });
        }

        m_exports.deactivate = function () {
            _log.debug("View is deactivated");
        }

        return m_exports;
    }
);
