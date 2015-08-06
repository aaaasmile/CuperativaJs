//file: brisc2_view.js

define([],
    function () {
        var m_exports = {};
        var _body_sel, _controller, _menu_ctrl;
        var _log = log_ctor("brisc2_stdalone_view");
        var _tmpl_view = [
            '<div id="toolbarG1">',
            '  <ul id="menuCommands">',
            '    <li command="NewGame" id="btNewGame">Nuova Partita</li>',
            '    <li command="End" id="btEnd">Fine</li>',
            '    <li command="GoHome" id="btGoHome">Torna Indietro</li>',
            '    <li command="GoTest" id="btGoHome">Test</li>',
            '  </ul>',
            '</div>',
            '<div class="container_16">',
            '   <div id=idCanvasGame class="grid_14 g-canvas"></div>',
            '</div><!-- End brisc2_view -->'
           ];

        m_exports.activate = function (opt) {
            _controller = opt.controller_view;
            _body_sel = "#" + opt.root_ctrl;
            $(_body_sel).empty();
            $(_body_sel).append(_tmpl_view.join('\n'));
            $('#btNewGame').click(do_start_game);
            $('#btEnd').click(do_stop_loop);
            $('#btGoHome').click(do_go_home);
            _menu_ctrl = $('#menuCommands').kendoMenu({
                select: onSelectMenuRoom
            }).data("kendoMenu");
        }

        m_exports.deactivate = function () {
            _log.debug("View is deactivated");
        }

        var do_start_game = function () {
            _log.debug('User click start new game');
            _controller.start_new_game();
        }

        var do_go_home = function () {
            _log.debug('User click go home');
            setTimeout(function () {
                _controller.go_home();
            }, 200);
        }

        var do_stop_loop = function () {
            _controller.stop_loop();
        }

        var onSelectMenuRoom = function (e) {
            var cmd = $(e.item).attr("command");
            _log.debug("selected: " + cmd);
            switch (cmd) {
                case 'NewGame':
                    do_start_game();
                    break;
                case 'End':
                    do_stop_loop();
                    break;
                case 'GoHome':
                    do_go_home();
                    break;
                case 'GoTest':
                    _controller.do_test();
                    break;
                default:
                    throw (new Error('Command ' + cmd + ' not recognized'));
            }
        }

        return m_exports;
    }
);
