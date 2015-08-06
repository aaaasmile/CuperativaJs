// file: table_info.js

define(function () {
    var _log = log_ctor('table_info');
    var m_exports = {};

    m_exports.table_info_ctor = function (options) {
        var _myOpt = options || { tot_num_players: 2 };
        _myOpt.tot_num_players = _myOpt.tot_num_players || 2;
        var _players = [];

        var that = {};

        that.seat = function (pl, pos) {
            _log.debug('Seat player ' + pl.name + ' on position: ' + pos);
            _players.push({ player: pl, position: pos, confirmed_start: false });
        }

        that.all_players_seat = function () {
            if (_players.length == _myOpt.tot_num_players) {
                return true;
            }
            return false;
        }

        that.get_players = function () {
            var res = [], i;
            for (i = 0; i < _players.length; i++) {
                res.push(_players[i].player);
            }
            return res;
        }

        that.get_players_forevent = function () {
            var res = [], i;
            for (i = 0; i < _players.length; i++) {
                res.push({ name: _players[i].player.name });
            }
            return res;
        }

        that.get_num_players = function () {
            return _players.length;
        }

        that.get_a_player = function (index) {
            return index >= 0 && index < _players.length ? _players[index].player : undefined;
        }

        that.free_places = function () {
            return _myOpt.tot_num_players - _players.length;
        }

        that.leave = function (player) {
            _players = _players.filter(
            function (el) {
                if (el.player.name !== player.name) {
                    return el;
                }
            }
        )
        }

        that.confirm_start = function (player) {
            var i, pl_info;
            for (i = 0; i < _players.length; i++) {
                pl_info = _players[i];
                if (pl_info.player.name === player.name) {
                    pl_info.confirmed_start = true;
                    break;
                }

            }
        }

        that.have_all_players_confirmed_start = function () {
            var i, count = 0, pl_info;
            for (i = 0; i < _players.length; i++) {
                pl_info = _players[i];
                if (pl_info.confirmed_start === true) {
                    count += 1;
                }
            }
            if (count === _players.length) {
                return true;
            }
            return false;
        }

        that.expect_continue_notification = function () {
            _.each(_players, function (pl_info) {
                pl_info.confirmed_continue = false;
            });
        }

        that.confirm_continue = function (player) {
            var found_player = _.find(_players, function (pl_info) {
                return pl_info.player.name === player.name;
            });
            if (found_player) {
                found_player.confirmed_continue = true;
            } else {
                _log.warn('player ' + player.name + ' not found in the list, ignore confirm');
            }
        }

        that.have_all_players_confirmed_continue = function () {
            var counter = _.countBy(_players, function (pl_info) {
                return pl_info.confirmed_continue;
            });
            return counter['true'] == _players.length;
        }

        return that;
    }


    return m_exports;
});