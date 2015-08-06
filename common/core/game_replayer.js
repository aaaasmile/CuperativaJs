// file: game_replayer.js

define(function() {
    var m_exports = {};

    // GameCoreRecorder
    m_exports.game_core_recorder_ctor = function () {
        var _log = log_ctor('game_recorder');
        var that = {};
        var _info_match = {};

        that.store_new_match = function(players, options, game_name) {
            _info_match = {};
            var pl_names = [], i;
            for (i = 0; i < players.length; i++) {
                var pl = players[i];
                pl_names.push(pl.name);
            }
            _info_match.players = pl_names;
            _info_match.date = (new Date()).getTime();
            _info_match.giocate = [];
            _info_match.game = {name: "" + game_name, opt: {}}
            for (var k in options) {
                if (options.hasOwnProperty((k))) {
                    _info_match.game.opt[k] = options[k];
                }
            }
        }

        that.store_end_match = function(best_pl_segni) {
            _info_match.match_winner = best_pl_segni;
        }

        that.store_new_giocata = function(deck, first_player) {
            var info_giocata = {
                deck:  deck.slice(),
                first_plx: first_player,
                actions: []
            }
            _info_match.giocate.push(info_giocata);
        }

        that.store_end_giocata = function(info_winner) {
            if (info_winner !== undefined && _info_match.giocate.length > 0) {
                var curr_giocata = _info_match.giocate[_info_match.giocate.length - 1];
                curr_giocata.giocata_winner = info_winner;
            }
        }

        that.store_player_action = function(plname, action, args) {
            if (_info_match.giocate.length > 0) {
                var curr_giocata = _info_match.giocate[_info_match.giocate.length - 1];
                var curr_action = {pl_name: plname, type: action, arg:args};
                curr_giocata.actions.push(curr_action);
            }
        }

        that.get_matchinfo_as_string = function(){
            return JSON.stringify(_info_match);
        }

        return that;
    }


    // RandomManager
    m_exports.random_manager_ctor = function () {
        var _log = log_ctor('random_manager');
        var that = {};
        var state = 'rnd_fun', first_player = 0, deck_to_use = [];

        that.reset_rnd = function() {
            state = 'rnd_fun';
        }

        that.set_predefined_deck = function(deck_str, fp) {
            _log.info("CAUTION: Override current deck (set_predefined_deck) " + fp);
            deck_to_use = deck_str.split(",");
            that.set_predefdeck_withready_deck(deck_to_use, fp);
        }

        that.set_predefdeck_withready_deck = function(deck, fp) {
            _log.debug("set a user defined deck");
            deck_to_use = deck;
            state = 'predefined_game';
            first_player = fp;
        }

        that.is_predefined_set = function() {
            return state === 'predefined_game' ? true : false
        }

        that.get_deck = function(base_deck) {
            switch (state) {
                case 'predefined_game':
                    _log.debug("using predifined deck size: " + deck_to_use.length);
                    return deck_to_use.slice();
                    break;
                default:
                    _log.debug("using rnd deck size: " + base_deck.length);
                    return shuffle(base_deck);
                    break;
            }
        }

        that.get_first_player = function(num_of_players) {
            var res = first_player;
            if (state === 'predefined_game') {
                res = first_player;
            }
            else {
                res = parseInt(Math.random() * num_of_players, 10);
            }
            _log.debug('Get first player - random state is : ' + state + ',  first ix: ' + res + ', on total ' + num_of_players);
            return res;
        }

        var shuffle = function(oldArray) {
            var newArray = oldArray.slice();
            var len = newArray.length;
            var i = len;
            while (i--) {
                var p = parseInt(Math.random() * len, 10);
                var t = newArray[i];
                newArray[i] = newArray[p];
                newArray[p] = t;
            }
            return newArray;
        };

        return that;
    }

    return m_exports;

});