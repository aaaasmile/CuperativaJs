

define(['../common/core/core_base', "core/algorithm_base", 'core/game_player'
      ]
, function (mod_core_generic, mod_algb, mod_player) {
    var _log = log_ctor('test_generic_core');

    module("basic");

    test("test generic core", function () {

        _log.debug('Test match start');
        var core = mod_core_generic.core_base_ctor({});
        var player1 = mod_player.game_player_ctor({ name: 'player1', alg: mod_algb.algorithm_base_ctor({ core: core }) });
        var player2 = mod_player.game_player_ctor({ name: 'player2', alg: mod_algb.algorithm_base_ctor({ core: core }) });


        core.alg_action({ action: 'seat_for_play', player: player1, position: 0 });
        core.alg_action({ action: 'seat_for_play', player: player2, position: 1 });

        core.alg_action({ action: 'leave_table', player: player1 });

        var player3 = mod_player.game_player_ctor({ name: 'player3', alg: mod_algb.algorithm_base_ctor({ core: core }) });
        player3.init();
        core.alg_action({ action: 'seat_for_play', player: player3, position: 0 });

        var event_num = core.process_only_one_action();
        while (event_num > 0) {
            event_num = core.process_only_one_action();
        }
        _log.debug('Test match terminated');
    });

});