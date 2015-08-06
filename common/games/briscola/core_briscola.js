
define(["core/core_base", "core/deck_info", "core/action_event", "games/briscola/alg_briscola", "core/game_replayer"],
 function (mod_coregen, mod_deck, mod_ae, mod_algbri, mod_gamerepl) {
     var m_exports = {};
     var _log = log_ctor('core_briscola');

     m_exports.core_briscola_ctor = function (options, protected) {
         var _myOpt = options || {};
         _myOpt.tot_num_players = _myOpt.tot_num_players || 2;
         _myOpt.num_segni_match = _myOpt.num_segni_match || 2;
         _myOpt.target_points_segno = _myOpt.target_points_segno || 61;

         var _prot = protected || obj_with_superior_ctor();
         var that = mod_coregen.core_base_ctor(_myOpt, _prot);
         var _deck_info = mod_deck.deck_info_dabriscola();
         var _segni_curr_match = {};
         var _match_info = { match_state: 'undefined' };
         var _carte_prese = {}, _carte_in_mano = {}, _mano_count = 0, _player_on_turn;
         var _players = [], _round_players = [], _mazzo_gioco = [], _briscola_in_tav_lbl = '';
         var _carte_gioc_mano_corr = [], _history_mano, _first_player_ix = 0;
         var _points_curr_segno = {};
         var _game_core_recorder = mod_gamerepl.game_core_recorder_ctor();
         var _rnd_mgr = _myOpt.rnd_mgr || mod_gamerepl.random_manager_ctor();
         var _num_of_cards_onhandplayer = 3;
         _prot.deck_info = _deck_info;

         that.set_num_of_cards_onhandplayer = function (num) {
             _num_of_cards_onhandplayer = num;
         }

         that.get_curr_complete_info = function () {
             var info = {};
             info.carte_prese = _carte_prese;
             info.history_mano = _history_mano;
             info.carte_gioc_mano_corr = _carte_gioc_mano_corr;
             info.player_on_turn = _player_on_turn;
             info.briscola_in_tav_lbl = _briscola_in_tav_lbl;
             info.mano_count = _mano_count;
             info.mazzo_gioco = _mazzo_gioco;
             info.carte_in_mano = _carte_in_mano;

             return info;
         }

         _prot.st_start_newgame = function () {
             var i, player;
             _log.debug('st_start_newgame');
             _prot.match_start();
             _match_info.match_state = 'started';
             _match_info.score = [];
             _match_info.end_reason = '';
             _match_info.winner_name = '';
             _segni_curr_match.score = {};

             _log.debug('New game with players count ' + that.get_num_of_players());
             for (i = 0; i < that.get_num_of_players(); i++) {
                 player = that.get_a_player(i);
                 _players.push(player);
                 _segni_curr_match.score[player.name] = 0;
             }
             _first_player_ix = _rnd_mgr.get_first_player(_players.length);
             _game_core_recorder.store_new_match(_players, _myOpt, "Briscola");
             _prot.fire('ev_new_match', { players: _players
                , num_segni: _myOpt.num_segni_match, target_segno: _myOpt.target_points_segno
             });
             _prot.submit_state_to_queue(st_new_giocata, 'st_new_giocata');

         }

         var st_new_giocata = function () {
             var carte_player = [], j, i;
             var player, briscola, data_newgioc, channel_name;

             _log.debug('st_new_giocata');
             _segni_curr_match.segno_state = 'started';
             _carte_prese = {};
             _carte_in_mano = {};
             _carte_gioc_mano_corr = [];
             _history_mano = [];
             _mano_count = 0;
             that.clear_gevent();

             _round_players = _prot.calc_round_players(_players, _first_player_ix);
             _log.debug('First player to play is ' + _round_players[0].name + ' with index ' + _first_player_ix);
             _log.debug('Number of round_players is ' + _round_players.length + ' players size is ' + _players.length);
             for (i = 0; i < _round_players.length; i++) {
                 player = _round_players[i];
                 _log.debug('On this game play the player: ' + _round_players[i].name);
                 _points_curr_segno[player.name] = 0;
                 _carte_prese[player.name] = [];
             }
             create_deck();
             _mazzo_gioco = _rnd_mgr.get_deck(_mazzo_gioco);
             _log.info('Current deck: ' + _mazzo_gioco.join(','));
             _game_core_recorder.store_new_giocata(_mazzo_gioco, _first_player_ix);

             briscola = _mazzo_gioco.pop();
             _briscola_in_tav_lbl = briscola;
             for (i = 0; i < _round_players.length; i++) {
                 player = _round_players[i];
                 for (j = 0; j < _num_of_cards_onhandplayer; j++) {
                     carte_player.push(_mazzo_gioco.pop());
                 }
                 _carte_in_mano[player.name] = carte_player;
                 _carte_prese[player.name] = [];
                 _points_curr_segno[player.name] = 0;
                 data_newgioc = { carte: carte_player, brisc: briscola };
                 channel_name = player.alg.channel_name();
                 _prot.fire_channel(channel_name, 'ev_brisc_new_giocata', data_newgioc);
                 carte_player = [];
             }

             _prot.submit_state_to_queue(st_new_mano, 'st_new_mano');

         }

         var st_new_mano = function () {
             _log.debug('st_new_mano');
             if (_round_players.length === 0) {
                 throw (new Error('round_players is not calculated'));
             }
             _prot.fire('ev_new_mano', { mano_count: _mano_count });

             _prot.submit_state_to_queue(st_continua_mano, 'st_continua_mano');
         }

         var st_continua_mano = function () {
             _log.debug('st_continua_mano');
             _player_on_turn = _.first(_round_players);
             if (_player_on_turn) {
                 _log.debug('Player on turn: ' + _player_on_turn.name);
                 _prot.fire('ev_have_to_play', { player_on_turn: _player_on_turn });
                 _prot.submit_state_to_queue(st_wait_for_play, 'st_wait_for_play');
             } else {
                 _prot.submit_state_to_queue(st_mano_end, 'st_mano_end');
             }
         }

         var st_wait_for_play = function () {
             _log.debug('st_wait_for_play');
         }

         var st_mano_end = function () {
             _log.debug('st_mano_end');
             var lbl_best, player_best, punti_presi;
             var carte_prese_mano = [], str_points = "", first_player_ix;

             vincitore_mano(_carte_gioc_mano_corr, function (cdbest, plbest) {
                 lbl_best = cdbest;
                 player_best = plbest;
                 _log.info('Mano vinta da ' + player_best.name);
             });
             _mano_count += 1;
             _.each(_carte_gioc_mano_corr, function (hash_card) {
                 _carte_prese[player_best.name] = hash_card.lbl_card;
                 carte_prese_mano.push(hash_card.lbl_card);
             });

             first_player_ix = _.indexOf(_players, player_best);
             _round_players = _prot.calc_round_players(_players, first_player_ix);

             punti_presi = calc_punteggio(carte_prese_mano);
             _log.info('Punti fatti nella mano ' + punti_presi);

             _prot.fire('ev_mano_end', { player_best: player_best, carte: carte_prese_mano, punti: punti_presi });
             _history_mano.push(_carte_gioc_mano_corr);
             _carte_gioc_mano_corr = [];
             _points_curr_segno[player_best.name] += punti_presi;
             _.each(_.pairs(_points_curr_segno), function (kv) {
                 str_points += kv[0] + ' = ' + kv[1] + ' ';
             });
             _log.info('Punteggio attuale: ' + str_points);

             if (check_if_giocata_is_terminated()) {
                 _prot.submit_state_to_queue(st_giocata_end, 'st_giocata_end');
             } else if (_mazzo_gioco.length > 0) {
                 _prot.submit_state_to_queue(st_pesca_carta, 'st_pesca_carta');
             } else {
                 _prot.submit_state_to_queue(st_new_mano, 'st_new_mano');
             }
         }

         var st_pesca_carta = function () {
             _log.debug('st_pesca_carta');
             var carte_player = [], briscola_in_tavola = true;
             var data_cartapesc, channel_name;
             if (_mazzo_gioco.length <= 0) {
                 throw (new Error('Deck is empty, programming error'));
             }
             _.each(_round_players, function (player) {
                 carte_player = [];
                 if (_mazzo_gioco.length > 0) {
                     carte_player.push(_mazzo_gioco.pop());
                 } else if (briscola_in_tavola) {
                     carte_player.push(_briscola_in_tav_lbl);
                     briscola_in_tavola = false;
                 } else {
                     throw (new Error('Briscola already assigned, programming error'));
                 }
                 _.each(carte_player, function (c) {
                     _carte_in_mano[player.name].push(c);
                 });
                 if (_carte_in_mano[player.name].length > _num_of_cards_onhandplayer) {
                     throw (new Error('To many cards in hand player ' + player.name));
                 }

                 data_cartapesc = { carte: carte_player };
                 channel_name = player.alg.channel_name();
                 _prot.fire_channel(channel_name, 'ev_pesca_carta', data_cartapesc);

             });

             _log.info('Mazzo rimanenti: ' + _mazzo_gioco.length);
             _prot.submit_state_to_queue(st_new_mano, 'st_new_mano');

         }

         var st_giocata_end = function () {
             var best_pl_points;
             var table = _prot.table;

             _log.debug('st_giocata_end');
             _segni_curr_match.segno_state = 'end';
             best_pl_points = _prot.giocata_end_calc_bestpoints();
             _game_core_recorder.store_end_giocata(best_pl_points);
             _prot.fire('ev_giocataend', { best: best_pl_points });

             table.expect_continue_notification();
         }

         var st_wait_continue_game = function () {
             _log.debug('st_wait_continue_game');
             _first_player_ix = _prot.calc_next_player_ix(_first_player_ix);
             _prot.fire('ev_wait_continue_game');
         }

         var st_match_end = function () {
             _log.debug('st_match_end');
             _match_info.match_state = 'end';
             that.clear_gevent();
             _game_core_recorder.store_end_match(_match_info);
             _prot.fire('ev_matchend', { info: _match_info });
             _prot.match_end();
         }

         _prot.giocata_end_calc_bestpoints = function () {
             _log.debug('calculate best points');
             var best_pl_points, nome_gioc_max;
             var arr = _.pairs(_points_curr_segno);
             best_pl_points = arr.sort(function (a, b) {
                 return a[1] < b[1];
             });
             nome_gioc_max = best_pl_points[0][0];
             if (best_pl_points[0][1] == best_pl_points[1][1]) {
                 _log.info('Game draw all have scored ' + best_pl_points[0][1]);
                 _segni_curr_match.segno_state = 'draw';
             } else {
                 _log.debug('Giocata winner is ' + nome_gioc_max + ' points scored are ' + best_pl_points[0][1]);
                 _log.debug('Giocata result is ' + best_pl_points[0][1] + ' - ' + best_pl_points[1][1]);
                 _segni_curr_match.score[nome_gioc_max] += 1;
             }
             if (_segni_curr_match.score[nome_gioc_max] >= _myOpt.num_segni_match) {
                 _log.debug('Game terminated, winner is ' + nome_gioc_max);

                 arr = _.pairs(_segni_curr_match.score);
                 arr = arr.sort(function (a, b) {
                     return a[1] < b[1];
                 });
                 _.each(arr, function (pair) {
                     _log.debug(pair[0] + ' segni ' + pair[1]);
                     _match_info.score.push(pair);
                 });
                 _match_info.end_reason = 'segni_count';
                 _match_info.winner_name = nome_gioc_max;

                 _prot.submit_state_to_queue(st_match_end, 'st_match_end');
             } else {
                 _prot.submit_state_to_queue(st_wait_continue_game, 'st_wait_continue_game');
             }

             return best_pl_points;
         }

         var check_if_giocata_is_terminated = function () {
             var res = false;
             var tot_num_cards = 0
             _.each(_.values(_carte_in_mano), function (card_arr) {
                 tot_num_cards += card_arr.length;
             });
             //_log.debug('tot_num_cards ' + tot_num_cards);
             tot_num_cards += _mazzo_gioco.length;
             _log.debug('Giocata end? cards yet in game are: ' + tot_num_cards);
             if (tot_num_cards <= 0) {
                 _log.debug('Giocata end beacuse no more cards have to be played');
                 res = true;
             }
             return res;
         }

         var calc_punteggio = function (carte_prese_mano) {
             var punti = 0, card_info;
             _.each(carte_prese_mano, function (card_lbl) {
                 card_info = _deck_info.get_card_info(card_lbl);
                 punti += card_info.points;
             });
             return punti;
         }

         var vincitore_mano = function (carte_giocate, cbres) {
             var lbl_best = null, player_best = null, i;
             var lbl_curr, card_gioc, player_curr;
             var info_cardhash_best, info_cardhash_curr
             for (i = 0; i < carte_giocate.length; i++) {
                 card_gioc = carte_giocate[i];
                 lbl_curr = card_gioc.lbl_card;
                 player_curr = card_gioc.player;
                 if (lbl_best === null) {
                     lbl_best = lbl_curr;
                     player_best = player_curr;
                     continue; // first card is always the best
                 }
                 info_cardhash_best = _deck_info.get_card_info(lbl_best);
                 info_cardhash_curr = _deck_info.get_card_info(lbl_curr);
                 if (is_briscola(lbl_curr) && !is_briscola(lbl_best)) {
                     // current wins because is briscola and best isn't
                     lbl_best = lbl_curr;
                     player_best = player_curr;
                 } else if (!is_briscola(lbl_curr) && is_briscola(lbl_best)) {
                     // best wins because is briscola and current not, do nothing
                 } else {
                     // cards are both briscola or both not, rank decide when both cards are on the same seed
                     if (info_cardhash_curr.segno === info_cardhash_best.segno &&
                        info_cardhash_curr.rank > info_cardhash_best.rank) {
                         // current wins because has the best rank
                         lbl_best = lbl_curr;
                         player_best = player_curr;
                     }
                 }
             }


             cbres(lbl_best, player_best);
         };

         var is_briscola = function (lbl_card) {
             var card_info = _deck_info.get_card_info(lbl_card);
             var card_info_briscola = _deck_info.get_card_info(_briscola_in_tav_lbl);

             return card_info_briscola.segno === card_info.segno;
         }

         var create_deck = function () {
             _log.debug("Create a deck with rank and points");
             _mazzo_gioco = _deck_info.get_cards_on_game().slice();
         }

         var alg_continue_match = function (args) {
             _prot.check_state('st_wait_continue_game');
             var player = args.player;
             var table = _prot.table;

             _log.debug('Player ' + player.name + ' want to continue the match');
             table.confirm_continue(player);
             if (table.have_all_players_confirmed_continue()) {
                 _prot.submit_state_to_queue(st_new_giocata, 'st_new_giocata');
             }

         }

         that.IAlg.allowed_to_play_card = function (player, card_lbl) {
             var cards = _carte_in_mano[player.name];
             var pos = _.indexOf(cards, card_lbl);
             return (pos !== -1) ? true : false;
         }

         var alg_play_card = function (args) {
             _prot.check_state('st_wait_for_play');
             var player = args.player;
             var lbl_card = args.card_played;
             _log.debug('Player ' + player.name + ' has played ' + lbl_card);
             if (_player_on_turn.name !== player.name) {
                 _log.warn('Player ' + player.name + ' not allowed to play now');
                 return;
             }
             var cards = _carte_in_mano[player.name];
             var pos = _.indexOf(cards, lbl_card);
             var data_card_gioc = { player_name: player.name, card_played: lbl_card };
             if (pos !== -1) {
                 _game_core_recorder.store_player_action(player.name, 'cardplayed', player.name, lbl_card);
                 var old_size = _carte_in_mano[player.name].length;
                 _carte_in_mano[player.name].splice(pos, 1);
                 _log.info('++' + _mano_count + ',' + _carte_gioc_mano_corr.length + ',Card ' + lbl_card + ' played from player ' + player.name);
                 _carte_gioc_mano_corr.push({ lbl_card: lbl_card, player: player });
                 _prot.fire('ev_player_has_played', data_card_gioc);
                 _round_players.splice(0, 1);
                 //_log.debug('_carte_in_mano ' + player.name + ' size is ' + _carte_in_mano[player.name].length + ' _round_players size is ' + _round_players.length);
                 //_log.debug('*** new size is ' + _carte_in_mano[player.name].length + ' old size is ' + old_size);
                 _prot.submit_state_to_queue(st_continua_mano, 'st_continua_mano');
             } else {
                 _log.warn('Card ' + lbl_card + ' not allowed to be played from player ' + player.name);
                 data_card_gioc.hand_player = cards;
                 _prot.fire_channel(player.alg.channel_name(), 'ev_player_cardnot_allowed', data_card_gioc);
             }
         }

         _prot.action_to_fun.alg_play_card = alg_play_card;
         _prot.action_to_fun.alg_continue_match = alg_continue_match;

         that.vincitore_mano = vincitore_mano;
         that.calc_punteggio = calc_punteggio;

         return that;
     }


     return m_exports;
 }
);