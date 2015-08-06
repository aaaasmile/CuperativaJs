
define(["core/table_info", "core/action_event", "core/algorithm_base"],
function (mod_ti, mod_ae, mod_algb) {
    var m_exports = {};

    m_exports.core_base_ctor = function (options, prote) {
        var _log = log_ctor('core_base');
        var that = obj_with_superior_ctor();
        var _prot = prote || obj_with_superior_ctor();
        var _table = mod_ti.table_info_ctor(), _internal_state = 'undef';
        var _action_queued = mod_ae.action_queued_ctor('alg-action', that);
        var _proc_queue = mod_ae.action_queued_ctor('core-state', that);
        var _num_of_suspend = 0, _suspend_queue_proc = false;
        var _match_state = 'not_started';
        options || (options = {});
        options.target || (options.target = 'develop');

        _prot = mod_ae.eventuality(_prot);
        _prot.table = _table;

        that.IAlg = {}; // algorithm interface

        // alg_xxx enqueued algorithm calls

        var alg_ok_to_start = function (args) {
            _prot.check_state('st_wait_confirm_start_newgame');

            _log.debug('alg_ok_to_start is called: ' + args.player.name);
            _table.confirm_start(args.player);
            if (_table.have_all_players_confirmed_start()) {
                _prot.submit_state_to_queue(_prot.st_start_newgame, 'st_start_newgame');
            }
        }

        var alg_not_ok_to_start = function (args) {
            _prot.check_state('st_wait_confirm_start_newgame');
            _log.debug('alg_not_ok_to_start is called: ' + args.player.name);
            // TODO player leave and state wait for player seat
        }

        var alg_seat_for_play = function (args) {
            _prot.check_state('st_wait_for_player');

            _log.debug('alg_seat_for_play is called: ' + args.player.name);
            _table.seat(args.player, args.position);
            _prot.fire('ev_player_seat', { position: args.position, name: args.player.name, player: args.player });

            if (_table.all_players_seat()) {
                _log.debug("table is full, check if all want to start");
                _prot.submit_state_to_queue(st_prepare_to_start_newgame, 'st_prepare_to_start_newgame');
            }

        }

        var alg_leave_table = function (args) {
            _log.debug('alg_leave_table is called: ' + args.player.name);
            _table.leave(args.player);
            _prot.fire('ev_player_leave', { player: args.player });
            // TODO check if the player was playing because we need a different wait for player seat
        }

        // END - alg_xxx 

        _prot.check_state = function (state_name) {
            if (_internal_state !== state_name) {
                throw (new Error('Event expected in state ' + state_name + ' but now is ' + _internal_state));
            }
        }

        _prot.submit_state_to_queue = function (fnc, state_name, args) {
            if (state_name === undefined || state_name == null || state_name.length <= 0) {
                throw (new Error('State name cannot be null'));
            }
            _internal_state = state_name;
            _proc_queue.submit(fnc, args);
        }

        var get_internal_state = function () {
            return _internal_state;
        }

        _prot.match_start = function () {
            _match_state = 'match_start';
        }

        _prot.match_end = function () {
            _match_state = 'match_terminated';
        }

        that.is_game_ongoing = function () {
            return _match_state === 'match_start';
        }

        that.get_num_of_players = function () {
            return _table.get_num_players();
        }

        that.get_a_player = function (index) {
            return _table.get_a_player(index);
        }

        // st_xxx Stati messi in coda dal core stesso, questi vengono chiamati dalla coda _proc_queue

        var st_wait_for_player = function () {
            _log.debug('st_wait_for_player, free seats are: ' + _table.free_places());
        }

        var st_prepare_to_start_newgame = function () {
            _log.debug('st_prepare_to_start_newgame');
            _prot.fire('ev_ready_for_a_new_match', { players: _table.get_players() });
            _prot.submit_state_to_queue(st_wait_confirm_start_newgame, 'st_wait_confirm_start_newgame');
        }

        var st_wait_confirm_start_newgame = function () {
            _log.debug('st_wait_confirm_start_newgame');

        }

        _prot.st_start_newgame = function () {
            _log.debug('st_start_newgame');
        }

        // st_xxx - end

        _prot.calc_round_players = function (arr_players, first_ix) {
            var ins_point = -1, round_players = [], onlast = true, i;
            for (i = 0; i < arr_players.length; i++) {
                if (i === first_ix) {
                    ins_point = 0;
                    onlast = false;
                }
                if (ins_point === -1) {
                    round_players.push(arr_players[i]);
                }
                else {
                    round_players.splice(ins_point, 0, arr_players[i]);
                }
                ins_point = onlast ? -1 : ins_point + 1;
            }
            return round_players;
        }

        _prot.calc_next_player_ix = function (first_ix) {
            var res = first_ix + 1;
            if (res >= _table.get_num_players()) {
                res = 0;
            }
            return res;
        }

        // INTERFACE IAlg - start

        that.IAlg.subscribe_event = function (event_name, func) {
            if (func === undefined) {
                throw (new Error('Unable to SUBbscribe undefined function for event ' + event_name));
            }
            _prot.subscribe(event_name, func);
        }

        that.IAlg.channel_subscribe_event = function (ch_name, event_name, func) {
            if (ch_name === 'no_channel') {
                throw (new Error('Channel not set'));
            }
            if (func === undefined) {
                throw (new Error('Unable to channel SUBbscribe undefined function for event ' + event_name));
            }
            _prot.channel_subscribe(ch_name, event_name, func);
        }

        that.IAlg.unsubscribe_event = function (event_name, func) {
            if (func === undefined) {
                throw (new Error('Unable to UNsubscribe undefined function for event ' + event_name));
            }
            _prot.unsubscribe(event_name, func);
        }

        that.IAlg.channel_unsubscribe_event = function (ch_name, event_name, func) {
            if (ch_name === 'no_channel') {
                throw (new Error('Channel not set'));
            }
            if (func === undefined) {
                throw (new Error('Unable to channel UNsubscribe undefined function for event ' + event_name));
            }
            _prot.channel_unsubscribe(ch_name, event_name, func);
        }


        that.IAlg.alg_action = function (args) {
            // mette in coda l'azione dell'algoritmo per evitare di interrompere event handler
            _log.debug('Action submitted: ' + JSON.stringify(args));
            var handler_name = 'alg_' + args.action;
            if (_prot.action_to_fun.hasOwnProperty(handler_name)) {
                _action_queued.submit(_prot.action_to_fun[handler_name], args);
            }
            else {
                throw (new Error('Action ' + handler_name + ' not defined in core'));
            }
        };

        that.IAlg.suspend_proc_gevents = function (str) {
            _suspend_queue_proc = true;
            _num_of_suspend += 1;
            _log.debug('suspend_proc_gevents (' + str + ' add lock ' + _num_of_suspend + ')');
        }

        that.IAlg.continue_process_events = function (str1) {
            var str = str1 || '--';
            if (_num_of_suspend <= 0) { return; }
            _num_of_suspend -= 1;
            if (_num_of_suspend <= 0) {
                _num_of_suspend = 0;
                _suspend_queue_proc = false;
                _log.debug('Continue to process core events (' + str + ')');
                that.process_only_one_action();
            } else {
                _log.debug('Suspend still locked (locks: ' + _num_of_suspend + ') (' + str + ')');
            }

        }

        // INTERFACE IAlg - end

        that.clear_gevent = function () {
            _action_queued.clear();
            _proc_queue.clear();
            _num_of_suspend = 0;
        }

        that.process_only_one_action = function () {
            //_proc_queue.log_state();
            //_action_queued.log_state();
            if (_suspend_queue_proc) {
                return 0;
            }
            while (_proc_queue.has_items() && !_suspend_queue_proc) {
                _proc_queue.process_first();
            }
            if (_suspend_queue_proc) {
                return 0;
            }
            if (_action_queued.has_items()) {
                try {
                    _action_queued.process_first();
                } catch (e) {
                    if (options.target === 'develop') {
                        throw (new Error(e));
                    } else {
                        _log.warn('Action ignored beacuse: ' + e);
                    }
                }
            }
            if (_suspend_queue_proc) {
                return 0;
            }
            //_proc_queue.log_state();
            //_action_queued.log_state();

            return _proc_queue.size() + _action_queued.size();
            //return 0;
        }

        that.process_one_item_withoutsuspend = function () {
            _proc_queue.process_first();
            _action_queued.process_first();
            return _proc_queue.size() + _action_queued.size();
        }



        that.get_internal_state = get_internal_state;

        // Initialization stuff, called when all functions are defined; at the end it is the correct place.
        _prot.submit_state_to_queue(st_wait_for_player, 'st_wait_for_player');
        _prot.action_to_fun = {
            alg_seat_for_play: alg_seat_for_play,
            alg_leave_table: alg_leave_table,
            alg_ok_to_start: alg_ok_to_start,
            alg_not_ok_to_start: alg_not_ok_to_start
        };

        return that;

    }

    return m_exports;

});

