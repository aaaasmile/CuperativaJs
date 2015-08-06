// file: algorithm_base.js

define([], function () {
    var m_exports = {};

    m_exports.algorithm_base_ctor = function (options, protected) {
        var _log = log_ctor('algorithm_base');
        var that = obj_with_superior_ctor(), _options = options || {};
        var _core = options.core;
        var _prot = protected || obj_with_superior_ctor();
        var _predef_stack = [];

        var ev_name_functions = [
        // leave it empty, use add functions in init() to get a chance to override handlers
        ];

        var channel_ev_name_functions = [
        // leave it empty, use add functions in init() to get a chance to override handlers
        ];

        _prot.channel_name = 'no_channel';

        var channel_name = function () {
            return _prot.channel_name;
        }

        var set_owner = function (player_owner) {
            if (!player_owner) { throw (new Error('player is not defined')); }
            _log.change_nametype('ALGBASE_' + player_owner.name);
            _prot.player_owner = player_owner;
            _prot.channel_name = player_owner.name;
            if (!_prot.channel_name) { throw (new Error('Channel name is not defined')); }
            _log.debug('Owner is ' + _prot.player_owner.name + ' channel name is ' + _prot.channel_name);
        }

        _prot.on_core_player_seat = function (obj_arg) {
            var position = obj_arg.position, name = obj_arg.name, player = obj_arg.player;
            _log.debug('on_core_player_seat,  pos: ' + position + ' name ' + name);
        }

        _prot.on_core_player_has_leaved = function (player) {
            _log.debug('on_core_player_has_leaved, name: ' + player.name);
            if (player === _prot.player_owner) {
                _log.debug(" I leaved the table");
                unsubscribe_core_events();
                unsubscribe_channel();
            }
        }

        _prot.on_core_ask_to_start = function (obj_args) {
            var pls = obj_args.players;
            _log.debug('on_core_ask_to_start num players: ' + pls.length);
            _core.alg_action({ action: 'ok_to_start', player: _prot.player_owner });
        }

        _prot.on_core_new_match = function (obj_args) {
            _log.debug('on_core_new_match ----- > PLEASE AVOID THIS CALL, override it and not call the base function');
        }


        // event handler handle events for all the world
        _prot.add_fn_subscriber = function (name_ev, fn_hdl) {
            ev_name_functions.push({ name: name_ev, fn_handler: fn_hdl });
        }

        // channel function handler are event fired only to this instance, e.g. pesca_carta, new_giocata
        _prot.add_channel_fn_subscriber = function (name_ev, fn_hdl) {
            channel_ev_name_functions.push({ name: name_ev, fn_handler: fn_hdl });
        }

        _prot.replace_or_add_fn_subscriber = function (name_ev, fn_hdl) {
            var i, fn_info, append = true;
            for (i = 0; i < ev_name_functions.length; i++) {
                fn_info = ev_name_functions[i];
                if (name_ev === fn_info.name) {
                    append = false;
                    fn_info.fn_handler = fn_hdl;
                }
            }
            if (append) {
                _prot.add_fn_subscriber(name_ev, fn_hdl);
            }
        }

        _prot.play_from_predef_stack = function () {
            return _predef_stack.pop();
        }

        var add_card_to_predef_stack = function (lbl_arr) {
            _predef_stack.push(lbl_arr);
            _predef_stack = _.flatten(_predef_stack);
        }

        var subscribe_channel = function () {
            var i;
            for (i = 0; i < channel_ev_name_functions.length; i++) {
                _core.channel_subscribe_event(_prot.channel_name,
                    channel_ev_name_functions[i].name,
                    channel_ev_name_functions[i].fn_handler
                )
            }
        }

        var unsubscribe_channel = function () {
            var i;
            for (i = 0; i < channel_ev_name_functions.length; i++) {
                _core.channel_unsubscribe_event(_prot.channel_name,
                    channel_ev_name_functions[i].name,
                    channel_ev_name_functions[i].fn_handler
                )
            }
        }

        var subscribe_core_events = function (fnc) {
            var i;
            for (i = 0; i < ev_name_functions.length; i++) {
                _core.subscribe_event(ev_name_functions[i].name, ev_name_functions[i].fn_handler);
            }
        }

        var unsubscribe_core_events = function (fnc) {
            var i;
            for (i = 0; i < ev_name_functions.length; i++) {
                _core.unsubscribe_event(ev_name_functions[i].name, ev_name_functions[i].fn_handler);
            }
        }

        var init = function () {
            _log.debug('int base');
            _prot.add_fn_subscriber('ev_player_seat', _prot.on_core_player_seat);
            _prot.add_fn_subscriber('ev_ready_for_a_new_match', _prot.on_core_ask_to_start);
            _prot.add_fn_subscriber('ev_new_match', _prot.on_core_new_match);
            _prot.add_fn_subscriber('ev_player_leave', _prot.on_core_player_has_leaved);

            subscribe_core_events();
            subscribe_channel();
        }

        var seat_position = function (pos) {
            _core.alg_action({ action: 'seat_for_play', player: _prot.player_owner, position: pos });
        }

        that.set_owner = set_owner;
        that.channel_name = channel_name;
        that.init = init;
        that.seat_position = seat_position;
        that.add_card_to_predef_stack = add_card_to_predef_stack;

        return that;
    }
    return m_exports;
});