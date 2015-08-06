// file: brisc2_stdalone_contr.js

define(["g1/view/brisc2_view", 'core/game_player',
'games/briscola/alg_briscola', 'games/briscola/core_briscola', 'g1/view/algbri2_gui'],
function (md_view, mod_player, mod_algbri, mod_core_brisc, mod_algbri_gui) {
    var _log = log_ctor("brisc2_stdalone_contr"), _root_name;
    var m_exports = {}, _opt;
    var _core, _blockCoreLoop = false, _core_timeout, _my_gui;

    m_exports.activate = function (opt) {
        _root_name = opt.root_ctrl;
        _parentNavigator = opt.parent_contr;
        _opt = opt;
        opt.controller_view = m_exports;
        md_view.activate(opt);
        _log.debug("Activate");
    }

    m_exports.deactivate = function () {
        m_exports.stop_loop();
        md_view.deactivate();
        _log.debug("Deactivate controller");
    }

    m_exports.go_home = function () {
        _parentNavigator.navigate_to_view('home');
    }

    m_exports.start_new_game = function () {
        if (_core && _core.is_game_ongoing()) {
            _log.warn('Ignore new start because game already ongoing');
            return;
        }

        _log.debug('start new game');
        var name_player_gui = _opt.name_player || 'Anonimo';

        _core = mod_core_brisc.core_briscola_ctor();
        var player1 = mod_player.game_player_ctor({ name: 'Computer',
            alg: mod_algbri.alg_briscola_ctor({ core: _core.IAlg })
        }).init().seat_position(0);

        _my_gui = mod_algbri_gui.alg_gui_bri2_ctor({ core: _core.IAlg, root_ctrl: 'idCanvasGame' });
        var player2 = mod_player.game_player_ctor({ name: name_player_gui,
            alg: _my_gui
        }).init().seat_position(1);
        _blockCoreLoop = false;
        processCoreEvents();
    }

    m_exports.stop_loop = function () {
        _log.debug('Stop core loop');
        _blockCoreLoop = true;
        if (_core_timeout) {
            clearTimeout(_core_timeout);
        }
        _core = null;
    }

    m_exports.do_test = function () {
        _my_gui.do_test();
    }

    var processCoreEvents = function () {
        if (_blockCoreLoop) { return; }

        _core.process_only_one_action();

        _core_timeout = setTimeout(function () {
            processCoreEvents();
        }, 200);
    }

    return m_exports;
}
);
