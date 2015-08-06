// file: alg_briscola.js

define(["core/algorithm_base", "core/deck_info"],
 function (mod_algbase, mod_deck) {
     var m_exports = {};

     m_exports.alg_briscola_ctor = function (options, protected) {
         var _log = log_ctor('alg_briscola');
         var _options = options || { level: 'dummy', art: 'cpu_alg' };
         _options.timeout_haveplay = options.timeout_haveplay || 700;
         _options.use_delay_before_play = options.use_delay_before_play || false;

         var _prot = protected || obj_with_superior_ctor(); // protected stuff between base objects
         var that = mod_algbase.algorithm_base_ctor(_options, _prot);
         var _core = options.core, _card_played;
         var _points_segno = {}, _opp_names = [], _team_mates = [], _players = [];
         var _level_alg = _options.level || 'dummy';
         var _deck_info = mod_deck.deck_info_dabriscola();
         var _strozzi_on_suite = {}, _num_cards_on_deck = 0, _target_points = 61;
         var _num_cards_on_player_hand = 3, _deck_size = 40, _num_brisc_intavola = 1;
         var _max_numcards_ondeck = 33;
         var _cards_on_hand = [], _briscola = undefined, _alg_player = undefined;

         var init_base = that.superior('init'); // store base object method before owerwrite it because we want to call it
         var set_owner_base = that.superior('set_owner');
         var on_core_new_match_base = _prot.superior('on_core_new_match');

         that.set_owner = function (player_owner) {
             set_owner_base(player_owner);
             _alg_player = player_owner;
             _log.change_nametype('ALG_BRISCOLA_' + player_owner.name);
         }

         _prot.get_num_cards_on_player_hand = function () { return _num_cards_on_player_hand; }
         _prot.get_deck_info = function () { return _deck_info; }
         _prot.get_num_cards_ondeck = function () { return _num_cards_on_deck; }
         _prot.get_max_numcards_ondeck = function () { return _max_numcards_ondeck; }

         var is_opponent = function (index, ix_me) {
             if (ix_me === 0 || ix_me === 2) {
                 if (index === 1 || index === 3) {
                     return true;
                 } else {
                     return false;
                 }
             } else {
                 if (index === 0 || index === 2) {
                     return true;
                 } else {
                     return false;
                 }
             }
         }

         // core event handler start

         _prot.on_core_new_match = function (obj_args) {
             _log.debug('on_core_new_match');
             var players = obj_args.players;
             _target_points = obj_args.target_segno;
             _log.info('New match, ' + _alg_player.name + '  is playing level ' + _level_alg + ' ( game with ' + players.length + ' players)');
             _log.info('Segni to win are ' + obj_args.num_segni + ' score to win the segno is ' + _target_points);
             _players = players;
             _opp_names = [];
             _team_mates = [];
             _points_segno = {};
             var ix_me = 0;
             for (var i = 0; i < players.length; i++) {
                 pl = players[i];
                 if (pl.name === _prot.player_owner.name) {
                     ix_me = i;
                     break;
                 }
             }
             for (i = 0; i < players.length; i++) {
                 pl = players[i];
                 _points_segno[pl.name] = 0;
                 if (is_opponent(i, ix_me)) {
                     _opp_names.push(pl.name);
                 }
                 else {
                     _team_mates.push(pl.name);
                 }
             }
         }

         _prot.on_core_ev_brisc_new_giocata = function (obj_args) {
             var carte_player = obj_args.carte, briscola = obj_args.brisc;
             _log.debug(_prot.player_owner.name + ' on_core_ev_brisc_new_giocata,' +
                 ' carte: ' + carte_player + ' brisc: ' + briscola);
             var str_card = '';
             _.each(["b", "d", "s", "c"], function (segno) {
                 _strozzi_on_suite[segno] = 2;
             });
             _num_cards_on_deck = _deck_size - _num_cards_on_player_hand * _players.length - _num_brisc_intavola;
             assign_carte_on_hand(carte_player);
             _briscola = briscola;
             _.each(_players, function (pl) {
                 _points_segno[pl.name] = 0;
             });
         }

         _prot.card_played = function () {
             return _card_played;
         }

         _prot.on_core_ev_new_mano = function (obj_args) {
             _log.debug('New mano ' + JSON.stringify(obj_args));
             _card_played = [];
         }

         _prot.on_core_ev_pesca_carta = function (obj_args) {
             _log.debug('Pesca carta ' + JSON.stringify(obj_args));
             _cards_on_hand.push(obj_args.carte[0]);
             _num_cards_on_deck -= _players.length;
         }

         _prot.on_core_ev_have_to_play = function (obj_args) {
             var player = obj_args.player_on_turn;
             if (player.name === _prot.player_owner.name) {
                 if (_options.use_delay_before_play) {
                     _log.debug('Delay before play ms: ' + _options.timeout_haveplay);
                     setTimeout(alg_play_acard(), _options.timeout_haveplay);
                 } else {
                     alg_play_acard();
                 }
             }
         }

         _prot.on_core_ev_player_has_played = function (obj_args) {
             var player_name = obj_args.player_name;
             var lbl_card = obj_args.card_played;
             var pos;
             if (player_name === _alg_player.name) {
                 _log.debug('Card played ok ' + lbl_card);
                 pos = _.indexOf(_cards_on_hand, lbl_card);
                 if (pos !== -1) {
                     _cards_on_hand.splice(pos, 1);
                 } else {
                     _log.warn('Card ' + lbl_card + ' not in my hand');
                 }
             }
             _card_played.push(lbl_card);
             var segno = lbl_card[2];
             if (lbl_card[1] === 'A' || lbl_card[1] === '3') {
                 _strozzi_on_suite[segno] -= 1;
             }
         }

         _prot.on_core_ev_player_cardnot_allowed = function (obj_args) {
             _log.error('I have played a card not allowed, try to play again');
             assign_carte_on_hand(obj_args.hand_player);
             alg_play_acard();
         }

         _prot.on_core_ev_mano_end = function (obj_args) {
             //_log.debug('Mano end ' + JSON.stringify(obj_args));
             var player_best = obj_args.player_best,
                carte_prese_mano = obj_args.carte, punti_presi = obj_args.punti;
             _points_segno[player_best.name] += punti_presi
         }

         _prot.on_core_ev_giocataend = function (obj_args) {
         }

         _prot.on_core_ev_matchend = function (obj_args) {
         }

         _prot.on_ev_wait_continue_game = function () {
             _core.alg_action({ action: 'continue_match', player: _alg_player });
         }

         // core event handler end

         var assign_carte_on_hand = function (carte_player) {
             _cards_on_hand = [];
             _.each(carte_player, function (card) {
                 _cards_on_hand.push(card);
             });
         }

         var alg_play_acard = function () {
             _log.debug('alg on play: ' + _alg_player.name + ', cards N: ' + _cards_on_hand.length + ' hand ' + _cards_on_hand);
             var card = undefined;
             switch (_level_alg) {
                 case 'master':
                     card = play_like_a_master();
                     break;
                 case 'predefined':
                     card = _prot.play_from_predef_stack();
                     break;
                 default:
                     card = play_like_a_dummy();
                     break;
             }
             if (card) {
                 _core.alg_action({ action: 'play_card', player: _alg_player, card_played: card });
             } else if (_level_alg !== 'predefined') {
                 throw (new Error('alg_play_acard: Card to be played not found'));
             } else {
                 _log.debug('Unable to play beacuse no card is suggested');
             }

         }

         var play_like_a_master = function () {
             var card;
             switch (_card_played.length) {
                 case 0:
                     card = play_as_master_first();
                     break;
                 case 1:
                     card = play_as_master_second();
                     break;
                 default:
                     throw (new Error('play_like_a_master: not know what to do'));
             }
             return card;
         }

         var play_as_master_first = function () {
             var w_cards = [], segno, card_s, curr_w, lisc_val;
             var min_item;
             _.each(_cards_on_hand, function (card_lbl) {
                 card_s = card_lbl;
                 segno = card_s[2];
                 curr_w = 0;
                 if (card_s[2] === _briscola[2]) { curr_w += 70; }
                 // check if it is an ass or 3
                 if (card_s[1] === 'A') { curr_w += 220; }
                 if (card_s[1] === '3') { curr_w += 200; }
                 if (card_s[1].match(/[24567]/)) {
                     // liscio value
                     lisc_val = parseInt(card_s[1], 10);
                     curr_w += 70 + lisc_val;
                 }
                 if (card_s[1] === 'F') { curr_w += 60; }
                 if (card_s[1] === 'C') { curr_w += 30; }
                 if (card_s[1] === 'R') { curr_w += 20; }
                 // penalty for cards wich are not catch free, for example a 3
                 curr_w += 25 * _strozzi_on_suite[segno];
                 if (_num_cards_on_deck === 1) {
                     // last hand before deck empty
                     // if briscola is big we play a big card
                     if (card_s[2] === _briscola[2]) { curr_w += 60; }
                     if (_briscola[1] === 'A' || _briscola[1] === '3') {
                         if (card_s[1] === 'A') { curr_w -= 220; }
                         if (card_s[1] === '3') { curr_w -= 200; }
                     } else if (_briscola[1] === 'F' || _briscola[1] === 'C' || _briscola[1] === 'R') {
                         if (card_s[1] === 'A') { curr_w -= 180; }
                         if (card_s[1] === '3' && _strozzi_on_suite[segno] === 1) { curr_w -= 160; }
                     }
                 }
                 w_cards.push([card_lbl, curr_w]);
             }); // end weight
             // find a minimum
             min_item = _.min(w_cards, function (item) { return item[1] });
             _log.debug('Play as first: best card ' + min_item[0] + ' (w_cards = ' + w_cards + ')');
             return min_item[0];
         }

         var play_as_master_second = function () {
             var card_avv_s, card_avv_info, max_points_take = 0, max_card_take;
             var min_card_leave, min_points_leave = 120, take_it = [], leave_it = [];
             var card_s, bcurr_card_take, card_curr_info, points;
             var curr_points_me, tot_points_if_take, curr_points_opp, max_card_take_s;
             var card_best_taken_s;

             card_avv_s = _card_played[0];
             card_avv_info = _deck_info.get_card_info(_card_played[0]);
             max_card_take = _cards_on_hand[0];
             min_card_leave = _cards_on_hand[0];
             // build takeit leaveit arrays and store max take and min leave
             _.each(_cards_on_hand, function (card_lbl) {
                 card_s = card_lbl;
                 bcurr_card_take = false;
                 card_curr_info = _deck_info.get_card_info(card_lbl);
                 if (card_s[2] === card_avv_s[2]) {
                     //same suit
                     if (card_curr_info.rank > card_avv_info.rank) {
                         // current card take
                         bcurr_card_take = true;
                         take_it.push(card_lbl);
                     } else {
                         leave_it.push(card_lbl);
                     }
                 } else if (card_s[2] === _briscola[2]) {
                     // this card is a briscola
                     bcurr_card_take = true;
                     take_it.push(card_lbl);
                 } else {
                     leave_it.push(card_lbl);
                 }
                 // check how many points make the card if it take
                 points = card_curr_info.points + card_avv_info.points;
                 if (bcurr_card_take && points > max_points_take) {
                     max_card_take = card_lbl;
                     max_points_take = points;
                 }
                 // or it leave
                 if (!bcurr_card_take && points < min_points_leave) {
                     min_card_leave = card_lbl;
                     min_points_leave = points;
                 }
             });

             curr_points_me = 0;
             _.each(_team_mates, function (name_pl) { curr_points_me += _points_segno[name_pl]; });
             tot_points_if_take = curr_points_me + max_points_take;
             curr_points_opp = 0;
             _.each(_opp_names, function (name_pl) { curr_points_opp += _points_segno[name_pl]; });

             _log.debug('play_as_master_second, cards ' + _cards_on_hand);
             if (take_it.length === 0) {
                 //take_it is not possibile, use leave it
                 _log.debug("play_as_master_second, apply R1")
                 return min_card_leave;
             }
             if (tot_points_if_take > _target_points) {
                 _log.debug("play_as_master_second, apply R2");
                 return max_card_take;
             }
             max_card_take_s = max_card_take;
             if (max_card_take_s[2] === _briscola[2]) {
                 // card that take is briscola, pay attention to play it
                 if (max_points_take >= 20) {
                     _log.debug("play_as_master_second, apply R3");
                     return max_card_take;
                 }
             } else if (max_points_take >= 10 && _num_cards_on_deck > 1) {
                 // take it because strosa
                 _log.debug("play_as_master_second, apply R4");
                 return max_card_take;
             }
             if (min_points_leave === 0) {
                 // don't lose any points, leave it
                 _log.debug("play_as_master_second, apply R10");
                 return min_card_leave;
             }
             if (_num_cards_on_deck === 1) {
                 // last hand before deck empty
                 // if briscola is big we play a big card
                 if (_briscola[1] === 'A' || _briscola[1] === '3') {
                     if (leave_it.length > 0) {
                         _log.debug("play_as_master_second, apply R9");
                         return min_card_leave;
                     } else {
                         // incartato
                         _log.debug("play_as_master_second, apply R9a");
                         return max_card_take;
                     }
                 } else if (_briscola[1] === 'R' || _briscola[1] === 'C' || _briscola[1] === 'F') {
                     if (min_points_leave <= 4) {
                         _log.debug("play_as_master_second, apply R8");
                         return min_card_leave;
                     }
                 }
             }
             if (take_it.length > 0) {
                 // we can take it
                 if (curr_points_opp > 40 && max_points_take > 0) {
                     _log.debug("play_as_master_second, apply R5");
                     return best_taken_card(take_it);
                 }
                 if (min_points_leave > 3 && take_it.length > 1) {
                     // leave-it lose points and I have at least two cards for taken -> take it.
                     _log.debug("play_as_master_second, apply R6");
                     return best_taken_card(take_it);
                 }
                 if (min_points_leave > 5) {
                     card_best_taken_s = best_taken_card(take_it);
                     if (card_best_taken_s[2] === _briscola[2]) {
                         // best card is a briscola
                         if (min_points_leave <= 8 && curr_points_opp < 53
                            && (card_best_taken_s[1] === 'A' || card_best_taken_s[1] === '3')) {
                             // taken with A or 3 is too much forced
                             _log.debug("play_as_master_second, apply R12");
                             return min_card_leave;
                         }
                     }
                     // leave-it loose to many points
                     _log.debug("play_as_master_second, apply R11");
                     return card_best_taken_s;
                 }
                 card_best_taken_s = best_taken_card(take_it);
                 if (card_best_taken_s[2] !== _briscola[2]
                    && !card_s[1].match(/[24567]/)) {
                     // make points without briscola
                     _log.debug("play_as_master_second, apply R13");
                     return card_best_taken_s;
                 }
             }
             // at this point we can only leave-it
             _log.debug("play_as_master_second, apply R7");
             return min_card_leave;
         }

         var best_taken_card = function (take_it) {
             var w_cards = [], card_s, segno, curr_w, lisc_val, min_item;
             _log.debug("calculate best_taken_card");
             _.each(take_it, function (card_lbl) {
                 card_s = card_lbl;
                 segno = card_s[2];
                 curr_w = 0;
                 // check if it is an asso or 3
                 if (card_s[1] === 'A') {
                     curr_w += 9;
                     if (card_s[2] === _briscola[2]) { curr_w += 200; }
                 }
                 if (card_s[1] === '3') {
                     curr_w += 7;
                     if (card_s[2] === _briscola[2]) { curr_w += 170; }
                 }
                 if (card_s[1].match(/[24567]/)) {
                     lisc_val = parseInt(card_s[1], 10);
                     curr_w += 70 + lisc_val;
                     if (card_s[2] === _briscola[2]) { curr_w += 80; }
                 }
                 if (card_s[1] === 'F') {
                     curr_w += 40;
                     if (card_s[2] === _briscola[2]) { curr_w += 130; }
                 }
                 if (card_s[1] === 'C') {
                     curr_w += 30;
                     if (card_s[2] === _briscola[2]) { curr_w += 140; }
                 }
                 if (card_s[1] === 'R') {
                     curr_w += 20;
                     if (card_s[2] === _briscola[2]) { curr_w += 150; }
                 }
                 w_cards.push([card_lbl, curr_w]);
             });
             min_item = _.min(w_cards, function (item) { return item[1] });
             _log.debug('Best card to play on best_taken_card is' + min_item[0] + ' w_cards = ' + w_cards);
             return min_item[0];
         }

         var play_like_a_dummy = function () {
             var ix = parseInt(Math.random() * _cards_on_hand.length, 10);
             return _cards_on_hand[ix];
         }

         var init = function () {
             _log.debug('init alg briscola');
             _prot.add_channel_fn_subscriber('ev_brisc_new_giocata', _prot.on_core_ev_brisc_new_giocata);
             _prot.add_channel_fn_subscriber('ev_pesca_carta', _prot.on_core_ev_pesca_carta);
             _prot.add_channel_fn_subscriber('ev_player_cardnot_allowed', _prot.on_core_ev_player_cardnot_allowed);
             _prot.add_fn_subscriber('ev_new_mano', _prot.on_core_ev_new_mano);
             _prot.add_fn_subscriber('ev_have_to_play', _prot.on_core_ev_have_to_play);
             _prot.add_fn_subscriber('ev_mano_end', _prot.on_core_ev_mano_end);
             _prot.add_fn_subscriber('ev_giocataend', _prot.on_core_ev_giocataend);
             _prot.add_fn_subscriber('ev_matchend', _prot.on_core_ev_matchend);
             _prot.add_fn_subscriber('ev_wait_continue_game', _prot.on_ev_wait_continue_game);
             _prot.add_fn_subscriber('ev_player_has_played', _prot.on_core_ev_player_has_played);

             init_base();
         }

         that.init = init;

         return that;
     }

     return m_exports;
 });