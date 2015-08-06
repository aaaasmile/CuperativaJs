
define(['core/game_player', 'games/briscola/alg_briscola', 'games/briscola/core_briscola', 'core/game_replayer'],
function (mod_player, mod_algbri, mod_core_brisc, mod_gamerepl) {
    var _log = log_ctor('test_core_briscola');

    module("basic");

    test('Vincitore mano', function () {
        _log.debug('Test vincitore mano');

        var rnd_mgr = mod_gamerepl.random_manager_ctor();
        rnd_mgr.set_predefined_deck('_2d,_6b,_7s,_Fc,_Cd,_Rd,_Cb,_5d,_Ab,_4s,_Fb,_Cc,_7b,_As,_5s,_6d,_Fs,_Fd,_6c,_5b,_Cs,_6s,_3d,_3b,_4d,_3c,_2b,_7c,_Rs,_4c,_Rb,_2c,_4b,_2s,_Rc,_3s,_5c,_Ad,_7d,_Ac', 0);

        var core = mod_core_brisc.core_briscola_ctor({ rnd_mgr: rnd_mgr });
        var player1 = mod_player.game_player_ctor({ name: 'luz',
            alg: mod_algbri.alg_briscola_ctor({ core: core.IAlg })
        }).init().seat_position(0);

        var player2 = mod_player.game_player_ctor({ name: 'DeGan',
            alg: mod_algbri.alg_briscola_ctor({ core: core.IAlg })
        }).init().seat_position(1);

        // start the game until card are distribuited with a predefined deck
        var state = core.get_internal_state();
        var event_num = 1;
        while (state !== 'st_new_mano'
                    && event_num > 0) {
            event_num = core.process_one_item_withoutsuspend();
            state = core.get_internal_state();
            _log.debug('** Internal state ' + state + ' evnum ' + event_num);
        }

        var carte_giocate = [{ lbl_card: '_2c', player: 'luz' }, { lbl_card: '_4s', player: 'Deg'}];
        core.vincitore_mano(carte_giocate, function (lbl_best, player_best) {
            _log.debug('Best is ' + lbl_best + ' ' + player_best);
            equals(player_best, 'luz', '_2c contro _4s');
        });

        carte_giocate = [{ lbl_card: '_As', player: 'luz' }, { lbl_card: '_5c', player: 'Deg'}];
        core.vincitore_mano(carte_giocate, function (lbl_best, player_best) {
            _log.debug('Best is ' + lbl_best + ' ' + player_best);
            equals(player_best, 'Deg', '_5c contro _As');
        });

        carte_giocate = [{ lbl_card: '_Fs', player: 'luz' }, { lbl_card: '_Cs', player: 'Deg'}];
        core.vincitore_mano(carte_giocate, function (lbl_best, player_best) {
            _log.debug('Best is ' + lbl_best + ' ' + player_best);
            equals(player_best, 'Deg', '_Cs contro _Fs');
        });

    });

    test("test core bricola", function () {

        _log.debug('Test core briscola');
        var core = mod_core_brisc.core_briscola_ctor();

        var player1 = mod_player.game_player_ctor({ name: 'player1',
            alg: mod_algbri.alg_briscola_ctor({ core: core.IAlg })
        }).init().seat_position(0);
        var player2 = mod_player.game_player_ctor({ name: 'player2',
            alg: mod_algbri.alg_briscola_ctor({ core: core.IAlg })
        }).init().seat_position(1);

        var event_num = core.process_only_one_action();
        while (event_num > 0) {
            event_num = core.process_only_one_action();
        }
        _log.debug('Nothing happen anymore, test terminated');
    });

    test("test algoritm play as master", function () {

        _log.debug('Test algoritm play as master');
        var core = mod_core_brisc.core_briscola_ctor({num_segni_match: 1});

        var player1 = mod_player.game_player_ctor({ name: 'player1',
            alg: mod_algbri.alg_briscola_ctor({ core: core.IAlg, level: 'master' })
        }).init().seat_position(0);
        var player2 = mod_player.game_player_ctor({ name: 'player2',
            alg: mod_algbri.alg_briscola_ctor({ core: core.IAlg })
        }).init().seat_position(1);

        var event_num = core.process_only_one_action();
        while (event_num > 0) {
            event_num = core.process_only_one_action();
        }
        _log.debug('Nothing happen anymore, test terminated');
    }, true);

    test("test calcola punteggio", function () {
        var core = mod_core_brisc.core_briscola_ctor();
        var punti = core.calc_punteggio(['_As', '_7c']);
        equals(punti, 11, 'asso e 7');
        equals(core.calc_punteggio(['_Cs', '_Rc']), 7, 'cavallo e re');
    });

    test('Gioca carta in modo scorretto', function () {

        var rnd_mgr = mod_gamerepl.random_manager_ctor();
        rnd_mgr.set_predefined_deck('_2d,_6b,_7s,_Fc,_Cd,_Rd,_Cb,_5d,_Ab,_4s,_Fb,_Cc,_7b,_As,_5s,_6d,_Fs,_Fd,_6c,_5b,_Cs,_6s,_3d,_3b,_4d,_3c,_2b,_7c,_Rs,_4c,_Rb,_2c,_4b,_2s,_Rc,_3s,_5c,_Ad,_7d,_Ac', 1);

        var core = mod_core_brisc.core_briscola_ctor({ rnd_mgr: rnd_mgr });
        var player1 = mod_player.game_player_ctor({ name: 'luz',
            alg: mod_algbri.alg_briscola_ctor({ core: core.IAlg, level: 'predefined' })
        }).init().seat_position(0);

        var player2 = mod_player.game_player_ctor({ name: 'DeGan',
            alg: mod_algbri.alg_briscola_ctor({ core: core.IAlg, level: 'predefined' })
        }).init().seat_position(1);

        player2.algorithm.add_card_to_predef_stack(['_7d', '_2d']);


        var event_num = core.process_only_one_action();
        while (event_num > 0) {
            event_num = core.process_only_one_action();
        }
        _log.debug('Nothing happen anymore, test terminated');

        info = core.get_curr_complete_info();
        equals(info.carte_gioc_mano_corr.length, 1, 'The first card played is invalid, the second card is valid');
        equals(info.carte_gioc_mano_corr[0].lbl_card, '_7d', 'Expect played _7d');
    });

});